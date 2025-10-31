import fs from 'fs-extra'
import path from "node:path";
import { pathToFileURL, } from "node:url";
import { transpileModule, ScriptTarget, ModuleKind, ModuleResolutionKind } from "typescript";
import requireFromString from 'require-from-string'
import { GeneratorConfig } from '../api-generator.js'
import { defaultApiboostCliConfig, apiboostConfigFileNames } from '../config.js';


/**
 * 获取文件内容信息
 * @param path 文件路径
 * @returns 文件内容
 */
export function loadFile(path: string) {
  let jsResult = ''
  const fileResult = fs.readFileSync(path, 'utf-8')

  if (path.endsWith('.ts')) {
    jsResult = transpileModule(fileResult, {
      compilerOptions: {
        moduleResolution: ModuleResolutionKind.NodeNext,
        target: ScriptTarget.ESNext,
        module: ModuleKind.NodeNext,
        strict: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        declaration: true,
        downlevelIteration: true,
      },
    }).outputText
  }

  if (path.endsWith('.js')) {
    jsResult = fileResult
  }

  // 不是 js 或者 ts 文件内容统一按照 json 格式处理
  if (!jsResult) {
    return fs.readJSONSync(path)
  }

  const result = requireFromString(jsResult, path)
  return result.default || result
}





/**
 * @description 存在默认的 apiboost 将不会再读取配置文件
 * @param initialConfig 默认的 apiboostConfig
 * @returns
 */
export async function getApiboostCliConfig(initialConfig?: GeneratorConfig[]): Promise<GeneratorConfig[]> {
  const supportTs =
    fs.existsSync(path.join(process.cwd(), 'tsconfig.json')) ||
    fs.existsSync(path.join(process.cwd(), 'tsconfig.base.json'))

  const baseConfig = Object.assign({ outputExt: supportTs ? 'ts' : 'js' }, defaultApiboostCliConfig)

  // 检查是否存在配置文件
  const cliConfigFileName = checkApiboostConfigFile() as string
  if (!cliConfigFileName && !initialConfig) {
    throw new Error(`指定的配置文件不存在 ${apiboostConfigFileNames}`);
  }


  let apiboostConfigs = [] as GeneratorConfig[]

  try {
    apiboostConfigs = initialConfig || loadFile(cliConfigFileName)
    apiboostConfigs = (apiboostConfigs as Record<string, any>)?.apiboost || apiboostConfigs

    if (!Array.isArray(apiboostConfigs)) {
      throw new Error('apiboostConfigs must be an array')
    }

    return apiboostConfigs
  } catch (error) {
    console.error(`[apiboost-cli] failed to parse configuration file, please check [${error}]`)
    return []
  }
}


/**
 * 检查配置文件是否存在
 * @param rootPath 项目根路径
 * @param configFiles 配置文件
 * @returns 文件路径
 */
export function checkApiboostConfigFile(rootPath = process.cwd(), configFiles = apiboostConfigFileNames) {
  let fileName = ''

  for (const name of configFiles) {
    const filePath = path.join(rootPath, name)
    if (fs.existsSync(filePath)) {
      fileName = filePath
      break
    }
  }

  return fileName || false
}




/**
 * 加载生成器配置
 * - 优先使用命令行指定的配置文件路径
 * - 其次从项目根目录的 apiboost.config.ts 读取
 * - 若缺失，尝试从 src/config.json 读取
 * - 若都缺失，抛错提示
 */
export async function loadConfig(customConfigPath?: string): Promise<GeneratorConfig | GeneratorConfig[]> {
  // 如果指定了自定义配置路径，优先使用
  if (customConfigPath) {
    const customPath = path.resolve(process.cwd(), customConfigPath);
    if (!fs.existsSync(customPath)) {
      throw new Error(`指定的配置文件不存在: ${customPath}`);
    }

    try {
      // 根据文件扩展名决定如何加载
      if (customPath.endsWith('.ts')) {
        const { apiboost }: { apiboost: GeneratorConfig } = await import(customPath);
        if (apiboost) {
          console.log('使用配置文件:', customPath);
          return apiboost;
        }
        throw new Error(`配置文件格式错误: ${customPath}`);
      } else {
        // 假设是JSON文件
        console.log('使用配置文件:', customPath);
        return JSON.parse(fs.readFileSync(customPath, 'utf8')) as GeneratorConfig;
      }
    } catch (error) {
      console.error('加载配置文件失败:', error);
      throw new Error(`无法加载配置文件: ${customPath}`);
    }
  }

  // 优先加载编译后的 JS，再回退到 TS
  const configJsPath = path.resolve(process.cwd(), 'apiboost.config.js');
  const configTsPath = path.resolve(process.cwd(), 'apiboost.config.ts');

  if (fs.existsSync(configJsPath)) {

    try {

      /**
       * 为什么传递给 import() 的是 pathToFileURL(configJsPath).href 而不是 configJsPath ？
       *
       * ES 模块的 import() 语句（尤其是动态导入）期望接收一个 URL ，而不是一个普通的文件系统路径。
       * pathToFileURL 是 Node.js 内置 url 模块提供的一个工具函数，它的作用就是将一个文件系统路径转换为一个标准的 file:// 协议的 URL 对象。
       *    例如， d:\project\my_study_project\apiboost\apiboost.config.ts 会被转换为 file:///D:/project/my_study_project/apiboost/apiboost.config.ts 这样的 URL
       */
      const { apiboost } = await import(pathToFileURL(configJsPath).href);
      if (apiboost) {
        console.log('使用配置文件:', configJsPath);
        return apiboost;
      }
    } catch (error) {
      console.error('加载配置文件失败:', error);
      throw new Error(`无法加载配置文件 apiboost.config.js : ${configJsPath}`);
    }
  }

  if (fs.existsSync(configTsPath)) {
    try {
      const { apiboost } = await import(pathToFileURL(configTsPath).href);
      if (apiboost) {
        console.log('使用配置文件:', configTsPath);
        return apiboost;
      }
    } catch (error) {
      console.error('加载配置文件失败:', error);
      throw new Error(`无法加载配置文件 apiboost.config.ts : ${configTsPath}`);
    }
  }


  throw new Error('缺少配置文件 apiboost.config.ts ');
}


