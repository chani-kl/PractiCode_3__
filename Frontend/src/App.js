import React, { useEffect, useState } from "react";
import todoService from "./todoService";
import Login from "./Login";
import "./App.css";

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  useEffect(() => {
    if (isLoggedIn) {
      loadTodos();
    }
  }, [isLoggedIn]);

  const loadTodos = async () => {
    const data = await todoService.getTasks();
    setTodos(data);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo) return;

    const task = await todoService.addTask(newTodo);
    setTodos([...todos, task]);
    setNewTodo("");
  };

  const deleteTodo = async (id) => {
    await todoService.deleteTask(id);
    setTodos(todos.filter(t => t.id !== id));
  };

  const toggleTodo = async (todo) => {
    const updated = await todoService.toggleComplete(todo);
    setTodos(todos.map(t => t.id === updated.id ? updated : t));
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="todo-container">
      <h1>Todo List</h1>

      <form className="todo-form" onSubmit={addTodo}>
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="הקלידי משימה חדשה..."
        />
        <button>הוסף</button>
      </form>

      <ul className="todo-list">
        {todos.map(todo => (
          <li
            key={todo.id}
            className={`todo-item ${todo.isComplete ? "completed" : ""}`}
          >
            <div className="todo-left">
              <input
                type="checkbox"
                checked={todo.isComplete}
                onChange={() => toggleTodo(todo)}
              />
              <span>{todo.name}</span>
            </div>

            <button
              className="delete-btn"
              onClick={() => deleteTodo(todo.id)}
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
