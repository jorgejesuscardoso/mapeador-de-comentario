// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Layout from '@/base/layout/Layout.vue';
import Home from '@/pages/home/Home.vue';
import Robot from '@/pages/robot/Robot.vue';
import Login from '@/pages/login/Login.vue';
import Register from '@/pages/register/Register.vue';
import Profile from '@/pages/profile/Profile.vue';
import Edit from '@/pages/profile/Edit.vue';
import Members from '@/pages/members/Members.vue';
import ThirdPersonProfile from '@/pages/profile/thirdPersonProfile.vue';
import TierList from '@/base/gamification/tierList.vue';
import HousesCard from '@/pages/houses/HousesCard.vue';
import ShopLunar from '@/pages/shop/ShopLunar.vue';
import Orders from '@/pages/shop/Orders.vue';
import MyFrame from '@/pages/video/MyFrame.vue';

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
        path: '/profile/orders', 
        name: 'orders',
        component: Orders,
      }, 
      { 
        path: '/profile', 
        name: 'profile',
        component: Profile,
      },    
      { 
        path: '/profile/edit', 
        name: 'profileEdit',
        component: Edit,
      },   
      { 
        path: '/profile/:user', 
        name: 'profileThirdPerson',
        component: ThirdPersonProfile,
      },
      { 
        path: '/shop', 
        name: 'shop',
        component: ShopLunar,
      },
      { 
        path: '/work/:id', 
        name: 'workDetail',
        component: () => import('@/pages/works/WorkDetails.vue'),
        props: true
      },

      { 
        path: '/comments', 
        name: 'comments',
        component: () => import('@/base/cards/CommentsCard.vue'),
        props: true
      },  
      { 
        path: '/members', 
        name: 'members',
        component: Members,
      },  
      { 
        path: '/tierlist', 
        name: 'tierList',
        component: TierList,
      },     
      { 
        path: '/houses', 
        name: 'houses',
        component: HousesCard,
      },   
      { 
        path: '/stream', 
        name: 'stream',
        component: MyFrame,
      }, 
      { 
        path: '/v1/origins', 
        name: 'originalsLunar',
        component: () => import('../pages/originals/OriginalsLunar.vue'),
      },
      {
        path: '/v1/origins/mywork/write/:bookId/:chapterId',
        name: 'wiretMyWork',
        component: () => import('../pages/originals/work/BookPageEditor.vue')
      },
      {
        path: '/v1/origins/mywork/cover',
        name: 'wireMyWorkCover',
        component: () => import('../pages/originals/work/UploadCover.vue')
      },
      {
        path: '/v1/origins/user/:user',
        name: 'myOriginProfile',
        component: () => import('../pages/originals/OriginsProfile.vue')
      },
      {
        path: '/v1/origins/mywork/detail/:bookId',
        name: 'myWorkDetail',
        component: () => import('../pages/originals/work/Detail.vue')
      },
      {
        path: '/v1/origins/mywork/list',
        name: 'myWorkList',
        component: () => import('../pages/originals/OriginsProfile.vue')
      },
      {
        path: '/v1/origins/work/create',
        name: 'workCreate',
        component: () => import('../pages/originals/work/Create.vue')
      },
      {
        path: '/sobre',
        name: 'Sobre',
        component: () => import('../pages/about/Sobre.vue')
      },
      {
        path: '/privacidade',
        name: 'Privacidade',
        component: () => import('../pages/therms/Privacidade.vue')
      },
      {
        path: '/termos',
        name: 'Termos',
        component: () => import('../pages/therms/Termos.vue')
      }

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
