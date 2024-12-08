
import NotFoundPage from '../pages/404.vue';
import AboutPage from '../pages/about.vue';
import ProfilePage from '../pages/profile.vue';
import HomePage from '../pages/home.vue';
import QRCodePage from '../pages/qr-code.vue';
import LoginPage from '../pages/login.vue';
import CookiesPage from '../pages/cookies.vue';
import SignupPage from '../pages/signup.vue';

var initPage = LoginPage;
const token = localStorage.getItem('token');
if (token) {
  initPage = HomePage;
}

var routes = [
  {
    path: '/',
    component: initPage,
  },
  {
    path: '/home/',
    component: HomePage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/profile/',
    component: ProfilePage,
  },
  {
    path: '/qr-code/',
    component: QRCodePage,
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
    path: '/cookies/',
    component: CookiesPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
