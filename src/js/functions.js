async function login_api(email, password) {
    const response = await fetch("http://localhost:3000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    });

    return response;
}

async function insert_cookie_api(cookie_id) {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3000/api/insert_cookie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
    },
    body: JSON.stringify({ cookie_id }),
    });

    return response;
} 

export { login_api, insert_cookie_api }