<template>
    <div style="margin-bottom: 60px;">
        <child-head title="排行榜"/>
        <toplist-category v-for="item, index in toplistTitle" :key="index" :title="item" :toplistData="toplistData[index]"></toplist-category>
    </div>
</template>

<script setup>
    import { neteaseCloudMusicApi } from '@/utils/apiUtils'
    import { onMounted, reactive } from 'vue'

    import ToplistCategory from '@/components/home-components/toplist/ToplistCategory.vue';

    const toplistTitle = ['官方榜', '语种榜', '曲风榜'];

    const toplistData = reactive([
        [{name: '飙升榜'}, {name: '新歌榜'}, {name: '原创榜'}, {name: '热歌榜'}],
        [
            {name: '云音乐欧美热歌榜'}, 
            {name: '云音乐欧美新歌榜'}, 
            {name: '俄语榜'}, 
            {name: '云音乐日语榜'}, 
            {name: '云音乐韩语榜'}, 
            {name: '越南语榜'}, 
            {name: '泰语榜'}],
        [
            {name: '云音乐电音榜'}, 
            {name: '云音乐古典榜'}, 
            {name: '云音乐国电榜'}, 
            {name: '云音乐ACG榜'}, 
            {name: '云音乐摇滚榜'}, 
            {name: '云音乐国风榜'}, 
            {name: '中文DJ榜'}, 
            {name: '云音乐民谣榜'}]
    ]);

    // 获取歌单数据数据
    function getToplistCategorys(){
        neteaseCloudMusicApi('toplist', []).then(
            res => {
                for(let i = 0; i < toplistData.length; i++){
                    toplistData[i].forEach((item1, index) => {
                        for(let item2 of res.list){
                            if(item2.name === item1.name){
                                toplistData[i][index].coverImgUrl = item2.coverImgUrl;
                                toplistData[i][index].id = item2.id;
                                break;
                            }
                        }
                    })
                }
            }
        )
    }

    onMounted(()=>{
        getToplistCategorys()
    })
</script>

<style scoped lang="less">
</style>