import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes.js'; // Importa as rotas definidas anteriormente
import BASE_URL from '../../config-url.js';


// Validate token with the server
async function validateToken(token) {
  try {
    const response = await fetch(`${BASE_URL}/validate-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Token validated successfully:", result);
      return true;
    } else {
      console.error("Token validation failed:", await response.text());
      return false;
    }
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard Global para validação de autenticação
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth && !token) {
    next('/login/');
  } else if (to.meta.requiresAuth && token) {
    // Validate token here (e.g., using a backend API)
    const isValid = await validateToken(token);

    if (isValid) {
      next();
    } else {
      // Handle token invalidation (e.g., logout, show error message)
      localStorage.removeItem('token');
      next('/login/');
    }
  } else {
    next();
  }
});

export default router;
