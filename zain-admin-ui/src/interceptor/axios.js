import axios from "axios";
// const baseURL = "http://127.0.0.1:8000/blog/api/";
const baseURL = `${import.meta.env.VITE_API_URL}`;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    Authorization: localStorage.getItem("access_token")
      ? "Bearer " + localStorage.getItem("access_token")
      : null,
    "Content-Type": "application/json",
    accept: "application/json",
    "ngrok-skip-browser-warning": "43457",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request URL:", config.url);
    console.log("Request Headers:", JSON.stringify(config.headers, null, 2));
    console.log("Request Data:", JSON.stringify(config.data, null, 2));
    return config;
  },
  (error) => {
    console.log("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (
      error.response.data.code === "token_not_valid" &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

        // exp date in token is expressed in seconds, while now() returns milliseconds:
        const now = Math.ceil(Date.now() / 1000);
        if (tokenParts.exp > now) {
          return axiosInstance
            .post("/token/refresh/", { refresh: refreshToken })
            .then((response) => {
              localStorage.setItem("access_token", response.data.access);
              localStorage.setItem("refresh_token", response.data.refresh);

              axiosInstance.defaults.headers["Authorization"] =
                "Bearer " + response.data.access;
              originalRequest.headers["Authorization"] =
                "Bearer " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("Refresh token is expired", tokenParts.exp, now);
          localStorage.clear();
          window.location.href = "/login/";
        }
      } else {
        localStorage.clear();
        console.log("Refresh token not available.");
        window.location.href = "/login/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;