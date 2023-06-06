// 拼接所有歌手
function arNames(ars, key){
    let str = '';
    ars.forEach((item, index, arr) => {
      if(index === arr.length - 1){
        str += item[key];
      }else{
        str = str + item[key] + '/';
      }
    });

    return str;
  }

// 计算播放事件
  function formatTime(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
  }

export {formatTime, arNames};