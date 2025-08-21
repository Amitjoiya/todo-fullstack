import { useEffect, useState } from "react";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(() => alert("Error: Failed to fetch tasks"));
  }, []);

  const addTask = async () => {
    if (!text.trim()) return alert("Task text is required");

    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        return alert("Error: " + errorData.error);
      }

      const newTask = await res.json();
      setTasks([...tasks, newTask]);
      setText("");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const completeTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "PUT" });
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: true } : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", fontFamily: "Arial", marginTop: 40 }}>
      <h1 style={{ textAlign: "center" }}>To-Do List</h1>
      <div style={{ display: "flex", marginBottom: 20 }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Naya task likhiye..."
          style={{ flex: 1, padding: 8, fontSize: 16 }}
        />
        <button onClick={addTask} style={{ marginLeft: 8, padding: "8px 16px" }}>
          Add
        </button>
      </div>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              background: "#f0f0f0",
              marginBottom: 8,
              padding: 8,
              borderRadius: 4,
              textDecoration: task.completed ? "line-through" : "none",
            }}
          >
            <span>{task.text}</span>
            <div>
              {!task.completed && (
                <button onClick={() => completeTask(task.id)} style={{ marginRight: 8 }}>
                  Complete
                </button>
              )}
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p style={{ textAlign: "center" }}>Koi task nahi hai.</p>}
    </div>
  );
}
