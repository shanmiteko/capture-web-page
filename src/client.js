const inquirer = require("inquirer");
const { to, delay } = require("./lib/utils");
const { initSecret } = require("./config/config");

(async function () {
    let err, data;
    try {
        let i = 0;
        [err] = await to(initSecret());
        if (err instanceof Error) throw err;
        const { trigger, check } = require("./lib/api/github");
        const { setLink, importLink } = require("./lib/listenNotice");
        do {
            [err, data] = await to(check()); /* 检查是否有正在运行的workflow */
            if (err instanceof Error) throw err;
            const { total_count } = data;
            if (total_count === 0) {
                console.log('No workflow in progress');
                [err, data] = i === 0 ? await to(trigger()) : [undefined, null];/* 触发工作流 */
                i = i + 1;
                if (err instanceof Error) throw err;
                if (data === null) continue;
                if (data === '') {
                    console.log('Workflow has been successfullly triggered');
                } else {
                    throw new Error('failure to trigger!\n' + JSON.stringify({ error_reason: data }))
                }
                await delay(3000)
            } else {
                console.log(`${total_count} workflows in progress`);
                break;
            }
        } while (i < 10);
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
                }, {
                    type: 'confirm',
                    message: 'exit?',
                    name: 'exit',
                    default: false
                }
            ]))
            if (err instanceof Error) throw err;
            const { url, get, exit } = data;
            if (exit) break;
            if (get) {
                [err, data] = await to(importLink()); /* 获取链接 */
                const { cout } = data;
                typeof cout === 'string' ? console.log('<< ' + cout) : console.log('<< no proxy-url');
            }
            [err, data] = url === '' ? [undefined, 'No input'] : await to(setLink(url)); /* 设置连接 */
            if (err instanceof Error) throw err;
            console.log('>> ' + data);
        } while (i === 0);
        /* ********************交互命令行********************* */
    } catch (error) {
        console.log(error.message);
    }
})()