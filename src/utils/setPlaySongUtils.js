
function firstAddData(){
    sessionStorage.setItem('currentPlaySongId', '');
    sessionStorage.setItem('allPlaySongList', JSON.stringify([]));
    sessionStorage.setItem('showSongBar', false);
}

function setPlaySongId(id){
    if(sessionStorage.getItem('currentPlaySongId')){
        firstAddData();
    }
    let songId = sessionStorage.getItem('currentPlaySongId');
    let showSongBar = sessionStorage.getItem('showSongBar');
    
    songId = id;

    showSongBar = true;
    
    sessionStorage.setItem('currentPlaySongId', songId);
    sessionStorage.setItem('showSongBar', showSongBar);
}

function pushAllPlaySong(arr){
    let data = [];
    data.push(arr);
    
    data = JSON.stringify(data)
    sessionStorage.setItem('allPlaySongList', data);
}

export {setPlaySongId, pushAllPlaySong};