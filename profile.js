const API_BASE_URL = "https://digital-catalogue-library-backend.onrender.com";

function getToken() {
  return localStorage.getItem("library_token");
}

async function loadProfile() {
  const token = getToken();
  const message = document.querySelector(".profile-message");

  if (!token) {
    if (message) message.textContent = "You must be logged in to view your profile.";
    setTimeout(() => {
      window.location.href = "./login_register.html";
    }, 1500);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      if (message) message.textContent = data.message || "Could not load profile.";
      if (res.status === 401) {
        localStorage.removeItem("library_token");
        setTimeout(() => {
          window.location.href = "./login_register.html";
        }, 1500);
      }
      return;
    }

    document.querySelector("#username").value = data.username || "";
    document.querySelector("#email").value = data.email || "";
    document.querySelector("#full_name").value = data.full_name || "";
    document.querySelector("#avatar_url").value = data.avatar_url || "";
    document.querySelector("#bio").value = data.bio || "";
  } catch (err) {
    console.error(err);
    if (message) message.textContent = "Server error while loading profile.";
  }
}

async function handleProfileSubmit(event) {
  event.preventDefault();
  const token = getToken();
  const message = document.querySelector(".profile-message");
  if (!token) {
    if (message) message.textContent = "You must be logged in.";
    return;
  }

  const body = {
    username: document.querySelector("#username").value,
    email: document.querySelector("#email").value,
    full_name: document.querySelector("#full_name").value,
    avatar_url: document.querySelector("#avatar_url").value,
    bio: document.querySelector("#bio").value,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      if (message) message.textContent = data.message || "Update failed.";
      return;
    }

    if (message) message.textContent = "Profile updated successfully.";
  } catch (err) {
    console.error(err);
    if (message) message.textContent = "Server error while updating profile.";
  }
}

async function handleDeleteProfile() {
  const token = getToken();
  const message = document.querySelector(".profile-message");
  if (!token) {
    if (message) message.textContent = "You must be logged in.";
    return;
  }

  if (!confirm("Are you sure you want to delete your account?")) return;

  try {
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      if (message) message.textContent = data.message || "Delete failed.";
      return;
    }

    localStorage.removeItem("library_token");
    if (message) message.textContent = "Account deleted. Redirecting...";
    setTimeout(() => {
      window.location.href = "./index.html";
    }, 1500);
  } catch (err) {
    console.error(err);
    if (message) message.textContent = "Server error while deleting profile.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".profile-form");
  const deleteBtn = document.querySelector(".delete-btn");
  const logoutBtn = document.querySelector(".logout-btn");

  if (form) {
    form.addEventListener("submit", handleProfileSubmit);
  }
  if (deleteBtn) {
    deleteBtn.addEventListener("click", handleDeleteProfile);
  }
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("library_token");
      window.location.href = "./login_register.html";
    });
  }

  loadProfile();
});


