<template>
    <div class="icon">
        <i @click="router.back" class="iconfont icon-xiangzuojiantou"></i>
        <span class="title">MV</span>
    </div>
    <div>
        <van-row v-for="item in mvData.data" :key="item.vid" class="mine-mv" @click="sendMvId(item.vid)">
            <van-col class="mv-img" span="11">
                <van-image radius="10"
                fit="cover"
                :src="item.coverUrl"
                />
            </van-col>
            <van-col span="8" class="mv-content">
                <p class="ellipsis2">{{ item.title }}</p>
                <span>{{ formatTime(item.durationms) }}</span>
                <span style="margin-top: 10px;">{{arNames(item.creator, 'userName')}}</span>
                
            </van-col>
        </van-row>

    </div>
</template>

<script setup>
import router from "@/router";
import { neteaseCloudMusicApi } from "@/utils/apiUtils";
import { formatTime, arNames } from "@/utils/commonUtils";
import { sendMvId } from "@/utils/sendFuncUtils";
import { onMounted, reactive } from "vue";
    const mvData = reactive({
        data: []
    })

    onMounted(()=>{
        neteaseCloudMusicApi('mv/sublist').then(
            res => {
                mvData.data = res.data;
            }
        )
    })
</script>

<style scoped lang="less">
    .icon{
        position: fixed;
        top: 0;
        z-index: 10;
        padding: 10px;
        width: 100%;
        display: flex;
        // background-image: linear-gradient(271deg,#b2fefa,#0ed2f7);
        .iconfont, .title{
            font-size: 20px;
            color: black;
            margin: 0;
            font-weight: normal;
        }
        .title{
            margin-left: 10px;
        }
    }

    .mine-mv{
        padding: 0 10px;
        margin-top: 60px;
        .mv-content{
            display: flex;
            margin-left: 20px;
            flex-direction: column;
            p{
                font-size: 20px;
                margin: 10px 0;
            }
            span{
                color: gray;
            }
        }
    }
</style>