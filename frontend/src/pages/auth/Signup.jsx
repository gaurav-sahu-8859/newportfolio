import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [fuser, setFuser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  // handle input changes
  const changeHandler = (e) => {
    setFuser({ ...fuser, [e.target.name]: e.target.value });
  };

  // handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("User registered:", fuser);

    //  Optionally send data to backend (Node.js / JSON API)
    fetch("http://localhost:3001/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fuser)
    })
      .then(res => res.json())
      .then(data => console.log("Signup success:", data))
      .catch(err => console.error("Signup error:", err));

    // Clear form after submission
    setFuser({ name: "", email: "", password: "", phone: "" });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Register</h1>

      <form onSubmit={submitHandler} style={styles.form}>
        <input
          type="text"
          name="name"
          value={fuser.name}
          onChange={changeHandler}
          placeholder="Full Name"
          required
          style={styles.input}
        />

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

        <input
          type="tel"
          name="phone"
          value={fuser.phone}
          onChange={changeHandler}
          placeholder="Phone Number"
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Sign Up</button>

        <p style={styles.linkText}>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </form>
    </div>
  );
}

// Simple inline styles (you can move this to CSS later)
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #e0eafc, #cfdef3)",
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
