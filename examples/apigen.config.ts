import type { GeneratorConfig } from "../src/api-generator";

export const apigen: GeneratorConfig[] = [
  {
    "sourcePath": "standard/blog.all.openapi.result.generated.tag.json",
    "outDir": "outputs",
    "exportStyle": "function",
    "outputExt": "ts",
    "baseUrlPrefix": "",
    "filenameCase": "camel",
    "includeJSDoc": true,
    "groupInclude": [],
    "requestImport": {
      "enabled": true,
      "importLine": "import request from '@/utils/request'; \n import request2 from '@/utils/request2'; ",
      "identifier": "request"
    }
  }
]