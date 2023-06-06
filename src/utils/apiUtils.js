import axios from "axios";

// 封装网易云api
async function neteaseCloudMusicApi(url, keyword=[]){
    let apiUrl = "http://localhost:8080/data/" + url + "?";
    let data = [];
    // 将所有的关键字拼接
    keyword.forEach((item, index, arr) => {
        // 循环拼接字符串
        apiUrl += index === arr.length - 1 ? item.name + "=" + item.value : item.name + "=" + item.value + "&";
    });
    console.log(apiUrl)
    // 判断请求方式
    await axios.get(apiUrl).then(
        res => {
            data = res.data
        },
        err => {
            console.log(err);
        }
    )
    
    return data;
}

export {neteaseCloudMusicApi}