const FormData = require("form-data");
const path = require('path');
const fs = require('fs');

const { imgBed } = require("./api/bilibili");
const { root } = require("./utils");
const { OUTPATH } = require('../config/config');

/**
 * 上传本地图片
 * @param {string} filename 文件名
 * @returns {Promise<string>} 图片链接
 */
function upload(filename) {
    return new Promise((resolve, reject) => {
        const form = new FormData();
        form.append("file_up", fs.createReadStream(path.join(root, OUTPATH, filename)), filename)
        form.append("biz", "draw");
        form.append("category", "daily");
        imgBed(form).then(
            AxiosResponse => {
                const { data: res } = AxiosResponse;
                res.code === 0 ?
                    resolve(res.data.image_url) : reject(res)
            },
            err => reject(err)
        )
    });
}

module.exports = { upload }