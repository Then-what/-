<template>
    <div class="toplist-category">
        <span span="24">{{ title }}</span>
        <van-row style="margin-top: 10px;">
            <van-col style="margin-bottom: 10px;" span="6" v-for="item in toplistData" :key="item.id">
                <van-image
                width="100"
                height="100"
                @click="sendPlaylistId(item.id)"
                :src="item.coverImgUrl">
                </van-image>
            </van-col>
        </van-row>
    </div>
</template>

<script setup>
    import { onMounted, reactive } from "vue";
    import { sendPlaylistId } from "@/utils/sendFuncUtils"
    defineProps({
        title: String,
        toplistData: Array
    })
</script>

<style scoped lang="less">
    .toplist-category{
        font-size: 18px;
        padding: 0 10px;
    }
</style>