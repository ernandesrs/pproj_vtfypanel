// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'app.home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
      },
      {
        path: '/assinaturas',
        name: 'app.subscriptions',
        component: () => import('@/views/SubscriptionsView.vue')
      },
      {
        path: '/assinaturas/nova-assinatura',
        name: 'app.subscriptions.new',
        component: () => import('@/views/SubscriptionsNewView.vue')
      },
      {
        path: '/cartoes',
        name: 'app.cards',
        component: () => import('@/views/CardsView.vue')
      },
      {
        path: '/perfil',
        name: 'app.profile',
        component: () => import('@/views/ProfileView.vue')
      }
    ],
  },
  {
    path: '/auth',
    component: () => import(''),
    children: [
      {
        path: 'login',
        name: 'auth.login',
        component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
      },
      {
        path: 'logout',
        name: 'auth.logout',
        component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
