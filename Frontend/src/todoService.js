import api from "./Api.js";

const getTasks = async () => {
  const res = await api.get("/items");
  return res.data;
};

const addTask = async (name) => {
  const res = await api.post("/items", {
    name,
    isComplete: false
  });
  return res.data;
};

const deleteTask = async (id) => {
  await api.delete(`/items/${id}`);
};

const toggleComplete = async (task) => {
  const res = await api.put(`/items/${task.id}`, {
    ...task,
    isComplete: !task.isComplete
  });
  return res.data;
};

export default {
  getTasks,
  addTask,
  deleteTask,
  toggleComplete
};
