<!-- home子路由的标题 -->
<template>
    <div class="home-child-head">
        <i style="text-align: left;" @click="router.push('/home')" class="iconfont icon-xiangzuojiantou"></i>
        {{ title }}
    </div>
</template>

<script setup>
    import router from '@/router';
    defineProps({
        title: String,
    })
</script>

<style lang="less" scoped>
    .home-child-head{
        padding: 4px;
        font-size: 20px;
        margin: 10px;
        >i{
            font-size: 20px;
        }
    }
</style>