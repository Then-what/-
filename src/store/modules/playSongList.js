import { neteaseCloudMusicApi } from "@/utils/apiUtils"
export default {
    namespaced: true,
    states: {
        isShow: false,
        allSong: [],
        currentPlaySongId: '',
        currentPalySongData: {
            url: '',
            id: '',
            img: '',
            name: '',
            ars: []
        }
    },
    actions: {
        async getSongPlayUrl(context, songId){
            let data = {}
            await neteaseCloudMusicApi('song/url', [{name: 'id', value: songId}]).then(
                res => {
                    
                    data.url = res.data[0].url;
                    data.id = res.data[0].id;            
                }
            )
    
            await neteaseCloudMusicApi('song/detail', [{name: 'ids', value: songId}]).then(
                res => {
                    console.log(res)
                    data.name = res.songs[0].name;
                    data.img = res.songs[0].al.picUrl;
                    data.ars = res.songs[0].ar;

                }
            )
            context.commit('SET_CURRENT_SONG_DATA', data);
        }
    },
    mutations: {
        SET_PLAY_SONG_BAR(state, data){
            state.isShow = data;
        },
        SET_SONG_ID(state, id){
            state.currentPlaySongId = id;
        },
        SET_CURRENT_SONG_DATA(state, data){
            state.currentPlaySongId = data.id;
            state.currentPalySongData = data;
            sessionStorage.setItem('currentPalySongData', JSON.stringify(data));
        },
        SET_ALL_SONG(state, data){
            state.allSong = data;
        },
    },
    getters: {}
}