import router from "@/router";

function sendPlaylistId(id){
        
    router.push({
        name: 'playlistDetail',
        params: {
            playlistId: id
        }
    });
}

function sendMvId(id){
        
    router.push({
        name: 'mvDetail',
        params: {
            mvId: id
        }
    });
}
export {sendPlaylistId, sendMvId};