// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/base/layout/Layout.vue';
import Home from '@/pages/home/Home.vue';
import Robot from '@/pages/robot/Robot.vue';
import WorkDetails from '@/pages/works/WorkDetails.vue';
import CommentsCard from '@/base/cards/CommentsCard.vue';
import Login from '@/pages/login/Login.vue';
import Register from '@/pages/register/Register.vue';
import Profile from '@/pages/profile/Profile.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', 
    name: 'layout', 
    component: Layout,
    children: [
      { 
        path: '', 
        name: 'home',
        component: Home,
      },
      { 
        path: '/profile', 
        name: 'profile',
        component: Profile,
      },
      { 
        path: '/bot', 
        name: 'bot',
        component: Robot,
      },
      { 
        path: '/work/:id', 
        name: 'workDetail',
        component: WorkDetails,
      },

      { 
        path: '/comments', 
        name: 'comments',
        component: CommentsCard,
      },      
    ]
  },  
  { 
    path: '/login', 
    name: 'login',
    component: Login,
  },
  
  { 
    path: '/register', 
    name: 'register',
    component: Register,
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router
