const { axios } = require("./common")
const { TOKEN: github_access_token, REPO: github_repository } = process.env;

/**
 * @host https://api.github.com
 */
const Github = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
        "authorization": github_access_token,
        "accept": "application/vnd.github.v3+json",
        "content-type": "application/json; charset=utf-8"
    }
})

module.exports = {
    /**
     * 触发工作流
     */
    trigger: () => Github.post(
        `/repos/${github_repository}/actions/workflows/server.yml/dispatches`,
        { ref: 'master' }
    ),
    /**
     * 检查运行中的工作流
     */
    check: () => Github.get(
        `/repos/${github_repository}/actions/runs`,
        {
            params: {
                status: 'in_progress'
            }
        }
    )
}