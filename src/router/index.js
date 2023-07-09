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
        path: 'configuracoes/pagamentos',
        name: 'app.paymentMethods',
        component: () => import('@/views/App/Settings/PaymentMethodsView.vue')
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
      },
      {
        path: 'assinaturas',
        name: 'admin.subscriptions',
        component: () => import('@/views/Admin/Subscriptions/ListView.vue')
      },
      {
        path: 'assinaturas/:subscription_id/mostrar',
        name: 'admin.subscriptions.show',
        component: () => import('@/views/Admin/Subscriptions/ShowView.vue')
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
        path: 'forgot',
        name: 'auth.forgot',
        beforeEnter: middleware.redirectIfAuthenticated,
        component: () => import('@/views/Auth/ForgotView.vue'),
      },
      {
        path: 'update-password',
        name: 'auth.updatePassword',
        beforeEnter: middleware.redirectIfAuthenticated,
        component: () => import('@/views/Auth/UpdatePasswordView.vue'),
      },
      {
        path: 'register',
        name: 'auth.register',
        beforeEnter: middleware.redirectIfAuthenticated,
        component: () => import('@/views/Auth/RegisterView.vue'),
      },
      {
        path: 'verify-account',
        name: 'auth.verify',
        beforeEnter: middleware.redirectIfUnauthenticated,
        component: () => import('@/views/Auth/VerifyView.vue'),
      }
    ]
  },
  {
    path: '/oops',
    component: () => import('@/layouts/oops/Default.vue'),
    children: [
      {
        path: 'notfound',
        name: 'oops.notfound',
        component: () => import('@/views/oops/NotFoundView.vue')
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
