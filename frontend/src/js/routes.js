import NotFoundPage from '../pages/404.vue';
import AboutPage from '../pages/about.vue';
import ProfilePage from '../pages/profile.vue';
import HomePage from '../pages/home.vue';
import QRCodePage from '../pages/qr-code.vue';
import LoginPage from '../pages/login.vue';
import CookiesPage from '../pages/cookies.vue';
import SignupPage from '../pages/signup.vue';

const routes = [
  {
    path: '/',
    redirect: (to) => {
      const token = localStorage.getItem('token');
      return token ? '/home/' : '/login/';
    },
  },
  {
    path: '/home/',
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/about/',
    component: AboutPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/profile/',
    component: ProfilePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/qr-code/',
    component: QRCodePage,
    meta: { requiresAuth: true },
  },
  {
    path: '/cookies/',
    component: CookiesPage,
    meta: { requiresAuth: true },
  },
  {
    path: '/login/',
    component: LoginPage,
  },
  {
    path: '/signup/',
    component: SignupPage,
  },
  {
    path: '/:pathMatch(.*)*',
    component: NotFoundPage,
  },
];

export default routes;
