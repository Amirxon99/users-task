import axios from "axios";

const axiosInstance=axios.create({
  baseURL: "http://localhost:5678/api/v1",
})

axiosInstance.interceptors.request.use((config)=>{
  decodeURI(config.url);
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"]=`Bearer ${token}`
  }
  return config
})
export default axiosInstance;
// const setAuthToken = (token) => {
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else delete axios.defaults.headers.common["Authorization"];
// };
// const token = localStorage.getItem("token");
// if (token) {
//   setAuthToken(token);
// }

// export default axios.create({
//   baseURL: "http://localhost:5678/api/v1",
// });

