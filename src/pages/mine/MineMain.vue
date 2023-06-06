<template>
    <div class="mine-head">
        <!-- 用户头像 -->
        <div class="user-img">
            <div class="user-img-box">
                <van-image
                width="100%"
                height="100%"
                fit="cover"
                :src="userData.headImg"
                />
            </div>

            <!-- 用户信息 -->
            <h2 class="user-name">{{ userData.name }}</h2>
        </div>
    </div>
    <span class="login-up" @click="loginUp">退出登录</span>
    <div class="mine-nav">
        <van-grid class="item-box" :column-num="2" clickable>
            <van-grid-item 
                text="喜欢"
                :icon="require('@/assets/img/home-nav-icon/love.png')" 
                @click="sendPlaylistId(userPlaylists['5'][0].id)"
                />
                
                <!-- @click="router.push(item.path)" -->
                <van-grid-item 
                text="MV"
                :icon="require('@/assets/img/home-nav-icon/MV.png')" 
                @click="router.push('/mine/mineLikeMV')"
                />
                
                <!-- @click="router.push(item.path)" -->
        </van-grid>
    </div>
    <div class="mine-playlist">
        <div class="playlist-nav">
            <div>
                <span @click="changePlaylistType = '0'">自建歌单</span>
                <span @click="changePlaylistType = '100'">收藏歌单</span>
            </div>
            <i @click="showAddPlaylist=true" class="iconfont icon-tianjia" style="font-size: 20px; text-align: right;"></i>
        </div>
        <div v-if="localRefresh">
            <van-row class="palylist-item" v-for="item in userPlaylists[changePlaylistType]" :key="item.id">
                <van-col span="4">
                    <van-image
                    width="100%"
                    height="100%"
                    fit="cover"
                    radius="6"
                    :src="item.coverImgUrl"
                    @click="sendPlaylistId(item.id)"
                    />
                </van-col>
                <van-col span="17" class="palylist-item-info">
                    <h4>{{ item.name }}</h4>
                    <span>{{ item.trackCount }}首</span>
                </van-col>
                <van-col span="2" v-show="changePlaylistType === '0' ? true : false" class="palylist-item-remove">
                    <i @click="removePlaylist(item.id)" class="iconfont icon-shanchu"></i>
                </van-col>
            </van-row>
        </div>
        
    </div>
    <van-popup class="add-playlist" v-model:show="showAddPlaylist" round :style="{ padding: '10px' , width: '300px'}" >
        <h3>创建歌单</h3>
        <van-field v-model="addPlaylistName" placeholder="请输入歌单名" style="margin: 10px 0;"/>
        <van-row>
            <van-col span="12" style="text-align: center;">
                <van-button @click="addPlaylist" type="primary">确定</van-button>
            </van-col>
            <van-col span="12" style="text-align: center;">
                <van-button @click="showAddPlaylist = false" type="danger">取消</van-button>
            </van-col>
        </van-row>
    </van-popup>
</template>

<script setup>
    import { neteaseCloudMusicApi } from '@/utils/apiUtils';
    import { onMounted, reactive, ref } from 'vue';
    import { sendPlaylistId } from "@/utils/sendFuncUtils"
    import router from '@/router';
    import { showToast } from 'vant';

    let localRefresh = ref(true);

    let showAddPlaylist = ref(false);
    const userData = reactive({
        name: '',
        headImg: '',
        id: ''
    })

    let changePlaylistType = ref('0')

    const userPlaylists = reactive({
        '0': [],
        '5': [],
        '100': [],
    })

    async function loginUp(){
        await neteaseCloudMusicApi('logout').then(
            res => {
                if(res.code === 200){
                    router.push('/login');
                }
            }
        )
    }


    // 创建歌单
    let addPlaylistName = ref('');

    async function addPlaylist(){
        localRefresh.value = false
        await neteaseCloudMusicApi('playlist/create', [{name: 'name', value: addPlaylistName.value}]).then(
            res => {
                console.log(res);
                
            }
        )
        showToast('创建成功');
        localRefresh.value = true;
        showAddPlaylist.value = false;
    }
    
    // 删除歌单
    async function removePlaylist(id){
        if(!confirm('确定要删除本歌单吗'))return
        localRefresh.value = false;
        let code = 0;
        await neteaseCloudMusicApi('playlist/delete', [{name: 'id', value: id}]).then(
            res => {
                code = res.code;
            }
        )
        if(code === 200){
            console.log(1);
            showToast('删除成功');
            localRefresh.value = true;

        }
    }

    onMounted(async ()=>{
        await neteaseCloudMusicApi('user/account').then(
            res => {
                userData.name = res.profile.nickname;
                userData.headImg = res.profile.avatarUrl;
                userData.id = res.profile.userId;
            }
        )
        await neteaseCloudMusicApi('user/playlist', [{name: 'uid', value: userData.id}]).then(
            res => {
                res.playlist.forEach(item => {
                    userPlaylists[item.specialType].push(item);
                })
            }
        )
    })
</script>

<style lang="less" scoped>
    .login-up{
        position: absolute;
        top: 10px;
        font-size: 18px;
        right: 12px;
    }
    .mine-head{
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 10px 0 ;
        
        .user-img{
            display: flex;
            flex-direction: column;
            align-items: center;
            .user-img-box{
                width: 70px;
                height: 70px;
                border: 4px solid var(--primary-color);
                box-sizing: border-box;
                border-radius: 50%;
                overflow: hidden;
            }
        }
    }

    .mine-nav{
        .item-box{
            box-shadow: 0 2px 12px rgba(100, 101, 102, .12);
        }
    }

    .mine-playlist{
        padding: 10px;
        .playlist-nav{
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            span{
                margin-right: 10px;
                font-size: 18px;
            }
        }
        .palylist-item{
        margin-bottom: 10px;
        &:first-of-type{
            margin-top: 10px;
        }
        .palylist-item-info{
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            >span{
                margin-top: 4px;
                color: gray;
            }
        }
        .palylist-item-remove{
            display: flex;
            justify-content: center;
            align-items: center;
            i{
                font-size: 20px;
            }
        }
    }
        
    }

    .add-playlist{
        h3{
            text-align: center;
            font-weight: normal;
        }
        button{
            width: 60%;
        }
    }
</style>