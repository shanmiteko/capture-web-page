const { default: Axios } = require("axios");
const { UA } = require('../../configs/config');
const { stringify, parse } = require('querystring');

Axios.defaults = {
    timeout: 6000,
    headers: {
        'user-agent': UA,
    },
    transformRequest: [(data, headers) => {
        const contentstype = headers['content-type'] || '';
        if (/x-www-form-urlencoded/i.test(contentstype.toString())) return stringify(data);
        if (/json/i.test(contentstype.toString())) return JSON.stringify(data);
        return data
    }],
    transformResponse: [(data, headers) => {
        const contentstype = headers['content-type'] || '';
        if (/x-www-form-urlencoded/i.test(contentstype.toString())) return parse(data);
        if (/json/i.test(contentstype.toString())) return JSON.parse(data);
        return data
    }]
}
exports.axios = Axios;