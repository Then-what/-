<!-- homemain主体 -->
<template>
    <!-- 头部 -->
    <HomeHead/>
    <!-- 轮播 -->
    <HomeBanner/>
    <!-- 导航 -->
    <van-grid clickable :border="false">
        <van-grid-item 
            v-for="item, index in navTitleList" 
            :key="index" 
            :text="item.title"
            :icon="item.icon" 
            @click="router.push(item.path)"
            />
    </van-grid>
    <ShowContent jump-url="/home/playlist" content-title="推荐歌单" >
        <div class="show-content-main scroll-box">
            <div>
                <div @click="sendPlaylistId(item.id)" class="content-main-item scroll-box-item" v-for="item in showData.recommendPlaylist" :key="item.id">
                    <img :src="item.picUrl">
                    <p class="ellipsis">{{ item.name }}</p>
                </div>
            </div>
        </div>
    </ShowContent>

    <ShowContent jump-url="/home/mv" content-title="推荐MV">
        <van-grid :center="false" :border="false" :column-num="2" style="font-size: 16px;margin-left: -10px;">
            <van-grid-item @click="sendMvId(item.id);" style="overflow: hidden;" v-for="item in showData.recommendMv" :key="item.id">

                <van-image style="width: 100%;height: 100%;" :src="item.picUrl">
                </van-image>

                <div class="ellipsis2">{{ item.name }}</div>

                <span>播放量：{{ (item.playCount / 10000).toFixed(1) }}万</span>
            </van-grid-item>
        </van-grid>
    </ShowContent>

    <ShowContent content-title="推荐新曲" >
        <div class="show-content-main scroll-box">
            <div>
                <div class="content-main-item scroll-box-item" v-for="item in showData.newSongs" :key="item.id" @click="changeShow(item.id, showData.newSongs)">
                    <img :src="item.al.picUrl">
                    <p class="ellipsis2">{{ item.name }}</p>
                </div>
            </div>
        </div>
    </ShowContent>
    <div class="bottom-60" :class="{'bottom-120': store.state.playSongList.isShow ? store.state.playSongList.isShow : isShow}"></div>
</template>

<script setup>
    import HomeHead from '@/components/home-components/HomeHead.vue'
    import HomeBanner from '@/components/home-components/HomeBanner.vue'
    import ShowContent from '@/components/home-components/ShowContent.vue'
    import { computed, onMounted, reactive } from 'vue'
    import { sendPlaylistId, sendMvId } from "@/utils/sendFuncUtils"
    import { setPlaySongId, pushAllPlaySong } from '@/utils/setPlaySongUtils';
    import { neteaseCloudMusicApi } from '@/utils/apiUtils'
    import router from '@/router';
    import store from '@/store'

    let isShow = computed(()=>{
        return sessionStorage.getItem('showSongBar');
    });
    // 导航栏的数据
    const navTitleList = reactive([
        {
            title:'每日推荐', 
            icon: require('@/assets/img/home-nav-icon/rili.png'),
            path: '/home/dailyRecommend'
        }, 
        {
            title:'歌单', 
            icon: require('@/assets/img/home-nav-icon/gedan.png'),
            path: '/home/playlist'
        },
        {
            title:'排行榜', 
            icon: require('@/assets/img/home-nav-icon/paihangbang.png'),
            path: '/home/musicList'
        },
        {
            title:'MV', 
            icon: require('@/assets/img/home-nav-icon/MV.png'),
            path: '/home/mv'
        }]);
    
    // 用于存储推荐歌单数据
    // let showData = reactive([]);
    let showData = reactive({
        recommendPlaylist: [],
        newSongs: [],
        recommendMv: []
    });

    function changeShow(id, data){
        setPlaySongId(id); 
        pushAllPlaySong(data);
        store.dispatch('playSongList/getSongPlayUrl', sessionStorage.getItem('currentPlaySongId'));
        store.commit('playSongList/SET_PLAY_SONG_BAR', sessionStorage.getItem('showSongBar'));
        
        store.commit('playSongList/SET_SONG_ID', sessionStorage.getItem('currentPlaySongId'));
        store.commit('playSongList/SET_ALL_SONG', sessionStorage.getItem('allPlaySongList'));
    }

    function getData({url, params, dataName='result', att}){
        neteaseCloudMusicApi(url, params).then(
            res => {
                console.log(url, res)
                res[dataName].forEach(item => {
                    showData[att].push(item);
                })
            }
        );
    }

    async function getNewSongs(){
        let data = [];
        await neteaseCloudMusicApi('personalized/newsong').then(
            res => {
                data = res.result;
            }
        )
        let ids = '';
        data.forEach((item, index, arr) => {
            ids = index != arr.length - 1 ? ids + item.id + ',' : ids + item.id;
        });
        console.log(ids)
        await neteaseCloudMusicApi('song/detail', [{name: 'ids', value: ids}]).then(
            res => {
                console.log('a', res)
                res.songs.forEach(item => {
                    showData.newSongs.push(item);
                })
            }
        )
    }

    onMounted(()=>{
        // 推荐歌单
        getData({
            url: 'personalized', 
            params: [{name: 'limit', value: '10'}], 
            att: 'recommendPlaylist'});
        
        // 推荐新曲
        
        getNewSongs();
        
            
        // 推荐MV
        getData({
            url: 'personalized/mv', 
            att: 'recommendMv'});
    })
</script>

<style scoped lang="less">
    .show-content{
        padding-left: 10px;
        .show-content-main{
            margin-top: 10px;
            width: 100%;
            min-height: 100px;
            .content-main-item{
                width: 100px;
                height: 100%;
                display: inline-block;
                margin-right: 10px;
                color: black;
                >img{
                    width: 100%;
                    height: 100px;
                }
                >p{
                    height: 34px;
                    // white-space: nowrap;
                    
                    margin: 4px 0;
                }
            }
        }
        
    }

    .ellipsis2{
        height: 30px;
        margin-top: 4px;
    } 
    .bottom-60{
        margin-bottom: 60px;
    }
    .bottom-120{
        margin-bottom: 120px;
    }
</style>