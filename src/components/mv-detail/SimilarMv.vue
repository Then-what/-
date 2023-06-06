<template>
    <div class="mv-main-content">
        <span>相似MV</span>
        <van-grid :center="false" :border="false" :column-num="2">
            <van-grid-item @click="sendMvId(item.id);getCurrent();"  style="overflow: hidden; " v-for="item in similarMvList" :key="item.id">

                <van-image style="width: 100%;height: 100%;" :src="item.cover">
                </van-image>

                <div class="ellipsis2">{{ item.name }}</div>

                <span>播放量：{{ (item.playCount / 10000).toFixed(1) }}万</span>
            </van-grid-item>
        </van-grid>
    </div>
</template>

<script setup>
    import { sendMvId } from "@/utils/sendFuncUtils"

    defineProps({
        similarMvList: Array,
        getCurrent: Function
    })

</script>

<style lang="less" scoped>
    .mv-main-content{
        margin: 10px 10px;
        >span{
            font-size: 18px;
        }
    }
    .ellipsis2{
        height: 30px;
        margin-top: 4px;
    }
</style>