const { screenshot } = require("./lib/screenshot");
const { to, delay } = require("./lib/utils");
const { upload } = require("./lib/upload");
const { importLink, exportLink } = require("./lib/listenNotice");
const { initSecret } = require("./config/config");

(async function () {
    let err, data;
    try {
        [err] = await to(initSecret());
        if (err instanceof Error) throw err;
        let i = 0;
        /* 循环10次 */
        do {
            [err, data] = await to(importLink()); /* 获取被代理的链接 */
            if (err instanceof Error) throw err;
            const { cin, cout } = data;
            if (i > 0) await delay(6000);
            if (typeof cout === 'string') continue;

            [err, data] = await to(screenshot(cin)); /* 获取访问截图 */
            if (err instanceof Error) throw err;

            [err, data] = await to(upload(data)); /* 上传图片至图床 */
            if (err instanceof Error) throw err;

            [err, data] = await to(exportLink(data)); /* 图片链接传送至公告栏 */
            if (err instanceof Error) throw err;

        } while (i < 10);
    } catch (error) { console.log(error.message) }
    return;
})()