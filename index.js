const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

getTop();

async function getTop(){
    const res = await axios({
        method:"get",
        url:"https://www.pixiv.net/ranking.php",
        headers:{
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.47"
        }
    })

    const $ = cheerio.load(res.data);
    for(let i=1;i<=30;i++){
        const imgUrl = $(`section#${i} a div img`).attr("data-src")
        const originImgUrl = imgUrl.replace(/\/c\/\d\d\dx\d\d\d\/img-master(.*?)_master1200/, '/img-original$1')
        const newImgUrl = await checkImgUrl(originImgUrl);
        getImg(newImgUrl);
        await delay(500);
    }
}

async function getImg(imgUrl){
    const res = await axios({
        method:"get",
        url:imgUrl,
        headers:{
            "referer": "https://i.pximg.net/",
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.47"
        },
        responseType:"stream"
    })
    const stream = fs.createWriteStream(`./images/${imgUrl.match(/\d+(?=\_)/g)[0]}${imgUrl.match(/\.\w+$/)}`)
    res.data.pipe(stream)
}

async function checkImgUrl(imgUrl){
    try{
        const res = await axios({
            method:"get",
            url:imgUrl,
            headers:{
                "referer": "https://i.pximg.net/",
                "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.47"
            },
        })
        return imgUrl
    } catch (err) {
        const imgUrlFix = imgUrl.match(/\.\w+$/), png=".png",jpg=".jpg";
        if(imgUrlFix === png){
            return imgUrl.replace(/\.\w+$/,jpg)
        } else {
            return imgUrl.replace(/\.\w+$/,png)
        }
    }
}

function delay(ms){
    return new Promise((r)=>setTimeout(r, ms))
}
