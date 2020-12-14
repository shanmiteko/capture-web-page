const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const chrome = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36';
const filename = Date.now() + '.png';
const OUTPATH = './Captured pictures/';

/**
 * @param {string} dirname 目录的路径
 * @returns {Promise<void}
 */
function IfNotExistCreateDir(dirname) {
    return new Promise((resolve) => {
        fs.opendir(dirname, (err, dir) => {
            if (err) fs.mkdirSync(dirname)
            typeof dir === 'undefined' ? console.log('Create folder -> '+path.resolve(dirname)) : dir.close();
            resolve();
        })
    });
}
/**
 * 获取截屏
 * @async
 * @param {string} link URL
 * @param {number} [w=1280] 宽度
 * @param {number} [h=720] 高度
 * @returns {Promise<void>}
 */
async function screenshot(link, w = 1280, h = 720) {
    await IfNotExistCreateDir(OUTPATH);
    try {
        const url = new URL(link);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setUserAgent(chrome)
        await page.setViewport({
            height: h,
            width: w
        })
        await page.goto(url.href);
        console.log('Output file in -> '+path.resolve(OUTPATH));
        await page.screenshot({ path: OUTPATH + filename });
        console.log('filename -> ' + filename);
        await browser.close();
    } catch (error) {
        console.log(error.message);
    }
    return;
}
module.exports = { screenshot }