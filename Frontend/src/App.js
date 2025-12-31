import React, { useState, useEffect } from "react";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (isLoggedIn) loadTodos();
  }, [isLoggedIn]);

  const loadTodos = async () => {
    const res = await fetch(`${API_URL}/todos`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    setTodos(data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo) return;
    const res = await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: newTodo }),
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setNewTodo("");
  };

  const toggleTodo = async (todo) => {
    const res = await fetch(`${API_URL}/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ isComplete: !todo.isComplete }),
    });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === updated.id ? updated : t));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setTodos(todos.filter(t => t.id !== id));
  };

  if (!isLoggedIn) {
    return showRegister ? (
      <Register onRegister={() => setShowRegister(false)} />
    ) : (
      <Login onLogin={() => setIsLoggedIn(true)} onShowRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <div className="container">
      <h1>Todo List</h1>
      <form onSubmit={addTodo}>
        <input
          placeholder="הקלידי משימה חדשה..."
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
        />
        <button type="submit">הוסף</button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className={todo.isComplete ? "completed" : ""}>
            <span onClick={() => toggleTodo(todo)}>{todo.name}</span>
            <button onClick={() => deleteTodo(todo.id)}>✖</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
