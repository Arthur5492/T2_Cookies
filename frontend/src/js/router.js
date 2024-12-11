import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes.js'; // Importa as rotas definidas anteriormente
import validateToken from './app.js'; // Função para validar token

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard Global para validação de autenticação
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token');

  if (to.meta.requiresAuth) {
    // Valida o token
    const isValid = await validateToken(token);

    if (isValid) {
      next(); // Permite o acesso à rota
    } else {
      console.warn("Invalid token, redirecting to Login Page");
      next('/login/'); // Redireciona para login
    }
  } else {
    next(); // Permite acesso a rotas públicas
  }
});

export default router;
