
import NotFoundPage from '../pages/404.vue';
import AboutPage from '../pages/about.vue';
import ProfilePage from '../pages/profile.vue';
import HomePage from '../pages/home.vue';
import QRCodePage from '../pages/qr-code.vue';

var routes = [
  {
    path: '/',
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
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
