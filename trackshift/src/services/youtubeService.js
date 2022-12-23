import http from '../services/httpService';
import querystring from 'querystring';
import config from "../config.json";

/* Get YouTube Music playlists */
export async function getPlaylists() {
  const { data: playlists } = await http.get(
    config.apiUrl + "/youtube/playlists"
  );
  return playlists;
}

/* Create YouTube Music playlists */
export async function createPlaylists(playlists) {
  const { data: createdPlaylists } = await http.post(
    config.apiUrl + "/youtube/playlists",
    playlists
  );
  return createdPlaylists;
}

/* Authenticate YouTube Music user */
export async function authenticateUser() {
  const jwt = localStorage.getItem("token");
  const redirect_url =
    config.apiUrl + "/auth/youtube?" +
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
