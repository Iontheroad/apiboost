/**
 * 示例脚本：将 OpenAPI 转换为标准 JSONC 输出
 * 运行方式（任选其一）：
 * 1) 使用 ts-node:
 *    npx ts-node scripts/generate.ts
 * 2) 先编译再运行：
 *    tsc && node dist/scripts/generate.js
 */
import {processOpenAPIToStandard} from "@zpeak/openapi-adapter"
// import { processOpenAPIToStandard } from "../src/pipeline/index";

async function main() {
  // const inputPath = "swagger/sw3.json";
  // const outputPath = "standard/blog.openapi.result.generated.sw.jsonc";
  const inputPath = "swagger/blog.all.openapi.json";
  const outputPath = "standard/blog.all.openapi.result.generated.tag.json";

  const result = await processOpenAPIToStandard({
    inputPath,
    outputPath,
    // 分组模式：将 "tag" 切换为 "path" 可按路径首段分组
    // 使用建议：
    // - "tag": 适用于 OpenAPI 中严格维护 tags 的项目，便于跨路径聚合业务域
    // - "path": 适用于未规范 tags 或希望按 URL 资源层次组织代码的项目
    groupBy: "tag",
    typePreference: { unionPrefer: "string" },
    contentTypeFallback: "application/json",
    withComments: false,
  });

  console.log(`[OK] 已生成：${outputPath}`);
  // 如需在控制台预览，可取消注释下一行
  console.dir(result, { depth: null });
}

main().catch((err) => {
  console.error("[ERROR] 生成失败：", err);
  process.exit(1);
});