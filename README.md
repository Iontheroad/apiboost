# apiboost

一个开源工具，助力提升前端API开发效率。基于OpenAPI规范解析源数据，自动生成JavaScript/TypeScript API调用代码，与Vue、React等主流框架无缝集成，显著提高您的API开发流程。

[![npm](https://img.shields.io/npm/v/apiboost)](https://www.npmjs.com/package/apiboost)
[![license](https://img.shields.io/npm/l/apiboost)](https://github.com/Iontheroad/apiboost/blob/main/LICENSE)

## 功能特点

- 🚀 **自动化生成**：根据 OpenAPI/Swagger 规范自动生成 API 调用代码
- 🔄 **多种导出风格**：支持函数式和对象式两种导出方式
  - [x] 函数式
  - [ ] 对象式
- 📝 **智能类型推导**：自动解析数值枚举并生成 TypeScript 联合类型
- 📚 **丰富注释**：可选生成 JSDoc 注释，提供良好的开发体验
- ⚙️ **高度可配置**：支持自定义请求封装、URL 前缀、文件命名等
- 🔧 **CLI 支持**：提供命令行工具，方便集成到构建流程中
  - [ ] 扩展 `cli` 命令参数以支持更多配置选项
## 安装

```bash
# 使用 npm
npm install apiboost

# 使用 yarn
yarn add apiboost

# 使用 pnpm
pnpm add apiboost
```

## 快速开始

### 1. 创建配置文件

在项目根目录创建 `apiboost.config.ts` 配置文件：

```ts
import type { GeneratorConfig } from "apiboost";

export const apiboost: GeneratorConfig[] = [
  {
    "sourcePath": "swagger/swagger.json",  // OpenAPI/Swagger 文件路径
    "outDir": "src/api",                   // 生成代码的输出目录
    "exportStyle": "function",             // 导出风格: "object" | "function"
    "outputExt": "ts",                     // 输出文件类型: "ts" | "js"
    "baseUrlPrefix": "/api",               // URL 前缀
    "filenameCase": "camel",               // 文件命名风格: "camel" | "kebab"
    "includeJSDoc": true,                  // 是否生成 JSDoc 注释
    "groupInclude": [],                    // 要生成的分组（空数组表示全部）
    "requestImport": {
      "enabled": true,                     // 是否启用请求导入
      "importLine": "import request from '@/utils/request';", // 导入语句
      "identifier": "request"              // 请求函数标识符
    }
  }
];
```

### 2. 运行生成命令

```bash
# 使用 npx 运行
npx apiboost

# 或者添加到 package.json scripts 中
# "scripts": {
#   "generate-api": "apiboost"
# }
```

## 配置说明

| 属性                     | 类型                   | 必填 | 描述                             |
| ------------------------ | ---------------------- | ---- | -------------------------------- |
| sourcePath               | string                 | 是   | OpenAPI/Swagger 文件路径         |
| outDir                   | string                 | 是   | 生成代码的输出目录               |
| exportStyle              | "object" \| "function" | 否   | 导出风格，默认为 "function"      |
| outputExt                | "ts" \| "js"           | 否   | 输出文件类型，默认为 "ts"        |
| baseUrlPrefix            | string                 | 否   | URL 前缀                         |
| filenameCase             | "camel" \| "kebab"     | 否   | 文件命名风格，默认为 "camel"     |
| includeJSDoc             | boolean                | 否   | 是否生成 JSDoc 注释，默认为 true |
| groupInclude             | string[]               | 否   | 要生成的分组（空数组表示全部）   |
| requestImport.enabled    | boolean                | 否   | 是否启用请求导入                 |
| requestImport.importLine | string                 | 否   | 导入语句                         |
| requestImport.identifier | string                 | 否   | 请求函数标识符                   |

## 使用示例

假设你的 Swagger 文件中有以下接口定义：

```json
{
  "paths": {
    "/users/{id}": {
      "get": {
        "summary": "获取用户信息",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": {
              "type": "integer"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "成功"
          }
        }
      }
    }
  }
}
```

运行 apiboost 后会生成类似以下的代码：

```ts
/**
 * 获取用户信息
 * @group user
 * @route /users/{id} [GET]
 * @param {number} pathParams.id 
 */
export function getUserById(pathParams: {
  /**  */
  id: number;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: `/users/${pathParams.id}`,
    method: "get",
  });
}
```

使用生成的 API：

```ts
import { getUserById } from './api/user';

// 调用接口
const userData = await getUserById({ id: 123 });
```

## 命令行参数

```bash
apiboost [options]

Options:
  -c, --config <path>  指定配置文件路径 (默认: ./apiboost.config.ts)
  -h, --help           显示帮助信息
  -v, --version        显示版本信息
```

## License

MIT © [peak](https://zhanggaofeng.cn)