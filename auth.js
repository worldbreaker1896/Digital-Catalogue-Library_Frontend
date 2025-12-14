const API_BASE_URL = "https://digital-catalogue-library-backend.onrender.com";

function saveToken(token) {
  localStorage.setItem("library_token", token);
}

function getToken() {
  return localStorage.getItem("library_token");
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.querySelector("form.login-form .email")?.value;
  const password = document.querySelector("form.login-form .password")?.value;
  const message = document.querySelector(".login-message");

  if (message) message.textContent = "";

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      if (message) message.textContent = data.message || "Login failed";
      return;
    }

    saveToken(data.token);
    window.location.href = "./dashboard.html";
  } catch (err) {
    console.error(err);
    if (message) message.textContent = "Server error. Try again.";
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  const username = document.querySelector("form.register-form .username")?.value;
  const email = document.querySelector("form.register-form .email")?.value;
  const password = document.querySelector("form.register-form .password")?.value;
  const message = document.querySelector(".register-message");

  if (message) message.textContent = "";

  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      if (message) message.textContent = data.message || "Registration failed";
      return;
    }

    saveToken(data.token);
    window.location.href = "./dashboard.html";
  } catch (err) {
    console.error(err);
    if (message) message.textContent = "Server error. Try again.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("form.login-form");
  const registerForm = document.querySelector("form.register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLoginSubmit);
  }
  if (registerForm) {
    registerForm.addEventListener("submit", handleRegisterSubmit);
  }
});


