import React, { useEffect, useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showRegister, setShowRegister] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      // כאן תטען את ה-Todos מה-API שלך
      setTodos([]);
    }
  }, [isLoggedIn]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo) return;
    setTodos([...todos, { id: Date.now(), name: newTodo, isComplete: false }]);
    setNewTodo("");
  };

  const toggleTodo = (todo) => {
    setTodos(todos.map(t => t.id === todo.id ? {...t, isComplete: !t.isComplete} : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  if (!isLoggedIn) {
    return showRegister ? (
      <Register onRegister={() => setShowRegister(false)} />
    ) : (
      <Login 
        onLogin={() => setIsLoggedIn(true)} 
        onShowRegister={() => setShowRegister(true)} 
      />
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
