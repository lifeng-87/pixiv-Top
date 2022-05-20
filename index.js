require("dotenv").config();
const axios = require("axios");
const fetch = require("node-fetch");
const cheerio = require("cheerio");
const querystring = require("query-string");

const LOGIN_URL =
	"https://accounts.pixiv.net/login?return_to=https%3A%2F%2Fwww.pixiv.net%2F&lang=zh_tw&source=pc&view_type=page";
const USER_AGENT =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36 Edg/101.0.1210.47";
const API_URL = "https://accounts.pixiv.net/ajax/login?lang=zh_tw"

function login({ username, passwd }) {
	const getKey = axios({
		method: "get",
		url: LOGIN_URL,
        headers: {
            "user-agent": USER_AGENT
        },
        data:querystring.stringify({
            return_to: "https://www.pixiv.net/",
            lang: "zh_tw",
            source: "pc",
            view_type: "page",
        })
	}).then((res)=>{
        console.log(res.data);
        const $ = cheerio.load(res.data);
        const token = $('input[id="recaptcha-token"]').html()
        const cookie = res.headers["set-cookie"];
        console.log(cookie, token)
    })
}

login({username: process.env.USERNAME, passwd:process.env.PASSWD});
