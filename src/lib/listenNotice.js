const { getNotice, setNotice } = require("./api/bilibili");

/**
 * 获取将要访问的link
 * @returns {Promise<{cin: string}|{cout: string}|{no: string}>}
 */
async function importLink() {
    try {
        const res = (await getNotice()).data;
        if (res.code === 0) {
            const { data } = res;
            const isIn = /^&gt;&gt;[^&]/.test(data);
            const isOut = /^&lt;&lt;[^&]/.test(data);
            if (isIn) {
                const url = data.substr(8);
                console.log('Successfully obtained the proxied link');
                return { cin: url };
            } else if (isOut) {
                const url = data.substr(8);
                console.log('Successfully obtained the proxy link');
                return { cout: url };
            } else {
                console.log('Input does not meet the requirements!\nPlease startwith ">>"');
                return { no: '' }
            }
        } else {
            return typeof res === 'object' ? Promise.reject(JSON.stringify(res)) : Promise.reject(res)
        }
    } catch (error) {
        return Promise.reject(error)
    }
}
/**
 * 传回网页图片链接
 * @param {string} text
 * @returns {Promise<string>}
 */
async function exportLink(text) {
    try {
        const res = (await setNotice('<<' + text)).data;
        if (res.code === 0) {
            return (await importLink()).cout;
        } else {
            return typeof res === 'object' ? Promise.reject(JSON.stringify(res)) : Promise.reject(res)
        }
    } catch (error) {
        return Promise.reject(error)
    }
}
/**
 * 设置被代理链接
 * @param {string} text
 * @returns {Promise<string>}
 */
async function setLink(text) {
    try {
        const res = (await setNotice('>>' + text)).data;
        if (res.code === 0) {
            return (await importLink()).cin;
        } else {
            return typeof res === 'object' ? Promise.reject(JSON.stringify(res)) : Promise.reject(res)
        }
    } catch (error) {
        return Promise.reject(error)
    }
}

module.exports = {
    importLink,
    exportLink,
    setLink
}