import BASE_URL from "../../config-url.js";

async function login_api(email, password) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error at loging in");
    }

    const data = await response.json();
    console.log("Login success:", data);
    localStorage.setItem("token", data.token); // Storage token
    return data;
  } 
  catch (error) {
    throw error;
  }
}

async function insert_cookie_api(cookieId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${BASE_URL}/api/insert-cookie`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cookieId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error at inserting cookie");
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
    const response = await fetch(`${BASE_URL}/api/update-profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email, password, phone, gender, birth_date }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error at updating profile");
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
    const response = await fetch(`${BASE_URL}/api/get-user-data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error at fetching data");
    }

    const data = await response.json();
    console.log("User data successfully loaded:", data);
    return data;
  } 
  catch (error) {
    throw error;
  }
}

async function sign_user_api(name, email, password, phone, gender, birth_date) {
  try {
    const response = await fetch(`${BASE_URL}/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phone,
        gender,
        birth_date,
      }),
    });

    // Verifica se a requisição foi bem-sucedida
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error at signing up");
    }

    // Retorna os dados de resposta
    const data = await response.json();
    console.log("User successfully signed:", data);
    localStorage.setItem("token", data.token); // Storage token
    return data;
  } 
  catch (error) {
    throw error;
  }
}

async function send_notification_countdown_api() {
  try {
    const response = await fetch(`${BASE_URL}/send-notification-countdown`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Notification sent successfully:', result);
    } 
    else {
      console.error('Error sending notification:', result);
    }
  } 
  catch (error) {
    console.error('Failed to send notification:', error);
  }
}

async function authenticate_api() {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found. Redirecting to login...");
      router.push("/login/");
      return;
    }

    const response = await fetch(`${BASE_URL}/api/authenticate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('Authentication successful', result);
    } 
    else {
      console.error('Authentication failed. Redirecting to login...', result);
      localStorage.removeItem("token");
      router.push("/login/");
    }
  } 
  catch (error) {
    console.error("Error during authentication:", error);
    router.push("/login/");  }
}

export { login_api, insert_cookie_api, update_profile_api, get_user_data_api, sign_user_api, send_notification_countdown_api, authenticate_api }