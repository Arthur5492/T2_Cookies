
import HomePage from '../pages/home.vue';
import FormPage from '../pages/form.vue';
import CatalogPage from '../pages/catalog.vue';
import ProfilePage from '../pages/profile.vue';
import NotFoundPage from '../pages/404.vue';

var routes = [
  {
    path: '/',
    component: HomePage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/catalog/',
    component: CatalogPage,
  },
  {
    path: '/profile/',
    component: ProfilePage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;