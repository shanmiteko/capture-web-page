const { screenshot } = require("./lib/screenshot");
const { IfNotExistCreastFile } = require("./lib/utils");

(function () {
    Promise.resolve()
        .then(() => IfNotExistCreastFile('src/config/secret.json', '{"BiliCOOKIE": ""}'))
        .then(() => screenshot('https://www.bilibili.com'))
        .then(filename => require("./lib/upload").uploadToBili(filename))
        .then(res => {
            if (res.code === 0) return res.data.image_url
            return Promise.reject('code: ' + res.code)
        })
        .then(url => {
            console.log('image_url -> ', url);
        })
        .catch(err => {
            console.log(err);
        })
    return;
})()