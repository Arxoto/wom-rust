import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// disable the alt event (window menu)
window.addEventListener("keydown", event => {
  if (event.altKey) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
