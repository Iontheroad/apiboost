"根据解析生成的JSON数据（例如：blog.all.openapi.result.generated.tag.json）生成下面两种独立的接口代码实现方案，通过配置项选择具体生成哪种方案。要求：
1. 两种生成函数方法完全解耦，各自独立实现
    * 方案一：对象聚合导出 object
        * - 每个分组（StandardGroup）生成一个文件，统一导出一个对象（如 reqArticle）
        * - 每个服务以对象方法的形式提供，方法名为 controllerName（如 reqGetArticle）
        * - 方法具备完整的函数签名、中文参数说明与返回类型标注
    * 方案二：逐函数导出 function
        * - 每个分组（StandardGroup）生成一个文件，按服务逐个导出函数（如 export function reqGetArticle(...)）
        * - 每个函数具备完整的函数签名、中文参数说明与返回类型标注
        * - 与对象方案完全解耦，不共享内部逻辑
2. 提供清晰的配置参数来控制生成方案的选择
3. 每种方案需包含完整的函数实现，不共享内部逻辑
4. 输出格式需包含函数签名、参数说明和返回类型标注"
5. 注意生成函数的 注释解析要清晰（中文）
6. 功能逻辑代码放在 ./generate 目录下
7. 要求可配置 源文件、输出目录、输出的文件是否采用 






第一种：统一返回一个对象
``` javascript
// article.js
export const reqArticle = {
  reqGetArticle(params: {
    /** 当前页 */
    currentPage: number;
    /** 每页数量 */
    pageSize: number;
    /** 文章状态(1:审核中 2:通过 3:未通过) */
    status: 1 | 2 | 3;
    /** 文章标签(单个: 1 ; 多个: 1,2,3) */
    tag_ids: string;
    /** 模糊搜索文章标题 */
    searchKey?: string;
    /** 文章分类 */
    cate_id?: number;
  }): Promise<{
    code: number;
    msg: string;
    total: number;
    currentPage: string;
    pageSize: string;
    data: {
      article_id: number;
      article_title: string;
      article_digest: string;
      article_content: string;
      article_cover: string;
      status: number;
      noPass_reason?: string;
      create_by: string;
      create_id: number;
      create_time: string;
      update_by: string;
      update_id: number;
      update_time: string;
      comment_status: number;
      article_type: number;
      article_views: string;
      article_cateList: { cate_id: number; cate_name: string }[];
      // category_id: string; // 分类id 1,2,3
      like_count?: number;
      user_liked?: number;
    }[];
  }> {
    return request({
      url: "/article/list",
      method: "get",
      params
    });
  },
  reqPostArticle(data: {
    /** 文章标题 */
    article_title: string;
    /** 文章摘要 */
    article_digest: string;
    /** 文章内容 */
    article_content: string;
    /** 文章封面 */
    article_cover: string;
    /** 文章类型(1:原创 2:转载) */
    article_type: number;
    /** 评论状态(1开启 2关闭) */
    comment_status: number;
    /** 文章标签 [1,2] */
    tag_ids: number[];
    /** 文章分类 */
    cate_id: number;

  }): Promise<{
    code: number;
    msg: string;
  }> {
    return request({
      url: `/api/article`,
      method: "post",
      data
    });
  },

  ...
};

// user.js
export reqUser = {
    ...
}



``` 



第二种： 单独抛出每一个接口的请求

``` javascript

// article.js
export function reqGetArticle(params: {
  /** 当前页 */
  currentPage: number;
  /** 每页数量 */
  pageSize: number;
  /** 文章状态(1:审核中 2:通过 3:未通过) */
  status: 1 | 2 | 3;
  /** 文章标签(单个: 1 ; 多个: 1,2,3) */
  tag_ids: string;
  /** 模糊搜索文章标题 */
  searchKey?: string;
  /** 文章分类 */
  cate_id?: number;
}): Promise<{
  code: number;
  msg: string;
  total: number;
  currentPage: string;
  pageSize: string;
  data: {
    article_id: number;
    article_title: string;
    article_digest: string;
    article_content: string;
    article_cover: string;
    status: number;
    noPass_reason?: string;
    create_by: string;
    create_id: number;
    create_time: string;
    update_by: string;
    update_id: number;
    update_time: string;
    comment_status: number;
    article_type: number;
    article_views: string;
    article_cateList: { cate_id: number; cate_name: string }[];
    // category_id: string; // 分类id 1,2,3
    like_count?: number;
    user_liked?: number;
  }[];
}> {
  return request({
    url: "/article/list",
    method: "get",
    params
  })
}

export function reqPostArticle(data: {
  /** 文章标题 */
  article_title: string;
  /** 文章摘要 */
  article_digest: string;
  /** 文章内容 */
  article_content: string;
  /** 文章封面 */
  article_cover: string;
  /** 文章类型(1:原创 2:转载) */
  article_type: number;
  /** 评论状态(1开启 2关闭) */
  comment_status: number;
  /** 文章标签 [1,2] */
  tag_ids: number[];
  /** 文章分类 */
  cate_id: number;

}): Promise<{
  code: number;
  msg: string;
}> {
  return request({
    url: `/article`,
    method: "post",
    data
  })
}

...

// user.js
...


```
