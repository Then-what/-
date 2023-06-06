
<template>
    <div class="tab-bar">
        <van-tabbar active-color="#1989fa" inactive-color="#999999" route>
            <van-tabbar-item 
              v-for="item, index in iconList"
              :icon="item.active"
              :to="item.path"
              :key="index"
              >
                <span>{{ item.title }}</span>
                <template #icon="props">
                  <img :src="props.active ? item.active : item.inactive" />
                </template>
            </van-tabbar-item>
        </van-tabbar>
    </div>
  </template>
  
  <script setup>
import router from '@/router';

    const iconList = [
      {
        title: "主页",
        path: '/home',
        active: require('@/assets/img/tab-icon/home-active.png'),
        inactive: require('../assets/img/tab-icon/home.png'),
      },
      {
        title: "搜索",
        path: '/search',
        active: require('@/assets/img/tab-icon/search-active.png'),
        inactive: require('@/assets/img/tab-icon/search.png'),
      },
      {
        title: "我的",
        path: '/mine',
        active: require('@/assets/img/tab-icon/mine-active.png'),
        inactive: require('../assets/img/tab-icon/mine.png'),
      },

    ]
  
  </script>
  
  <style lang="less" scoped>
    .tab-bar {
      :deep(.van-tabbar-item__icon) {
        font-size: 100px;
      }
      :deep(.van-tabbar) {
        padding: 4px 0;
        box-shadow: 0 -2px 10px -8px #787878;
      }
  
      img {
        height: 26px;
      }
  }
  </style>
  