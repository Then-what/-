<template>
    <child-head title="MV"></child-head>

    <div class="mv-main" style="margin-bottom: 60px;">
        <!-- 歌单导航 -->
        <div class="mv-main-nav">

            <van-dropdown-menu active-color="#ffadc2">
                <van-dropdown-item @click="itemGetData" v-model="activeArea" :options="navList.area" />
                <van-dropdown-item @click="itemGetData" v-model="activeType" :options="navList.type" />
                <van-dropdown-item @click="itemGetData" v-model="activeOrder" :options="navList.order" />
            </van-dropdown-menu>
        </div>

        <div class="mv-main-content">
            <van-list
                v-model:loading="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >

                <van-grid :center="false" :border="false" :column-num="3">
                    <van-grid-item @click="sendMvId(item.id)"  style="overflow: hidden;" v-for="item in mvData" :key="item.id">

                        <van-image style="width: 100%;height: 100%;" :src="item.cover">
                        </van-image>

                        <div class="ellipsis2">{{ item.name }}</div>

                        <span>播放量：{{ (item.playCount / 10000).toFixed(1) }}万</span>
                    </van-grid-item>
                </van-grid>
            </van-list>
        </div>
    </div>
    <back-top/>
</template>

<script setup>
    import { reactive, ref } from "vue"
    import { neteaseCloudMusicApi } from '@/utils/apiUtils'
    import BackTop from '@/components/BackTop.vue';

    import { sendMvId } from "@/utils/sendFuncUtils";

    // 导航列表
    const navList = {
        area: [
            {text: '全部', value: 0}, 
            {text: '内地', value: 1}, 
            {text: '港台', value: 2}, 
            {text: '欧美', value: 3}, 
            {text: '日本', value: 4}, 
            {text: '韩国', value: 5} ],
        type: [
            {text: '全部', value: 0}, 
            {text: '官方版', value: 1}, 
            {text: '现场版', value: 2}],
        order: [
            {text: '上升最快', value: 0}, 
            {text: '最热', value: 1}, 
            {text: '最新', value: 2}]
    }

    let activeArea = ref(0);
    let activeType = ref(0);
    let activeOrder = ref(0);

    // 加载功能
    let count = 0;
    const loading = ref(false);
    const finished = ref(false);
    const dataLimitNum = 24;
    let mvData = reactive([]);

    async function onLoad(){
        let total = count * dataLimitNum;
        count++;
        let dataLength = 0;
        const params = [
            {name: 'limit', value: dataLimitNum}, 
            {name: 'offset', value: total}, 
            {name: 'area', value: navList.area[activeArea.value].text}, 
            {name: 'type', value: navList.type[activeType.value].text}, 
            {name: 'order', value: navList.order[activeOrder.value].text}]

        await neteaseCloudMusicApi('mv/all', params).then(
            res => {
                res.data.forEach(item => {
                    mvData.push(item);
                })
                dataLength = res.data.length;
            }
        )
        loading.value = false;

        if ( dataLength < dataLimitNum ) {
          finished.value = true;
        }
    };

    function itemGetData(){
        mvData.splice(0, mvData.length);
        onLoad();
    }

</script>

<style scoped lang="less">
    .mv-main{
        font-size: 16px;
    }
    .mv-main-nav{
        .hot-mv{
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
                .hot-mv-item{
                    margin-right: 10px;
                    height: 100%;
                }
            }
        }

        .nav-category{
            text-align: center;
        }
    }

    .mv-main-content{
        margin: 10px 10px;
    }

    .ellipsis2{
        height: 36px;
        margin: 6px 0 2px 0;
    }
</style>