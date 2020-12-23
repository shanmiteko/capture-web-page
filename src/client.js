const inquirer = require("inquirer");
const { to, delay } = require("./lib/utils");
const { trigger, check } = require("./lib/api/github");
const { fetchInput, setProxied } = require("./lib/linkIO");

/**
 * 客户端
 */
module.exports = async function client() {
    let err, data;
    try {
        let i = 0;
        do {
            [err, data] = await to(check()); /* 检查是否有正在运行的workflow */
            if (err instanceof Error) throw err;
            const { total_count } = data;
            if (typeof total_count === 'undefined') throw new Error(JSON.stringify({ error_reason: data }))
            if (total_count === 0) {
                console.log('No workflow in progress');
                [err, data] = await to(inquirer.prompt([
                    {
                        type: 'confirm',
                        message: 'trigger the workflow?',
                        name: 'btrigger',
                        default: false
                    }
                ]))
                if (err instanceof Error) throw err;
                if (!data.btrigger) break;
                [err, data] = i === 0 ? await to(trigger()) : [undefined, null];/* 触发工作流 */
                i = i + 1;
                if (err instanceof Error) throw err;
                if (data === null) continue;
                if (data === '') {
                    console.log('Workflow has been successfullly triggered');
                } else {
                    throw new Error('failure to trigger!\n' + JSON.stringify({ error_reason: data }))
                }
                await delay(6000);
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
                    message: 'The proxied-url:',
                    name: 'url',
                    default: ''
                }, {
                    type: 'confirm',
                    message: 'Whether or not to get proxy-url?',
                    name: 'get',
                    default: false
                }, {
                    type: 'confirm',
                    message: 'Exit?',
                    name: 'exit',
                    default: false
                }
            ]))
            if (err instanceof Error) throw err;
            const { url, get, exit } = data;
            if (exit) break;
            if (get) {
                [err, data] = await to(fetchInput()); /* 获取链接 */
                const { proxy } = data;
                typeof proxy === 'string' ? console.log('<< ' + proxy) : console.log('<< No proxy-url');
            }
            [err, data] = url === '' ? [undefined, undefined] : await to(setProxied(url)); /* 设置被代理链接 */
            if (err instanceof Error) throw err;
            if (typeof data !== 'undefined') console.log('>> ' + data);
        } while (i === 0);
        /* ********************交互命令行********************* */

    } catch (error) {
        console.log(error.message);
    }
}