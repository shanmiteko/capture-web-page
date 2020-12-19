const { screenshot } = require("./src/lib/screenshot");
const { IfNotExistCreateFile } = require("./src/lib/utils");

(function () {
    const link = 'https://zh.wikipedia.org/wiki/Rust';
    // const link = 'https://www.bilibili.com/';
    Promise.resolve()
        .then(() => process.env.BILI || '')
        .then(BILI => IfNotExistCreateFile('src/config/secret.json', JSON.stringify({ BiliCOOKIE: BILI })))
        .then(() => screenshot(link))
        .then(filename => require("./src/lib/upload").uploadToBili(filename))
        .then(res => {
            if (res.code === 0) return res.data.image_url
            return Promise.reject('message: ' + res.message)
        })
        .then(url => {
            console.log('image_url -> ', url);
        })
        .catch(err => {
            console.log(err);
        })
    return;
})()