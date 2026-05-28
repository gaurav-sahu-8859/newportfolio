import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [fuser, setFuser] = useState({
    email: "",
    password: "",
  });

  // handle input changes
  const changeHandler = (e) => {
    setFuser({ ...fuser, [e.target.name]: e.target.value });
  };

  // handle submit
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("User login attempt:", fuser);

    // ✅ Example backend call (uncomment if backend exists)
    // fetch("http://localhost:3000/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(fuser)
    // })
    //   .then(res => res.json())
    //   .then(data => console.log("Login success:", data))
    //   .catch(err => console.error("Login error:", err));

    // Clear form after login
    setFuser({ email: "", password: "" });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>

      <form onSubmit={submitHandler} style={styles.form}>
        <input
          type="email"
          name="email"
          value={fuser.email}
          onChange={changeHandler}
          placeholder="Email Address"
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          value={fuser.password}
          onChange={changeHandler}
          placeholder="Password"
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Sign In</button>
        <p style={styles.linkText}>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

// Simple inline styles (same theme as Signup)
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f9fa, #dfe9f3)",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    fontSize: "1rem",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  },
  linkText: {
    marginTop: "10px",
    textAlign: "center",
  },
};
