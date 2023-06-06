<!-- 主页头部组件 -->
<template>
    <van-sticky :offset-top="0">
        <div class="home-head">
            <div class="home-head-title">
                <img src="@/assets/img/音乐.png" alt="">
                <span>极简音乐</span>
            </div><!-- 
            <van-search 
            @keydown.enter="clickSearch(searchValue)" 
            show-action shape="round" 
            v-model="searchValue" 
            :clearable="false"
            placeholder="请输入搜索关键词">
                <template #action>
                    <div @click="clickSearch(searchValue)">搜索</div>
                </template>
            </van-search> -->
        </div>
    </van-sticky>
</template>

<script setup>
    import router from "@/router";
    import { ref } from "vue";

    const searchValue = ref('')

    function clickSearch(keyword){
        if(keyword === '') return
        router.push({
            name: 'search',
            params: {
                keyword
            }
        });
    }
</script>

<style scoped lang="less">
    .home-head{
        width: 100%;
        height: 50px;
        background-color: white;
        display: flex;
        justify-content: space-between;
        .home-head-title{
            display: flex;
            height: 100%;
            align-items: center;
            margin-left: 10px;
            img{
                width: 30px;
            }
            span{
                margin-left: 4px;
                font-size: 18px;
            }
        }
    }
</style>