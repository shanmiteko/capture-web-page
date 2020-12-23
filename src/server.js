const screenshot = require("./lib/screenshot");
const upload = require("./lib/upload");
const { to, delay } = require("./lib/utils");
const { fetchInput, setProxy } = require("./lib/linkIO");

/**
 * 服务端
 */
module.exports = async function server() {
    let err, data;
    try {
        let i = 0;
        /* 循环20次 */
        do {
            if (i > 0) await delay(6000);
            i = i + 1;
            [err, data] = await to(fetchInput()); /* 获取被代理的链接 */
            if (err instanceof Error) throw err;
            const { proxied, proxy, None } = data;
            if (typeof proxy === 'string' || None === null) continue;

            [err, data] = await to(screenshot(proxied)); /* 获取访问截图 */
            if (err instanceof Error) throw err;

            [err, data] = await to(upload(data)); /* 上传图片至图床 */
            if (err instanceof Error) throw err;

            [err, data] = await to(setProxy(data)); /* 图片链接传送至公告栏 */
            if (err instanceof Error) throw err;
        } while (i < 20);

        [err, data] = await to(setProxy('The server-end has closed')); /* 关闭轮询检测 */
        if (err instanceof Error) throw err;

    } catch (error) { console.log(error.message) }
    return;
}