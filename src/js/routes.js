
import NotFoundPage from '../pages/404.vue';
import AboutPage from '../pages/about.vue';
import FormPage from '../pages/form.vue';
import HomePage from '../pages/home.vue';

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
    path: '/form/',
    component: FormPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
