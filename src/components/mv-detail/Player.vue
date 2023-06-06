<template>
    <div class="mv-container">
      <video autoplay controls :poster="currentMvData.cover" class="video-player" :src="videoSrc"></video>
    </div>
</template>

<script setup>
    defineProps({
        videoSrc: String,
        currentMvData: Object
    })
    
</script>

<style lang="less" scoped>
    .mv-container{
        width: 100%;
        height: 210px;
    }
    .video-player{
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>