<!-- 歌单 -->
<template>
    <child-head title="歌单"></child-head>

    <div class="playlist-main" style="margin-bottom: 60px;">
        <!-- 歌单导航 -->
        <div class="palylist-main-nav">
            <van-row>
                <van-col class="hot-playlist scroll-box" span="22">
                    <div>
                        <div @click="getPlaylist({name: playlistCategory.all.name})" style="margin-left: 10px;"
                        class="hot-playlist-item scroll-box-item">
                            {{ playlistCategory.all.name }}
                        </div>

                        <!-- 热门歌单分类 -->
                        <div v-for="item in playlistCategory.hot" :key="item.id"
                        class="hot-playlist-item scroll-box-item"
                        @click="getPlaylist({name: item.name})
                        ">
                            {{ item.name }}
                        </div>
                    </div>
                </van-col>
                <!-- 分类歌单 -->
                <van-col class="nav-category" span="2">
                    <i @click="show = true" class="iconfont icon-fenlei"></i>
                    <!-- 用于制作分类歌单弹窗 -->
                    <van-popup
                    get-container="body"
                    v-model:show="show"
                    position="bottom"
                    :style="{ height: '30%' }">
                    <van-tabs>
                        <van-tab v-for="item1, index1 in playlistCategory.category" :title="item1.title" :key="index1">
                            <van-row>
                                <van-col @click="getPlaylist({name: item2.name})" class="catagory-item" v-for="item2, index2 in item1.content" :key="index2" span="4">{{ item2.name }}</van-col>
                            </van-row>
                        </van-tab>
                    </van-tabs>
                    </van-popup>
                </van-col>
            </van-row>
        </div>
        <!-- 歌单主体内容 -->
        <div class="palylist-main-content">
            <span class="content-title">{{ mainTitle }}</span>
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                
                <van-grid :border="false" :column-num="4">
                    <van-grid-item 
                    @click="sendPlaylistId(item.id)" 
                    style="overflow: hidden;" 
                    v-for="item in playlistData" :key="item.id">
                        <van-image :src="item.coverImgUrl"/>
                        <span style="margin-top: 10px;" class="ellipsis">{{ item.name }}</span>
                    </van-grid-item>
                </van-grid>
            </van-list>
        </div>
    </div>
    <back-top/>
</template>

<script setup>
    import ChildHead from '@/components/home-components/child-common/ChildHead.vue';
    import BackTop from '@/components/BackTop.vue';

    import { onMounted, reactive, ref } from 'vue';

    import { neteaseCloudMusicApi } from '@/utils/apiUtils'
    import { sendPlaylistId } from "@/utils/sendFuncUtils"

    // 歌单数据存储
    let playlistCategory = reactive({
        // 热门歌单
        hot: [],
        // 歌单分类
        category: {},
        // 全部歌单
        all: {}
    });
    // 获取热门歌单分类
    function getHotPlaylistCategory(){
        neteaseCloudMusicApi('playlist/hot', []).then(
            res => {
                res.tags.forEach(item => {
                    playlistCategory.hot.push(item);
                })
            }
        );
    }
    // 获取歌单分类
    function getPlaylistCategory(){
        neteaseCloudMusicApi('playlist/catlist', []).then(
            res => {
                // 对歌单分类处理
                const obj = {0: {title: '语种', content: []}, 1: {title: '风格', content: []}, 2: {title: '场景', content: []}, 3: {title: '情感', content: []}, 4: {title: '主题', content: []},};
                res.sub.forEach(item => {
                    obj[item.category].content.push(item);
                });
                playlistCategory.category = obj;
                playlistCategory.all = res.all;
            }
        );
    }

    // 分类弹窗
    let show = ref(false);

    // 主要获取数据
    let mainTitle = ref('全部歌单');
    // 存储数据
    let playlistData = reactive([]);
    let count = 0;
    const dataLimitNum = 32;
    function getPlaylist({name="全部歌单", url="top/playlist", params=[{name: 'limit', value: dataLimitNum}]}){
        count = 1;
        // 将数据清空
        playlistData.splice(0, playlistData.length);
        // 设置标题
        mainTitle.value = name;

        // 关闭弹窗
        show.value = false;

        params.push({name: 'cat', value: name});
        neteaseCloudMusicApi(url, params).then(
            res => {
                res.playlists.forEach(item => {
                    playlistData.push(item);
                })
            }
        )
    }

    // 加载功能
    // 加载中
    const loading = ref(false);
    // 加载完成
    const finished = ref(false);
    async function onLoad(){
        // 设置偏移总数
        let total = count * dataLimitNum;
        // 计数
        count++;
        // 存储当前获取数据的长度
        let dataLength = 0;
        const params = [
            {name: 'limit', value: dataLimitNum}, 
            {name: 'offset', value: total}, 
            {name: 'cat', value: mainTitle.value}]
            
        await neteaseCloudMusicApi('top/playlist', params).then(
            res => {
                res.playlists.forEach(item => {
                    playlistData.push(item);
                })
                dataLength = res.playlists.length;
            }
        )
        loading.value = false;

        // 判断当前数据的长度是否小于请求的长度，小于就请求结束
        if ( dataLength < dataLimitNum ) {
          finished.value = true;
        }
    };


    onMounted(()=>{
        getHotPlaylistCategory();
        getPlaylistCategory();
    })
</script>

<style scoped lang="less">
    .playlist-main{
        font-size: 16px;
    }
    .palylist-main-nav{
        .hot-playlist{
            position: relative;
            overflow: hidden;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            &::-webkit-scrollbar{
                background-color: transparent;
                display: none;
            }
            >div{
                display: flex;
                .hot-playlist-item{
                    margin-right: 10px;
                    height: 100%;
                }
            }
        }

        .nav-category{
            text-align: center;
        }
    }

    .palylist-main-content{
        margin: 10px 10px;
    }

    .catagory-item{
        text-align: center;
        margin-top: 10px;
    }

    .van-tabs__line{
        background: var(--primary-color);
    }
</style>