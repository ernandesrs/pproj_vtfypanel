// Composables
import { createRouter, createWebHistory } from 'vue-router'
import middleware from '../services/middleware'

const routes = [
  {
    path: '/',
    beforeEnter: middleware.redirectIfUnauthenticated,
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'app.home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // beforeEnter: middleware.redirectIfUnauthenticated,
        component: () => import(/* webpackChunkName: "home" */ '@/views/HomeView.vue'),
      },
      {
        path: '/assinaturas',
        name: 'app.subscriptions',
        component: () => import('@/views/Subscriptions/SubscriptionsView.vue')
      },
      {
        path: '/assinaturas/nova-assinatura',
        name: 'app.subscriptions.new',
        component: () => import('@/views/Subscriptions/SubscribeView.vue')
      },
      {
        path: '/cartoes',
        name: 'app.cards',
        component: () => import('@/views/Cards/CardsView.vue')
      },
      {
        path: '/perfil',
        name: 'app.profile',
        component: () => import('@/views/ProfileView.vue')
      }
    ],
  },
  {
    path: '/admin',
    beforeEnter: [middleware.redirectIfUnauthenticated, middleware.redirectIfUnauthenticatedOrNotAdmin],
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'admin.home',
        component: () => import('@/views/Admin/HomeView.vue'),
      },
      {
        path: 'usuarios',
        name: 'admin.users',
        component: () => import('@/views/Admin/UsersView.vue'),
      },
    ]
  },
  {
    path: '/auth',
    component: () => import('@/layouts/auth/Default.vue'),
    children: [
      {
        path: 'login',
        name: 'auth.login',
        beforeEnter: middleware.redirectIfAuthenticated,
        component: () => import('@/views/Auth/LoginView.vue'),
      },
      {
        path: 'verify-account',
        name: 'auth.verify',
        beforeEnter: middleware.redirectIfUnauthenticated,
        component: () => import('@/views/Auth/VerifyView.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
