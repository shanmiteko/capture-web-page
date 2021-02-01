const { axios } = require("./common");
const { BILI: bili_cookies } = process.env;

const [uid, csrf] = (() => {
    const map = new Map();
    const key = ['DedeUserID', 'bili_jct'];
    bili_cookies.split("; ").forEach(cookie => {
        const cookie_pair = cookie.split("=");
        map.set(cookie_pair[0], cookie_pair[1]);
    })
    return [map.get(key[0]), map.get(key[1])]
})();

/**
 * @host https://api.vc.bilibili.com
 */
const Bilivc = axios.create({
    baseURL: 'https://api.vc.bilibili.com/',
    headers: {
        'cookie': bili_cookies
    }
});

/**
 * @host https://api.bilibili.com
 */
const Bili = axios.create({
    baseURL: 'https://api.bilibili.com/',
    headers: {
        'cookie': bili_cookies
    }
});

module.exports = {
    /**
     * 上传至bili图床
     * @param {import("form-data")} form
     */
    imgBed: (form) => {
        if (bili_cookies.length === 0) return Promise.reject('请在src/config/secret.json中的bili_cookie处填入值');
        return Bilivc.post(
            '/api/v1/drawImage/upload',
            form,
            { headers: { ...form.getHeaders() } }
        )
    },
    /**
     * 获取公告栏信息
     */
    getNotice: () => {
        return Bili.get(
            '/x/space/notice',
            {
                params: {
                    mid: uid
                },
            }
        )
    },
    /**
     * 设置公告信息
     * @param {string} text
     */
    setNotice: (text) => {
        return Bili.post(
            '/x/space/notice/set',
            {
                notice: text,
                csrf: csrf
            },
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded; charset=utf-8"
                }
            }
        )
    }
}