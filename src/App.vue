<template>
  <router-view></router-view>
  <song-bar v-if="store.state.playSongList.isShow ? store.state.playSongList.isShow : isShow"/>
  <TabBar v-show="!$route.meta.hideTabBar"/>
</template>

<script setup>
  import TabBar from '@/components/TabBar.vue';
  import { computed, onMounted } from 'vue';
  import SongBar from './components/song-detail/SongBar.vue';
  import store from './store';
  let isShow = computed(()=>{
    return sessionStorage.getItem('showSongBar');
  });
</script>

<style>
</style>
