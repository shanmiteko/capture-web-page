const fs = require('fs');
const path = require('path');

/**
 * 项目的根目录
 */
const root = path.join(__dirname, '..', '..')

/**
 * @template T
 * @param {Promise<T>} promise
 * @returns {Promise<[null|Error, T|undefined]>}
 */
function to(promise) {
    return promise
        .then(data => [null, data])
        .catch(err => {
            if (err instanceof Error) return [err, undefined]
            return [new Error(err), undefined]
        })
}

/**
 * @param {string} dirname 相对于根目录的目录路径
 * @returns {Promise<void}
 */
function IfNotExistCreateDir(dirname) {
    const dirpath = path.join(root, dirname);
    return new Promise((resolve) => {
        fs.opendir(dirpath, (err, dir) => {
            if (err) fs.mkdirSync(dirname)
            typeof dir === 'undefined' ? console.log('Create folder -> ' + path.resolve(dirname)) : dir.close();
            resolve();
        })
    });
}

/**
 * 
 * @param {string} filepath 相对于根目录的文件路径
 * @param {string} [defaultValue] 写入默认值
 * @returns {Promise<void>}
 */
function IfNotExistCreastFile(filepath, defaultValue = '') {
    const fpath = path.join(root, filepath);
    const buffer = Buffer.from(defaultValue);
    return new Promise((resolve, rejects) => {
        fs.open(fpath, 'wx', (err, fd) => {
            if (err) {
                resolve();
            } else {
                fs.write(fd, buffer, 0, buffer.length, 0, err => {
                    if (err) {
                        rejects(err)
                    } else {
                        resolve();
                    }
                })
            }
        })
    });
}

module.exports = {
    root,
    to,
    IfNotExistCreateDir,
    IfNotExistCreastFile
}