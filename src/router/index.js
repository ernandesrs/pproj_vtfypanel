// Composables
import { createRouter, createWebHistory } from 'vue-router'
import middleware from '../services/middleware'

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/Default.vue'),
    children: [
      {
        path: '',
        name: 'home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        // beforeEnter: middleware.redirectIfUnauthenticated,
        component: () =>/* webpackChunkName: "home" */ import('@/views/HomeView.vue')
      }
    ]
  },
  {
    path: '/app',
    beforeEnter: middleware.redirectIfUnauthenticated,
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'app.home',
        component: () => import('@/views/App/HomeView.vue'),
      },
      {
        path: 'assinaturas',
        name: 'app.subscriptions',
        component: () => import('@/views/App/Subscriptions/SubscriptionsView.vue')
      },
      {
        path: 'assinaturas/nova-assinatura',
        name: 'app.subscriptions.new',
        component: () => import('@/views/App/Subscriptions/SubscribeView.vue')
      },
      {
        path: 'cartoes',
        name: 'app.cards',
        component: () => import('@/views/App/Cards/CardsView.vue')
      },
      {
        path: 'perfil',
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
        component: () => import('@/views/Admin/Users/ListView.vue'),
      },
      {
        path: 'usuarios/criar',
        name: 'admin.users.create',
        component: () => import('@/views/Admin/Users/FormView.vue'),
      },
      {
        path: 'usuarios/:user_id/editar',
        name: 'admin.users.edit',
        component: () => import('@/views/Admin/Users/FormView.vue'),
      },
      {
        path: 'pacotes',
        name: 'admin.packages',
        component: () => import('@/views/Admin/Packages/ListView.vue')
      },
      {
        path: 'pacotes/criar',
        name: 'admin.packages.create',
        component: () => import('@/views/Admin/Packages/FormView.vue')
      },
      {
        path: 'pacotes/:package_id/editar',
        name: 'admin.packages.edit',
        component: () => import('@/views/Admin/Packages/FormView.vue')
      },
      {
        path: 'funcoes',
        name: 'admin.roles',
        component: () => import('@/views/Admin/Roles/ListView.vue')
      },
      {
        path: 'funcoes/criar',
        name: 'admin.roles.create',
        component: () => import('@/views/Admin/Roles/FormView.vue')
      },
      {
        path: 'funcoes/:role_id/editar',
        name: 'admin.roles.edit',
        component: () => import('@/views/Admin/Roles/FormView.vue')
      }
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
