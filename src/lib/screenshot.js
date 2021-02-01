const { ifNotExistCreateDir } = require('./utils');
const { root, OUTPATH, UA } = require('../config');
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
module.exports = async function screenshot(link, w = 1280, h = 720, filename = Date.now() + '.png') {
    await ifNotExistCreateDir(OUTPATH);
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