<template>
    <div class="icon">
        <i @click="router.back" class="iconfont icon-xiangzuojiantou"></i>
    </div>
    <div class="detail-head" :style="{'backgroundImage': `url(${playlistData[0].coverImgUrl})`}">
        <div class="detail-head-mark">
            <van-row class="detail-head-detail">
                <van-col span="18">
                    <span>{{ playlistData[0].name }}</span>
                </van-col>
                <!-- <van-col span="6" style="text-align: center;">
                    <i @click="addPlaylist(playlistId)" class="iconfont icon-shoucang" style="font-size: 28px;"></i>
                </van-col> -->
            </van-row>
        </div>
    </div>
</template>

<script setup>
    import router from '@/router';

    defineProps({
        playlistData: Array,
        playlistId: String
    })

    async function addPlaylist(id){
        
    }
</script>

<style lang="less" scoped>
    .icon{
        position: fixed;
        top: 0;
        z-index: 10;
        padding: 10px;
        width: 100%;
        background-image: linear-gradient(271deg,#b2fefa,#0ed2f7);
        .iconfont{
            font-size: 30px;
            color: white;
        }
    }
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
            span{
                font-size: 20px;
            }
            .detail-head-detail{
                position: absolute;
                width: 100%;
                bottom: 44px;
            }
        }
    }

</style>