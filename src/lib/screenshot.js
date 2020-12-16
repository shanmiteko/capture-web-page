const { root, IfNotExistCreateDir } = require('./utils');
const config = require('../config/config.json');
const puppeteer = require('puppeteer');
const path = require('path');

/**
 * 获取截屏
 * @async
 * @param {string} link URL
 * @param {number} [w=1280] 宽度
 * @param {number} [h=720] 高度
 * @param {string} [filename] 文件名
 * @returns {Promise<string>} 文件名
 */
async function screenshot(link, w = 1280, h = 720, filename = Date.now() + '.png') {
    const { OUTPATH, UA } = config;
    await IfNotExistCreateDir(OUTPATH);
    try {
        const url = new URL(link);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setUserAgent(UA);
        await page.setViewport({
            height: h,
            width: w
        })
        await page.goto(url.href);
        console.log('Output file in -> ' + path.resolve(root, OUTPATH));
        await page.screenshot({ path: path.join(root, OUTPATH, filename) });
        console.log('filename -> ' + filename);
        await browser.close();
    } catch (error) {
        console.log(error.message);
        return '';
    }
    return filename;
}

module.exports = { screenshot }