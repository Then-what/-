<template>
  <Suspense>
    <template v-slot:default>
      <div>
        <detail-head v-if="loaded1" :playlistId="playlistId" :playlistData="playlistData"></detail-head>
        <detail-main v-if="loaded2" :playlistId="playlistId" :songData="songData" ></detail-main>
      </div>
    </template>
  </Suspense>
</template>

<script setup>
  import { computed, defineAsyncComponent, onMounted, ref, reactive } from "vue";
  import { useRoute } from "vue-router";
  import { neteaseCloudMusicApi } from "@/utils/apiUtils";

  defineAsyncComponent(()=>import('@/components/playlist-detail/DetailHead.vue'))
  defineAsyncComponent(()=>import('@/components/playlist-detail/DetailMain.vue'))
  const route = useRoute();

  let playlistId = computed(()=>{
    return route.params.playlistId;
  })

  let loaded1 = ref(false);
  let loaded2 = ref(false);

  // 存储的数据
  let playlistData = reactive([]);

  let songIds = ref('');

  // 获取数据
  async function getPlaylistDetail(){
    await neteaseCloudMusicApi('playlist/detail', [{name: 'id', value: playlistId.value}]).then(
      res => {
          playlistData.push(res.playlist);
      }
    )
        
    loaded1.value = true;
    // 将歌曲id拼接，方便获取歌曲数据
    await playlistData[0].trackIds.forEach((item, index, arr) => {
      songIds.value = index != arr.length - 1 ? songIds.value + item.id + ',' : songIds.value + item.id;
    });

    await getSongDetail();
  }

  // 歌曲详情
  let songData = reactive([]);
  // 获取歌曲数据
  async function getSongDetail(){
    await neteaseCloudMusicApi('song/detail', [{name: 'ids', value: songIds.value}]).then(
      res => {
        res.songs.forEach(item => {
          songData.push(item);

        })
      }
    )
    loaded2.value = true;
  }
  onMounted(()=>{
    getPlaylistDetail();
  })
</script>