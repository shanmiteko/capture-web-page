const { IfNotExistCreateFile } = require("../lib/utils");

/**
 * 初始化secret.json文件
 * @returns {Promise<void>}
 */
function initSecret() {
    const { BILI = '', TOKEN = '',REPO = '' } = process.env;
    return IfNotExistCreateFile(
        'src/config/secret.json',
        JSON.stringify({
            bili_cookies: BILI,
            github_access_token: TOKEN,
            github_repository: REPO
        })
    )
}

module.exports = {
    initSecret,
    "OUTPATH": "Captured pictures/",
    "UA": "Mozilla/5.0 (WiBiliCOOKIEndows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
}