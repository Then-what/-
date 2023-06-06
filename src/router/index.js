
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    // 注册页
    {
      path: '/register',
      component: () => import('@/pages/Register.vue'),
      meta: {
        hideTabBar: true
      }
    },
    {
      // 登录页
      path: '/login',
      component: () => import('@/pages/Login.vue'),
      meta: {
        hideTabBar: true
      }
    },
    // 主页
    {
      path: '/home',
      component: () => import('@/pages/home/index.vue'),
      redirect: '/home/homeMain',
      children: [
        {
          path:"homeMain",
          component: () => import('@/pages/home/HomeMain.vue')
        },
        {
          path: "playlist",
          component: ()=>import('@/pages/home/PlayList.vue'),
          meta: {
            hideTabBar: true
          }
        },
        {
          path: "dailyRecommend",
          component: ()=>import('@/pages/home/DailyRecommend.vue'),
          meta: {
            hideTabBar: true
          }
        },
        {
          path: "musicList",
          component: ()=>import('@/pages/home/MusicList.vue'),
          meta: {
            hideTabBar: true
          }
        },
        {
          path: "mv",
          component: ()=>import('@/pages/home/mv.vue'),
          meta: {
            hideTabBar: true
          }
        },
      ]
    },
    // 我的
    {
      path: '/mine',
      component: () => import('@/pages/mine/index.vue'),
      redirect: '/mine/mineMain',
      children: [
        {
          path: 'mineMain',
          component: () => import('@/pages/mine/MineMain.vue')
        },
        {
          path: 'mineLikeMV',
          component: () => import('@/pages/mine/MineLikeMV.vue'),
          meta: {
            hideTabBar: true
          }
        }
      ]
    },
    // 歌单详情
    {
      name: 'playlistDetail',
      path: '/playlistDetail/:playlistId/:del?',
      component: () => import("@/pages/show-pages/PlaylistDetail.vue"),
      meta: {
        hideTabBar: true
      }
    },
    // 搜索页
    {
      name: 'search',
      path: '/search',
      component: ()=>import('@/pages/search/index.vue'),
      redirect: '/search/searchMain',
      children: [
        {
          name: 'searchMain',
          path: 'searchMain/:keyword?',
          component: ()=>import('@/pages/search/SearchMain.vue'),
        }
      ]
    },
    // mv详情页
    {
      name: 'mvDetail',
      path: '/mvDetail/:mvId',
      component: ()=>import('@/pages/show-pages/MvDetail.vue'),
      meta: {
        hideTabBar: true
      }
    },
    // 播放音乐
    {
      name: 'playSong',
      path: '/playSong/:songId',
      component: ()=>import('@/pages/show-pages/play-song.vue'),
      meta: {
        hideTabBar: true
      }
    }
  ]
})

export default router
