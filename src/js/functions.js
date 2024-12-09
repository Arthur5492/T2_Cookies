async function login_api(email, password) {
  try {
    const response = await fetch("http://localhost:3000/login", {
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
    const response = await fetch("http://localhost:3000/api/insert-cookie", {
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
    const response = await fetch("http://localhost:3000/api/update-profile", {
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
    const response = await fetch("http://localhost:3000/api/get-user-data", {
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
    const response = await fetch("http://localhost:3000/api/sign-up", {
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


export { login_api, insert_cookie_api, update_profile_api, get_user_data_api, sign_user_api }