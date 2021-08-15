import { createRouter, createWebHashHistory } from 'vue-router';
import DomainList from '@/components/DomainList.vue';
import DomainView from '../components/DomainView.vue';

const routes = [
  {
    path: '/domains',
    component: DomainList,
  },
  {
    path: '/domains/:domain',
    component: DomainView,
    props: true,
  },
  {
    path: '/',
    redirect: '/domains',
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
