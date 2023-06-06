import { createStore } from 'vuex';
import playSongList from '@/store/modules/playSongList.js';

export default createStore({
    modules: {
        playSongList
    }
})