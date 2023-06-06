<template>
  <div class="detail-main">
    <van-row v-for="item,index in songData" :key="item.id" class="detail-main-item" :class="{'active': item.id === currentPlaySongId}">

      <van-col class="item-num" span="3">{{index+1}}</van-col>

      <van-col class="item-main" span="12">
        <span class="ellipsis2">{{ item.name }}</span>
        <span class="ellipsis2">{{ arNames(item.ar, 'name') }}</span>
      </van-col>

      <van-col class="item-time" span="4">{{ formatTime(item.dt)}}</van-col>
      <van-col class="item-btns" span="5">
        <i style="font-size: 20px; font-weight: bold;" 
        class="iconfont icon-bofang" 
        @click="changeShow(item.id, songData)"></i>

        <i @click="showMore = true; getUserData(); opSongData.currentSongId = item.id" style="font-size: 20px; margin-left: 10px;"  class="iconfont icon-gengduo"></i>
      </van-col>
    </van-row>
  </div>

  <!-- 更多操作按钮 -->
  <van-popup
    v-model:show="showMore"
    position="bottom"
    :style="{ height: '15%' }"
  >
    <van-row class="more-box">
      <van-col @click="showPlaylist = true; showMore = false" span="12" class="more-item">
        <i class="iconfont icon-tianjia"></i>
        <span>添加到歌单</span>
      </van-col>
      <van-col @click="opSong(playlistId, 'del')" span="12" class="more-item">
        <i class="iconfont icon-shanchu"></i>
        <span>删除</span>
      </van-col>
    </van-row>
  </van-popup>

  <van-popup v-model:show="showPlaylist" round :style="{ padding: '10px', maxHeight: '300px' }" >
    <van-row @click="opSong(item.id, 'add')" class="palylist-item" v-for="item in userPlaylists.concatData" :key="item.id">
      <van-col span="4">
        <van-image
        width="100%"
        height="100%"
        fit="cover"
        radius="6"
        :src="item.coverImgUrl"
        />
      </van-col>
      <van-col span="19" class="palylist-item-info">
        <h4>{{ item.name }}</h4>
        <span>{{ item.trackCount }}首</span>
      </van-col>
    </van-row>
  </van-popup>

  <div 
  :class="{
    'bottom-60': store.state.playSongList.isShow ? store.state.playSongList.isShow : isShow,
    'bottom-0': mBottom}"></div>
</template>

<script setup>
  import store from '@/store';
  import { setPlaySongId, pushAllPlaySong } from '@/utils/setPlaySongUtils';
  import { formatTime, arNames } from "@/utils/commonUtils";
  import { computed, onMounted, reactive, ref} from 'vue';
  import { neteaseCloudMusicApi } from '@/utils/apiUtils';
  import { showToast, showConfirmDialog} from "vant";
  let showMore = ref(false);
  let showPlaylist = ref(false);
  defineProps({
    songData: Array,
    mBottom: Boolean,
    playlistId: String
  })

  let isShow = computed(()=>{
    return sessionStorage.getItem('showSongBar');
  });
  let currentPlaySongId = computed(()=>{
    return store.state.playSongList.currentPlaySongId ? store.state.playSongList.currentPlaySongId : sessionStorage.getItem('currentPlaySongId');
  });

  function changeShow(id, data){
    setPlaySongId(id); 
    pushAllPlaySong(data);
    store.dispatch('playSongList/getSongPlayUrl', sessionStorage.getItem('currentPlaySongId'));
    store.commit('playSongList/SET_PLAY_SONG_BAR', sessionStorage.getItem('showSongBar'));
    
    store.commit('playSongList/SET_SONG_ID', sessionStorage.getItem('currentPlaySongId'));
    store.commit('playSongList/SET_ALL_SONG', sessionStorage.getItem('allPlaySongList'));
  }

  const userPlaylists = reactive({
    '0': [],
    '5': [],
    '100': [],
  })



  let userId = ref('');
  const opSongData = reactive({
    currentSongId: '',
    opState: {}
  });
  // 获取用户数据
  async function getUserData(){
    if(userId.value) {
      return
    }
    await neteaseCloudMusicApi('user/account').then(
      res => {
        userId.value = res.profile.userId;
      }
    )
    await neteaseCloudMusicApi('user/playlist', [{name: 'uid', value: userId.value}]).then(
      res => {
        res.playlist.forEach(item => {
            userPlaylists[item.specialType].push(item);
        })

        userPlaylists.concatData = userPlaylists[0].concat(userPlaylists[5]);
      }
    )
  }

  // 操作歌单
  async function opSong(pid, op){
    const params = [
      {name: 'op', value: op}, 
      {name: 'pid', value: pid},
      {name: 'tracks', value: opSongData.currentSongId}]

    if(op === 'del'){
      if(!confirm('你确定将歌曲从本歌单移除吗'))return
    }
    let code = 0
    await neteaseCloudMusicApi('playlist/tracks', params).then(
      res => {
        try{
          console.log(res)
          code = res.body.code;

        }catch(error){
          code = 401;
        }
      }
    )
    if(op === 'add'){
      if(code === 502){
        showToast('歌单内已有该歌曲');
      }
      if(code === 200){
        showToast('添加成功')
      }
    }
    if(op === 'del'){
      if(code === 401){
        showToast('你无权限对本歌单进行删除操作');
      }
      if(code === 200){
        showToast('删除成功')
      }
      showMore.value = false;
    }

    showPlaylist.value = false;
  }
</script>

<style scoped lang="less">
  *{
    box-sizing: border-box;
  }
  .bottom-60{
    margin-bottom: 60px;
  }
  .bottom-0{
    margin-bottom: 0;
  }

  .detail-main{
    width: 100%;
    .detail-main-item{
      display: flex;
      height: 50px;
      margin-bottom: 4px;
      .item-num{
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .item-main{
        display: flex;
        flex-direction: column;
        justify-content: center;
        >span:first-of-type{
          margin-bottom: 2px;
        }
      }
      .item-btns,.item-time{
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }  
  .ellipsis2:last-of-type{
    color: gray;
  }

  .active{
    color: var(--primary-color) !important;
  }

  .more-box{
    height: 100%;
    .more-item{
      display: flex;
      height: 100%;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      i{
        font-size: 28px;
        margin-bottom: 6px;
      }
    }

  }
  .palylist-item{
    margin-bottom: 10px;
    &:first-of-type{
      margin-top: 10px;
    }
    .palylist-item-info{
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      >span{
        margin-top: 4px;
        color: gray;
      }
    }
  }

</style>