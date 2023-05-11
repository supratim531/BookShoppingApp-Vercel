import axios from "axios";

// const baseAPI = "http://localhost:8888/api";
// const recommenderAPI = "http://localhost:8000/api";
const baseAPI = "https://900f-49-37-8-153.ngrok-free.app/api";
const recommenderAPI = "https://bookwormfastapi.onrender.com/api";

export const authorizedAxios = (jwt) => axios.create({
  baseURL: baseAPI,
  headers: {
    Authorization: `Bearer ${jwt}`,
    "Access-Control-Allow-Origin": '*',
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  }
});

export const unauthorizedAxios = axios.create({
  baseURL: baseAPI,
  headers: {
    "Access-Control-Allow-Origin": '*',
    "ngrok-skip-browser-warning": "69420",
  }
});

export const recommenderAxios = axios.create({
  baseURL: recommenderAPI
});
