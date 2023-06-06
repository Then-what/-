<!-- 主页展示内容组件 -->
<template>
    <div class="show-content">
        <div class="show-content-title">
            <span style="font-size: 18px;" @click="jumpUrl ? router.push(jumpUrl) : ''">{{ contentTitle }}</span>
        </div>
        <slot></slot>
    </div>
</template>

<script setup>
    import router from "@/router"
    
    const props = defineProps({
        contentTitle: String,
        jumpUrl: String,
    })
</script>

<style scoped lang="less">
    
</style>