import axios from "axios";
import querystring from "querystring";

axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");
export async function getPlaylists() {
  const { data: playlists } = await axios.get(
    "http://localhost:3900/api/youtube/playlists"
  );
  return playlists;
}

export async function authenticateUser() {
  const jwt = localStorage.getItem("token");
  const redirect_url =
    "http://localhost:3900/api/auth/youtube?" +
    querystring.stringify({ jwt: jwt });
  const w = 500;
  const h = 400;
  const left = window.screenX + (window.outerWidth - w) / 2;
  const top = window.screenY + (window.outerHeight - h) / 2.5;
  const title = `Authenticate -- YouTube Music`;
  const popup = window.open(
    redirect_url,
    title,
    `width=${w},height=${h},left=${left},top=${top}`
  );
  await new Promise((resolve) => {
    const interval = setInterval(() => {
      let hasAuth;
      try {
        hasAuth = localStorage.getItem("hasYoutubeAuth");
      } catch (error) {
        hasAuth = null;
      }

      if (hasAuth === "true" || hasAuth === null) {
        resolve();
        popup.close();
        interval && clearInterval(interval);
      }
    }, 500);
  });
}
