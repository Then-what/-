<!-- 主页轮播图 -->
<template>
  <div class="home-banner">
    <van-swipe height="180" class="my-swipe" lazy-render :autoplay="5000" indicator-color="white">
        <van-swipe-item v-for="item, index in bannerData" :key="index">
            <img :src="item.pic" @click="sendPlaylistId(item.bannerId)">
        </van-swipe-item>
    </van-swipe>
  </div>
</template>

<script setup>
    import { onMounted, reactive } from 'vue';
    import { neteaseCloudMusicApi } from '@/utils/apiUtils'
    import { sendPlaylistId } from '@/utils/sendFuncUtils';
    let bannerData = reactive([]);
    onMounted(() => {
        neteaseCloudMusicApi('top/playlist/highquality', [{name: 'limit', value: '6'}]).then(
            res => {
                res.playlists.forEach(item => {
                    bannerData.push({bannerId: item.id, pic: item.coverImgUrl});
                })
            }
        );
    })
</script>

<style scoped lang="less">
    .my-swipe .van-swipe-item {
        color: #fff;
        font-size: 20px;
        line-height: 150px;
        text-align: center;
        background-color: #39a9ed;
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .home-banner{
        margin-top: 6px;
    }
</style>