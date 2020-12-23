const { to, initSecret } = require("./src/lib/utils");
const client = require("./src/client");
const server = require("./src/server");

/**
 * 命令行参数数组
 */
const argv = process.argv.slice(2);

(async function () {
    try {
        const [err] = await to(initSecret());
        if (err instanceof Error) throw err;
        switch (argv[0]) {
            case 'client':
                await client();
                break;
            case 'server':
                await server();
                break;
            default:
                console.log(`Invalid argument: ${argv[0]}`);
        }
    } catch (error) {
        console.log(error.message);
    }
    return;
})()