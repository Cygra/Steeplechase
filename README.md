# Steeplechase

自动跳过中间跳转页，直达目标链接的浏览器插件。

一些平台会把外链包装在自己的跳转页里（如飞书的安全提示页、知乎的外链跳转页）。Steeplechase 检测到这类 URL 后，自动提取真实目标地址并直接跳转，无需额外点击或等待。

<img width="680" height="318" alt="image" src="https://github.com/user-attachments/assets/a03b1b94-2c1f-420a-bd0d-2a2230bee9ee" />

<img width="631" height="327" alt="image" src="https://github.com/user-attachments/assets/0df66a9d-f2d9-4a12-9a9d-972578b9dea1" />


**当前支持的规则：**

| 平台 | URL 格式                                  |
| ---- | ----------------------------------------- |
| 飞书 | `security.feishu.cn/link/safety?target=…` |
| 知乎 | `link.zhihu.com/?target=…`                |

## 安装

### Chrome / Edge / Arc

1. 打开 `chrome://extensions`（Edge 为 `edge://extensions`）。
2. 开启右上角的**开发者模式**。
3. 点击**加载已解压的扩展程序**。
4. 选择 `Steeplechase` 文件夹。

### Firefox

1. 打开 `about:debugging#/runtime/this-firefox`。
2. 点击**临时载入附加组件**。
3. 选择 `Steeplechase` 文件夹内的任意文件（如 `manifest.json`）。

> 注意：Firefox 的临时扩展在浏览器关闭后会失效。如需持久安装，需通过 Mozilla Add-ons 对扩展进行签名。

## 添加新规则

编辑 `redirect.js`，在 `RULES` 数组中追加一条记录：

```js
{
  pattern: /^https:\/\/example\.com\/redirect/,
  param: "url",  // 存放目标链接的查询参数名
}
```
