import axios from "axios";

axios.defaults.headers.common["x-auth-token"] = localStorage.getItem("token");

export async function changePassword(currentPassword, newPassword) {
    const {data: response} = await axios.put('http://localhost:3900/api/users', {
        currentPassword: currentPassword,
        newPassword: newPassword
    });
    return response;
}

export async function deleteAccount() {
    const {data: response} = await axios.delete('http://localhost:3900/api/users');
    return response;
}

export async function register(email, password) {
    return axios.post('http://localhost:3900/api/users', {
        email: email,
        password: password
    });
}

export async function login(email, password) {
    return axios.post('http://localhost:3900/api/auth/users', {
        email: email,
        password: password
    });
}

export async function logout() {
    localStorage.clear();
    window.location = "/";
}