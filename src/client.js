const inquirer = require("inquirer");
const { trigger, check } = require("./lib/api/github");
const { setLink, importLink } = require("./lib/listenNotice");
const { to, delay } = require("./lib/utils");

(async function () {
    let err, data;
    try {
        let i = 0;
        do {
            [err, data] = await to(check()); /* 检查是否有正在运行的workflow */
            if (err instanceof Error) throw err;
            if (i > 0) await delay(30000);
            if (data.total_count > 0) continue;
            console.log('no workflow in progress');
            break;
        } while (i < 5);
        [err, data] = await to(trigger()) /* 触发工作流 */
        if (err instanceof Error) throw err;
        if (data !== '') throw new Error('failure to trigger!');
        console.log('workflow has been triggered');
        /* ********************交互命令行********************* */
        i = 0;
        do {
            [err, data] = await to(inquirer.prompt([
                {
                    type: 'input',
                    message: 'proxied-url:',
                    name: 'url',
                    default: ''
                }, {
                    type: 'confirm',
                    message: 'Whether or not to get proxy-url?',
                    name: 'get',
                    default: false
                },{
                    type: 'confirm',
                    message: 'exit?',
                    name: 'exit',
                    default: true
                }
            ]))
            if (err instanceof Error) throw err;
            const { url, get, exit } = data;
            if (exit) break;
            if (get) {
                [err, data] = await to(importLink()); /* 获取链接 */
                const { cout } = data;
                typeof cout === 'string' ? console.log(cout) : console.log('no proxy-url');
            }
            [err, data] = url === '' ? [undefined, undefined] : await to(setLink(url)); /* 设置连接 */
            if (err instanceof Error) throw err;
            console.log('>> '+data);
        } while (i < 10);
        /* ********************交互命令行********************* */
    } catch (error) {
        console.log(error.message);
    }
})()