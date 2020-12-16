const { default: Axios } = require("axios");
const FormData = require("form-data");
const fs = require('fs');
const path = require('path');
const config = require('../config/config.json');
const secret = require('../config/secret.json');
const { root } = require("./utils");

const { OUTPATH, UA } = config;
const { BiliCOOKIE } = secret;
const url = "https://api.vc.bilibili.com/api/v1/drawImage/upload";

/**
 * 上传至B站图床
 * @param {string} filename 文件名
 * @returns {Promise<JSON>}
 */
function uploadToBili(filename) {
    if(BiliCOOKIE.length === 0) return Promise.reject('请在src/config/secret.json中的BiliCOOKIE处填入Cookies');
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append("file_up", fs.createReadStream(path.join(root,OUTPATH,filename)), filename)
        form.append("biz", "draw");
        form.append("category", "daily");
        const headers = {
            ...form.getHeaders(),
            'User-Agent': UA,
            'Cookie': BiliCOOKIE,
        }
        Axios.post(url, form, { headers })
            .then(
                res => {
                    resolve(res.data);
                },
                err => {
                    reject(err);
                }
            )
    });
}

module.exports = { uploadToBili }