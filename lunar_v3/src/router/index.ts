// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/base/layout/Layout.vue';
import Home from '@/pages/home/Home.vue';
import Robot from '@/pages/robot/Robot.vue';
import WorkDetails from '@/pages/works/WorkDetails.vue';

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
        path: '/bot', 
        name: 'bot',
        component: Robot,
      },




      
      { 
        path: '/work/:id', 
        name: 'workDetail',
        component: WorkDetails,
      }
    ]
  }

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router
