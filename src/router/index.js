// Composables
import { createRouter, createWebHistory } from 'vue-router'
import middlewares from '../services/middlewares'

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
        // beforeEnter: middlewares.redirectIfUnauthenticated,
        component: () =>/* webpackChunkName: "home" */ import('@/views/HomeView.vue')
      }
    ]
  },
  {
    path: '/app',
    beforeEnter: [
      middlewares.redirectIfUnauthenticated,
      middlewares.inAppPanel
    ],
    component: () => import('@/layouts/default/Default.vue'),
    children: [
      {
        path: '',
        name: 'app.home',
        component: () => import('@/views/App/HomeView.vue'),
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
    beforeEnter: [
      middlewares.redirectIfUnauthenticated,
      middlewares.inAdminPanel
    ],
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
        beforeEnter: [
          middlewares.canAccessListView
        ],
        component: () => import('@/views/Admin/Users/ListView.vue'),
      },
      {
        path: 'usuarios/criar',
        name: 'admin.users.create',
        beforeEnter: [
          middlewares.canAccessCreateView
        ],
        component: () => import('@/views/Admin/Users/FormView.vue'),
      },
      {
        path: 'usuarios/:user_id/editar',
        name: 'admin.users.edit',
        beforeEnter: [
          middlewares.canAccessShowView,
          middlewares.canAccessUpdateView
        ],
        component: () => import('@/views/Admin/Users/FormView.vue'),
      },
      {
        path: 'funcoes',
        name: 'admin.roles',
        beforeEnter: [
          middlewares.canAccessListView
        ],
        component: () => import('@/views/Admin/Roles/ListView.vue')
      },
      {
        path: 'funcoes/criar',
        name: 'admin.roles.create',
        beforeEnter: [
          middlewares.canAccessCreateView
        ],
        component: () => import('@/views/Admin/Roles/FormView.vue')
      },
      {
        path: 'funcoes/:role_id/editar',
        name: 'admin.roles.edit',
        beforeEnter: [
          middlewares.canAccessShowView,
          middlewares.canAccessUpdateView
        ],
        component: () => import('@/views/Admin/Roles/FormView.vue')
      },
      {
        path: 'notificacoes',
        name: 'admin.notifications',
        component: () => import('@/views/Admin/Notifications/ListView.vue')
      },
      {
        path: 'perfil',
        name: 'admin.profile',
        component: () => import('@/views/ProfileView.vue')
      }
    ]
  },
  {
    path: '/auth',
    beforeEnter: [
      middlewares.inAuthPage
    ],
    component: () => import('@/layouts/auth/Default.vue'),
    children: [
      {
        path: 'login',
        name: 'auth.login',
        beforeEnter: [
          middlewares.redirectIfAuthenticated
        ],
        component: () => import('@/views/Auth/LoginView.vue'),
      },
      {
        path: 'forgot',
        name: 'auth.forgot',
        beforeEnter: [
          middlewares.redirectIfAuthenticated
        ],
        component: () => import('@/views/Auth/ForgotView.vue'),
      },
      {
        path: 'update-password',
        name: 'auth.updatePassword',
        beforeEnter: [
          middlewares.redirectIfAuthenticated
        ],
        component: () => import('@/views/Auth/UpdatePasswordView.vue'),
      },
      {
        path: 'register',
        name: 'auth.register',
        beforeEnter: [
          middlewares.redirectIfAuthenticated
        ],
        component: () => import('@/views/Auth/RegisterView.vue'),
      },
      {
        path: 'verify-account',
        name: 'auth.verify',
        beforeEnter: [
          middlewares.redirectIfUnauthenticated
        ],
        component: () => import('@/views/Auth/VerifyView.vue'),
      }
    ]
  },
  {
    path: '/oops',
    beforeEnter: [
      middlewares.inOopsPage
    ],
    component: () => import('@/layouts/oops/Default.vue'),
    children: [
      {
        path: 'notfound',
        name: 'oops.notfound',
        component: () => import('@/views/Oops/NotFoundView.vue')
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    beforeEnter: (to, from, next) => {
      sessionStorage.setItem('APP_NOTFOUND', to.fullPath);
      next({ name: 'oops.notfound' });
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
