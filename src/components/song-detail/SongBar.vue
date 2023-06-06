<template>
    <!-- <div>{{ currentPalySongData }}</div> -->
    <van-row  v-if="currentPalySongData" class="song-bar" :class="{'bottom-58': !route.meta.hideTabBar}">
        <!-- 歌曲图片 -->
        <van-col span="4" class="song-bar-img vertical-style" >
            <div 
            class="song-img-box"
            ref="rotateBox"
            :class="songData.boxRotateClass">
                <van-image
                width="100%"
                height="100%"
                fit="cover"
                :src="currentPalySongData.img"
                />
            </div>
        </van-col>
        
        <!-- 歌曲名 -->
        <van-col span="14" class="song-bar-name ">
            <audio @ended="audioEnd(currentPalySongData.id)" :src="currentPalySongData.url" ref="audio" autoplay>
            </audio>
            
            <span class="ellipsis2" style="font-size: 18px;">{{currentPalySongData.name}} - {{ arNames(currentPalySongData.ars, 'name') }}</span>
            <!-- <van-row >
                <van-col class="audio-progress" span="20">
                    <input type="range">
                </van-col>
                <van-col style="text-align: right;" span="4">{{ songData.currentTime }} / {{ songData.duration }}</van-col>
            </van-row> -->
        </van-col>

        <!-- 播放按钮以及歌曲列表 -->
        <van-col span="6" class="song-btns vertical-style">
            <!-- 播放按钮 -->
            <div class="song-play vertical-style">
                <i class="iconfont" :class="songData.playBtnClass" @click="onPlaying"></i>
            </div>

            <!-- 歌曲列表 -->
            <i class="song-list iconfont icon-fenlei1" @click="showSongList = true"></i>
            <van-popup
            v-model:show="showSongList"
            round
            position="bottom"
            :style="{ height: '50%', paddingTop: '20px'}"
            >
                <detail-main :songData="allPlaySongList"></detail-main>
            </van-popup>
        </van-col>
    </van-row>
</template>

<script setup>
    import store from "@/store";
    import { computed, onMounted, reactive, ref } from "vue";
    import { arNames } from "@/utils/commonUtils";
import { useRoute } from "vue-router";
    const route = useRoute();
    let songData = reactive({
        // 容器旋转的样式
        boxRotateClass: 'rotate-img',

        // 播放按钮的切换样式
        playBtnClass: 'icon-iconstop',
        /* currentTime: 0,
        duration: 0 */
    })
        
    // 获取音频标签
    const audio = ref(null);

    let showSongList = ref(false);

    let isPlaying = ref(true);

    let currentPalySongData = computed(()=>{
        let data = store.state.playSongList.currentPalySongData ? store.state.playSongList.currentPalySongData : JSON.parse(sessionStorage.getItem('currentPalySongData'));

        return data;
    })

    let allPlaySongList = computed(()=>{
        let data = store.state.playSongList.allSong ? store.state.playSongList.allSong : sessionStorage.getItem('allPlaySongList');

        data = JSON.parse(data);
        console.log(data)
        return data[0];
    })


    // 播放结束播放下一首歌曲
    async function audioEnd(currentId){
        console.log(store.state.playSongList.currentPalySongData.name,'播放结束', currentId)
        console.log(allPlaySongList);
        let i = '';
        for(let [index, fruit] of allPlaySongList.value.entries()){
            if(currentId === fruit.id){
                i = index+1;
                break;
            }
        }

        if(i === allPlaySongList.value.length){
            i = 0;
        }
        await store.dispatch('playSongList/getSongPlayUrl', allPlaySongList.value[i].id);
        console.log(store.state.playSongList.currentPalySongData.url)
        if(!store.state.playSongList.currentPalySongData.url){
            i++;
            store.dispatch('playSongList/getSongPlayUrl', allPlaySongList.value[i].id);
        }

        audio.value.play();
    }

    // 播放歌曲
    function onPlaying(){
        isPlaying.value = !isPlaying.value;

        if(isPlaying.value){
            songData.playBtnClass = 'icon-iconstop';
            songData.boxRotateClass = 'rotate-img';
            audio.value.play();
        }else{
            songData.playBtnClass = 'icon-24gf-play';
            songData.boxRotateClass = '';
            audio.value.pause();
        }
        
    }

    onMounted(()=> {
        console.log(route)
    })
</script>

<style scoped lang="less">
    .song-bar{
        position: fixed;
        width: 100%;
        height: 60px;
        overflow: hidden;
        padding: 0 10px;
        box-sizing: border-box;
        background-color: white;
        display: flex;
        bottom: 0;
        box-shadow: 0 -2px 10px -8px #787878;
    }

    // 歌曲图片样式
    .song-bar-img{
        
        .song-img-box{
            width: 50px;
            height: 50px;
            border: 4px solid black;
            box-sizing: border-box;
            border-radius: 50%;
            overflow: hidden;
        }
    }

    .rotate-img{
        animation: rotate_animation 10s infinite linear;
        transform-origin: 50% 50%;
    }
    
    @keyframes rotate_animation{
        0%{
            transform: rotate(0deg);
        }
        100%{
            transform: rotate(360deg);
        }
    }

    // 按钮样式
    .song-btns{
        justify-content: flex-end;
        .song-play{
            width: 30px;
            height: 30px;
            border: 2px solid black;
            border-radius: 50%;
            justify-content: center;
            >.iconfont{
                font-size: 18px;
            }
        }
        .song-list{
            font-size: 30px;
            margin-left: 20px;
        }
    }

    .bottom-58{
        bottom: 58px;
    }

    // 垂直居中样式
    .vertical-style{
        display: flex;
        align-items: center;
    }
    .song-bar-name{
        display: flex;
        flex-direction: column;
        justify-content: center;
        /* .audio-progress{
            padding-top: -2px;
            >input[type="range"]{
                width: 100%;
                border: none;
                height: 3px;
                border-radius: 10px;
                border: none;
            }
        } */
    }
</style>