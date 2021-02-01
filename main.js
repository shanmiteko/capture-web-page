const client = require("./src/client");
const server = require("./src/server");

/**
 * 命令行参数数组
 */
const argv = process.argv.slice(2);

(async function () {
    try {
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