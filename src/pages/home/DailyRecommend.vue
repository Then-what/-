<!-- 每日推荐 -->
<!-- /recommend/songs -->
<template>
   <child-head title="每日推荐"/>
   <div class="detail-head" :style="{'backgroundImage': `url(${require('@/assets/img/1.png')})`}">
        <div class="detail-head-mark">
            <span>每日精彩推荐</span><br>
        </div>
    </div>
   <detail-main :songData="dailySongData.songData"></detail-main>
</template>

<script setup>
import { neteaseCloudMusicApi } from "@/utils/apiUtils";
import { defineAsyncComponent, onMounted, reactive } from "vue";
defineAsyncComponent(()=>import('@/components/playlist-detail/DetailMain.vue'))
   const dailySongData = reactive({
      songData: []
   })
   onMounted(async ()=>{
      await neteaseCloudMusicApi('recommend/songs').then(
         res => {
            dailySongData.songData = res.data.dailySongs.slice(0, 15);
         }
      )
   })
</script>

<style scoped lang="less">
   .detail-head{
        width: 100%;
        height: 300px;
        position: relative;
        overflow: hidden;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center 70%;
        padding-top: 10px;
        
        .detail-head-mark{
            width: 100%;
            height: 50%;
            background-image: linear-gradient(to bottom, transparent, white);
            position: absolute;
            bottom: 0;
            padding: 0 10px;
            >span{
                font-size: 20px;
                position: absolute;
                bottom: 52px;
            }
        }
    }
</style>