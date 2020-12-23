const { axios } = require("./common")
const { github_access_token,github_repository } = require('../../configs/secret.json');

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
Github.interceptors.response.use(
    res => res.data,
    err => err.response
)

/**
 * 触发工作流
 */
exports.trigger = () => Github.post(`/repos/${github_repository}/actions/workflows/server.yml/dispatches`, { ref: 'master' }),
/**
 * 检查运行中的工作流
 */
exports.check = () => Github.get(
    `/repos/${github_repository}/actions/runs`,
    {
        params: {
            status: 'in_progress'
        }
    }
)