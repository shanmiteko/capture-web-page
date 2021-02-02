const inquirer = require("inquirer");
const { to, delay } = require("./lib/utils");
const { trigger, check } = require("./lib/api/github");
const { fetchInput, setProxied } = require("./lib/linkIO");

/**
 * 客户端
 */
module.exports = async function client() {
    let err, pdata;
    try {
        let i = 0;
        do {
            [err, pdata] = await to(check()); /* 检查是否有正在运行的workflow */
            if (err instanceof Error) throw err;
            const { total_count } = pdata.data;
            if (typeof total_count === 'undefined') throw new Error(JSON.stringify({ error_reason: pdata }))
            if (total_count === 0) {
                console.log('No workflow in progress');
                [err, pdata] = await to(inquirer.prompt([
                    {
                        type: 'confirm',
                        message: 'trigger the workflow?',
                        name: 'btrigger',
                        default: false
                    }
                ]))
                if (err instanceof Error) throw err;
                if (!pdata.btrigger) break;
                [err, pdata] = i++ ? [undefined, null] : await to(trigger());/* 触发工作流 */
                if (err instanceof Error) throw err;
                if (pdata === null) continue;
                if (pdata.data === '') {
                    console.log('Workflow has been successfullly triggered');
                } else {
                    throw new Error('failure to trigger!\n' + JSON.stringify({ error_reason: pdata }))
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
            [err, pdata] = await to(inquirer.prompt([
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
            const { url, get, exit } = pdata;
            if (exit) break;
            if (get) {
                [err, pdata] = await to(fetchInput()); /* 获取链接 */
                const { proxy } = pdata;
                typeof proxy === 'string' ? console.log('<< ' + proxy) : console.log('<< No proxy-url');
            }
            [err, pdata] = url === '' ? [undefined, undefined] : await to(setProxied(url)); /* 设置被代理链接 */
            if (err instanceof Error) throw err;
            if (typeof pdata !== 'undefined') console.log('>> ' + pdata);
        } while (i === 0);
        /* ********************交互命令行********************* */

    } catch (error) {
        console.log(error.message);
    }
}