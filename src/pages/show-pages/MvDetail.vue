<template>
    <div class="icon">
        <i @click="router.back" class="iconfont icon-xiangzuojiantou"></i>
        <span class="title">{{mvData.currentMvData.name}}</span>
    </div>
    <Player v-if="loaded" :currentMvData="mvData.currentMvData" :videoSrc="mvData.mvVideoAddress"></Player>
    <SimilarMv v-if="loaded" :similarMvList="mvData.similarMvList" :getCurrent="getCurrent"></SimilarMv>
</template>

<script setup>
    import router from '@/router';
    import { neteaseCloudMusicApi } from '@/utils/apiUtils';
    import { computed, defineAsyncComponent, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue';
    import { useRoute } from 'vue-router';

    defineAsyncComponent(()=>import('@/components/mv-detail/Player.vue'));
    defineAsyncComponent(()=>import('@/components/mv-detail/SimilarMv.vue'));


    const instance = getCurrentInstance();

    
    const route = useRoute();

    let mvId = computed(()=>{
        return route.params.mvId;
    })

    let loaded = ref(false);

    const mvData = reactive({
        // 当前mv数据
        currentMvData: {},
        mvVideoAddress: '',
        // 相似mv数据
        similarMvList: [],
    })

    async function getCurrent(){
        // 获取当前mv数据
        await neteaseCloudMusicApi('mv/detail', [{name: 'mvid', value: mvId.value}]).then(
            res => {
                mvData.currentMvData = res.data;
                console.log(mvData.currentMvData)
            }
        )
        
        // 获取mv视频地址
        await neteaseCloudMusicApi('mv/url', [{name: 'id', value: mvId.value}]).then(
            res => {
                mvData.mvVideoAddress = res.data.url;
                
            }
        )
        getSimilarMv();

        loaded.value = true;
    }

    // 获取相似mv数据
    async function getSimilarMv(){
        mvData.similarMvList.splice(0, mvData.similarMvList.length);
        await neteaseCloudMusicApi('simi/mv', [{name: 'mvid', value: mvId.value}, {name: 'limit', value: 10}]).then(
            res => {
                res.mvs.forEach(item => {
                    mvData.similarMvList.push(item);
                });
                mvData.similarMvList.splice(mvData.similarMvList.length - 1, 1);
            }
        )
    }

    onMounted(()=>{
        getCurrent();
    })
</script>

<style lang="less" scoped>
    .icon{
        z-index: 10;
        padding: 10px;
        width: 100%;
        box-sizing: border-box;
        background-image: linear-gradient(271deg,#b2fefa,#0ed2f7);
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
</style>