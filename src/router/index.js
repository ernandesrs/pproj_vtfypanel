// Composables
import { createRouter, createWebHistory } from 'vue-router'
import middleware from '../services/middleware'

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
        beforeEnter: middleware.redirectIfUnauthenticated,
        component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
      },
      {
        path: '/assinaturas',
        name: 'app.subscriptions',
        beforeEnter: middleware.redirectIfUnauthenticated,
        component: () => import('@/views/SubscriptionsView.vue')
      },
      {
        path: '/assinaturas/nova-assinatura',
        name: 'app.subscriptions.new',
        beforeEnter: middleware.redirectIfUnauthenticated,
        component: () => import('@/views/SubscriptionsNewView.vue')
      },
      {
        path: '/cartoes',
        name: 'app.cards',
        beforeEnter: middleware.redirectIfUnauthenticated,
        component: () => import('@/views/CardsView.vue')
      },
      {
        path: '/perfil',
        name: 'app.profile',
        beforeEnter: middleware.redirectIfUnauthenticated,
        component: () => import('@/views/ProfileView.vue')
      }
    ],
  },
  {
    path: '/auth',
    component: () => import('@/layouts/auth/Default.vue'),
    children: [
      {
        path: 'login',
        name: 'auth.login',
        beforeEnter: middleware.redirectIfAuthenticated,
        component: () => import('@/views/LoginView.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
