import axios from 'axios';

axios.defaults.baseURL = "http://localhost:5208";

axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);



export default {
  getTasks: async () => {
    const res = await axios.get("/items")    
    return res.data;
  },
  addTask: async(name)=>{
    const res = await axios.post("/items", {name: name, isComplete: false})
    return res.data;
  },

  setCompleted: async(id, isComplete)=>{
   const res = await axios.put(`/items/${id}`, 
    {isComplete: isComplete})
    return res.data;
  },

addTask: async (name) => {
  const res = await axios.post("/items", {
    name: name,
    isComplete: false
  });
  return res.data;
}
};
