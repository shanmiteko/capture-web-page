const { getNotice, setNotice } = require("./api/bilibili");

/**
 * 获取输入
 * @returns {Promise<{proxied: string}|{proxy: string}|{None: null}>}
 */
async function fetchInput() {
    try {
        const res = (await getNotice()).data;
        if (res.code === 0) {
            const { data } = res;
            /**startWith `<<` */
            const isIn = /^&gt;&gt;[^&]/.test(data);
            /**startWith `>>` */
            const isOut = /^&lt;&lt;[^&]/.test(data);
            if (isIn) {
                console.log('Successfully obtained the proxied link');
                return { proxied: data.substr(8) };
            } else if (isOut) {
                console.log('Successfully obtained the proxy link');
                return { proxy: data.substr(8) };
            } else {
                console.log('Input does not meet the requirements!\nPlease startwith ">>"');
                return { None: null }
            }
        } else {
            return typeof res === 'object' ? Promise.reject(JSON.stringify(res)) : Promise.reject(res)
        }
    } catch (error) {
        return Promise.reject(error)
    }
}

/**
 * 输出 `<<` + `Proxy link`  
 * 传回代理访问链接`type: 网页截图`
 * @param {string} text
 * @returns {Promise<string>}
 * | status  | value        |
 * | :----   | :----        |
 * | success | Proxy link |
 * | err     | undefined    |
 */
async function setProxy(text) {
    try {
        const res = (await setNotice('<<' + text)).data;
        if (res.code === 0) {
            return (await fetchInput()).proxy;
        } else {
            return typeof res === 'object' ? Promise.reject(JSON.stringify(res)) : Promise.reject(res)
        }
    } catch (error) {
        return Promise.reject(error)
    }
}
/**
 * 输出 `>>` + `Proxied link`  
 * 设置被代理链接
 * @param {string} text
 * @returns {Promise<string>}
 * | status  | value        |
 * | :----   | :----        |
 * | success | Proxied link |
 * | err     | undefined    |
 */
async function setProxied(text) {
    try {
        const res = (await setNotice('>>' + text)).data;
        if (res.code === 0) {
            return (await fetchInput()).proxied;
        } else {
            return typeof res === 'object' ? Promise.reject(JSON.stringify(res)) : Promise.reject(res)
        }
    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = {
    fetchInput,
    setProxy,
    setProxied
}