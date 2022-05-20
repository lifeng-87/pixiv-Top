require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");

getTop()

async function getTop(){
    const res = await axios({
        method:"get",
        url:"https://www.pixiv.net/ranking.php",
        headers:{
            "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.47"
        }
    })

    const $ = cheerio.load(res.data);
    const imgUrl = $(`section#1 a div img`).attr("data-src")
    const originImgUrl = imgUrl.replace(/\/c\/\d\d\dx\d\d\d\/img-master(.*?)_master1200/, '/img-original$1')
    getImg(originImgUrl);
}

function delay(ms){
    return new Promise((r)=>setTimeout(r, ms))
}
