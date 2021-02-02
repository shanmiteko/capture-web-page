# 获取网页截图
![action-badge](https://github.com/shanmite/capture-web-page/workflows/Run%20in%20Nodejs/badge.svg)  

- 通过`GitHub Actions`服务器访问指定网站并获取截图  
- 上传截图至B站图床  
`Such as`  
![example](.github/images/example.png)  

## 使用
### 环境变量
| 变量名  | 值               |
| ------- | ---------------- |
| `BILI`  | bilibili Cookies |
| `TOKEN` | GitHub Token     |
| `REPO`  | 仓库名           |
### 客户端
```shell
npm run client-install
npm start
```  
触发位于`GitHub Actions`服务器上的服务端工作流  
填入要访问的网站链接
### 服务端
```shell
npm run server-install
npm run server
```  
开启监听B站个人公告中填写的链接  
> `>>`[要访问的网站链接]  
> `<<`[指定网站的截图]

