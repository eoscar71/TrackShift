import { toast } from "react-toastify";
import http from '../services/httpService';
import config from "../config.json";

/* Change user password */
export async function changePassword(currentPassword, newPassword) {
    try {
        const response = await http.put(config.apiUrl + '/users', {
            currentPassword: currentPassword,
            newPassword: newPassword
        });
        toast('Password change successful!');
        return response;
    } catch (error) {
        if(error.response.status===400)
            toast.error(error.response.data);
    }
}

/* Delete user account */
export async function deleteAccount() {
    const {data: response} = await http.delete(config.apiUrl + '/users');
    return response;
}

/* Create new user account */
export async function register(email, password) {
    try {
        const response = await http.post(config.apiUrl + '/users', {
            email: email,
            password: password
        });
        
        localStorage.setItem("token", response.headers["x-auth-token"]);
        setLocalStorageItems();
        window.location = "/migrate";
  
        return response;
  
      } catch (error) {  
        if(error.response.status===400)
            toast.error(error.response.data);
      }     
}

/* Login user */
export async function login(email, password) {
    try {
      const response = await http.post(
        config.apiUrl + "/auth/users",
        {
          email: email,
          password: password,
        }
      );
      
      localStorage.setItem("token", response.data);
      setLocalStorageItems();
      window.location = "/migrate";

      return response;

    } catch (error) {

      if(error.response.status===400)
          toast.error('Invalid username or password.');
    }
}

/* Logout user */
export async function logout() {
    localStorage.clear();
    window.location = "/";
}

/* Populate local storage */
function setLocalStorageItems() {
    localStorage.setItem("hasSpotifyAuth", false);
    localStorage.setItem("hasYoutubeAuth", false);
    localStorage.setItem("hasDeezerAuth", false);
}