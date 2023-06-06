<template>
    <div class="icon">
        <div class="home-head-title">
            <img src="@/assets/img/音乐.png" alt="">
            <span>极简音乐</span>
        </div>
        <van-search 
        @keydown.enter="getSongData({keyword:searchValue})" 
        show-action shape="round" 
        v-model="searchValue" 
        background="transparent"
        :clearable="false"
        placeholder="请输入搜索关键词">
            <template #action>
                <div @click="getSongData({keyword:searchValue})">搜索</div>
            </template>
        </van-search>
    </div>
    <div class="search-hot" v-if="!loadedBox">
        <span class="search-hot-title">热搜</span>
        <van-row>
            <van-col @click="searchValue = item.first ,getSongData({keyword: item.first})" v-for="item, index in hotKeyword.data" :key="index" class="hot-keyword-item" span="12">{{ item.first }}</van-col>
        </van-row>
    </div>
    <div v-if="loadedBox">
        <div v-if="!loaded" style="height: 432px;"></div>
        <detail-main :mBottom="true" v-if="loaded" :songData="songData"></detail-main>
        <van-pagination
        @change="getSongData({keyword: searchValue, offset: (currentPage - 1) * 8})"
        v-model="currentPage"
        :total-items="songDataLength"
        :show-page-size="6"
        force-ellipses/>
        
    </div>
</template>

<script setup>
    import { neteaseCloudMusicApi } from "@/utils/apiUtils";
    import { defineAsyncComponent, onMounted, reactive, ref, computed } from "vue";
    import router from '@/router';
    import { useRoute } from "vue-router";

    defineAsyncComponent(()=>import('@/components/playlist-detail/DetailMain.vue'))
    const route = useRoute();



    // 当前页数
    let currentPage = ref(1);

    
    let a = computed(()=>{
        return route.params.keyword;
    })
    let searchValue = ref(a.value);

    // 歌曲的总数
    let songDataLength = ref(0);

    let loaded = ref(false);
    let loadedBox = ref(false);
    // 歌曲详情
    let songData = reactive([])

    async function getSongData({keyword, offset}){
        loaded.value = false;
        console.log(keyword)
        if(!keyword) return
        
        let params = [{name: 'keywords', value: keyword}, {name: 'limit', value: 8}];
        
        if(offset){
            params.push({name: 'offset', value: offset});
        }
        
        await neteaseCloudMusicApi('cloudsearch', params).then(
            res => {
                songData.splice(0, songData.length);
                res.result.songs.forEach(item => {
                    songData.push(item)
                    
                });
                songDataLength.value = res.result.songCount;
            }
        )
            
        loadedBox.value = true;
        loaded.value = true;
    }

    let hotKeyword = reactive({
        data: []
    })



    onMounted(()=>{
        // getSongData({keyword: searchValue.value});

        neteaseCloudMusicApi('search/hot').then(
            res => {
                console.log(res.result);
                hotKeyword.data = res.result.hots;
                console.log(hotKeyword.data)
            }
        )
    })
</script>

<style scoped lang="less">
    .icon{
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
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
        .iconfont{
            color: black;
            font-size: 20px;
        }
    }

    .search-hot{
        padding: 2px 10px;
        .search-hot-title{
            font-size: 18px;
        }
        .hot-keyword-item{
            margin-top: 10px;
        }
    }
</style>