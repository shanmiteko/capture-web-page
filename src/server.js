const { screenshot } = require("./lib/screenshot");
const { to, delay } = require("./lib/utils");
const { initSecret } = require("./config/config");

(async function () {
    let err, data;
    try {
        [err] = await to(initSecret());
        if (err instanceof Error) throw err;
        let i = 0;
        const { upload } = require("./lib/upload");
        const { importLink, exportLink } = require("./lib/listenNotice");
        /* 循环20次 */
        do {
            i === 0 ? i++ : await delay(6000);
            [err, data] = await to(importLink()); /* 获取被代理的链接 */
            if (err instanceof Error) throw err;
            const { cin, cout, no } = data;
            if (typeof cout === 'string' || typeof no === 'string') continue;

            [err, data] = await to(screenshot(cin)); /* 获取访问截图 */
            if (err instanceof Error) throw err;

            [err, data] = await to(upload(data)); /* 上传图片至图床 */
            if (err instanceof Error) throw err;

            [err, data] = await to(exportLink(data)); /* 图片链接传送至公告栏 */
            if (err instanceof Error) throw err;
        } while (i < 20);
    } catch (error) { console.log(error.message) }
    return;
})()