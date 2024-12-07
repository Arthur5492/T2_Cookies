async function login_api(email, password) {
  try {
    const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 401) {
        throw new Error(response.message);
      } 
      else {
        throw new Error(errorData.message || "An unexpected error occurred.");
      }
    }

    const data = await response.json();
    console.log("Login success", data);
    localStorage.setItem("token", data.token); // Storage token
    return data;
  } 
  catch (error) {
    throw error;
  }
}

async function insert_cookie_api(cookie_id) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/insert_cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cookie_id }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 403) {
        throw new Error(errorData.message);
      } 
      else if (response.status === 404) {
        throw new Error(errorData.message);
      }
      else if (response.status === 409) {
        throw new Error(errorData.message);
      } 
      else {
        throw new Error(errorData.message || "An unexpected error occurred.");
      }
    }

    const data = await response.json();
    console.log("Cookie successfully added:", data);
    return data;
  } 
  catch (error) {
    throw error;
  }
}

async function update_profile_api(name, email, password, phone, gender, birth_date) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/update_profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password, phone, gender, birth_date }),
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 403) {
        throw new Error(errorData.message);
      } 
      else if (response.status === 404) {
        throw new Error(errorData.message);
      } 
      else {
        throw new Error(errorData.message || "An unexpected error occurred.");
      }
    }

    const data = await response.json();
    console.log("Profile successfully updated:", data);
    return data;
  } 
  catch (error) {
    throw error;
  }
}

async function get_user_data_api() {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/get_user_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      if (response.status === 403) {
        throw new Error(errorData.message);
      } 
      else if (response.status === 404) {
        throw new Error(errorData.message);
      } 
      else {
        throw new Error(errorData.message || "An unexpected error occurred.");
      }
    }

    const data = await response.json();
    console.log("User data successfully loaded:", data);
    return data;
  } 
  catch (error) {
    throw error;
  }
}

export { login_api, insert_cookie_api, update_profile_api, get_user_data_api }