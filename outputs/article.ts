import request from '@/utils/request';


/**
* 获取全部文章列表（需要认证）
 * @group article
 * @route /article/list [GET]
 * @param {number} params.currentPage 当前页
 * @param {number} params.pageSize 每页数量
 * @param {1 | 2 | 3} params.status 文章状态(1:审核中 2:通过 3:未通过)
 * @param {string} params.tag_ids 文章标签(单个: 1 ; 多个: 1,2,3)
 * @param {string} params.searchKey 模糊搜索文章标题
 * @param {number} params.cate_id 文章分类
 */
export function reqGetArticleList(params: {
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
    article_id?: number;
    article_title?: string;
    article_digest?: string;
    article_content?: string;
    article_cover?: string;
    status?: number;
    noPass_reason?: string;
    create_by?: string;
    create_id?: number;
    create_time?: string;
    update_by?: string;
    update_id?: number;
    update_time?: string;
    comment_status?: number;
    article_type?: number;
    article_views?: string;
    article_cateList?: { cate_id: number; cate_name: string }[];
    like_count?: number;
    user_liked?: number;
  }[];
}> {
  return request({
    url: "/article/list",
    method: "get",
    params,
  });
}

/**
* 获取个人文章列表 （需要认证）
 * @group article
 * @route /article/list/self [GET]
 * @param {number} params.currentPage 当前页
 * @param {number} params.pageSize 每页数量
 * @param {1 | 2 | 3} params.status 文章状态(1:审核中 2:通过 3:未通过)
 * @param {string} params.tag_ids 文章标签(单个: 1 ; 多个: 1,2,3)
 * @param {string} params.searchKey 模糊搜索文章标题
 * @param {number} params.cate_id 文章分类
 */
export function reqGetArticleListSelf(params: {
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
    article_id?: number;
    article_title?: string;
    article_digest?: string;
    article_content?: string;
    article_cover?: string;
    status?: number;
    noPass_reason?: string;
    create_by?: string;
    create_id?: number;
    create_time?: string;
    update_by?: string;
    update_id?: number;
    update_time?: string;
    comment_status?: number;
    article_type?: number;
    article_views?: string;
    article_cateList?: { cate_id: number; cate_name: string }[];
    like_count?: number;
    user_liked?: number;
  }[];
}> {
  return request({
    url: "/article/list/self",
    method: "get",
    params,
  });
}

/**
* 获取某个文章（需要认证）
 * @group article
 * @route /article [GET]
 * @param {string} pathParams.article_id 文章id
 */
export function reqGetArticle(pathParams: {
  /** 文章id */
  article_id: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: `/article/${pathParams.article_id}`,
    method: "get",
  });
}

/**
* 新增文章（需要认证）
 * @group article
 * @route /article [POST]
 * @param {string} data.article_title 文章标题
 * @param {string} data.article_digest 文章摘要
 * @param {string} data.article_content 文章内容
 * @param {string} data.article_cover 文章封面
 * @param {1 | 2} data.article_type 文章类型(1:原创 2:转载)
 * @param {number} data.comment_status 评论状态(1开启 2关闭)
 * @param {number[]} data.tag_ids 文章标签 [1,2]
 * @param {number} data.cate_id 文章分类
 */
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
  article_type: 1 | 2;
  /** 评论状态(1开启 2关闭) */
  comment_status: number;
  /** 文章标签 [1,2] */
  tag_ids: number[];
  /** 文章分类 */
  cate_id: number;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/article",
    method: "post",
    data,
  });
}

/**
* 修改文章（需要认证）
 * @group article
 * @route /article [PUT]
 * @param {number} data.article_id 文章id
 * @param {string} data.article_title 文章标题
 * @param {string} data.article_digest 文章摘要
 * @param {string} data.article_content 文章内容
 * @param {string} data.article_cover 文章封面
 * @param {1 | 2} data.article_type 文章类型(1:原创 2:转载)
 * @param {number} data.comment_status 评论状态(1开启 2关闭)
 * @param {number[]} data.tag_ids 文章标签
 * @param {number} data.cate_id 分类id
 * @param {number} data.status 文章状态
 */
export function reqPutArticle(data: {
  /** 文章id */
  article_id: number;
  /** 文章标题 */
  article_title: string;
  /** 文章摘要 */
  article_digest: string;
  /** 文章内容 */
  article_content: string;
  /** 文章封面 */
  article_cover: string;
  /** 文章类型(1:原创 2:转载) */
  article_type: 1 | 2;
  /** 评论状态(1开启 2关闭) */
  comment_status: number;
  /** 文章标签 */
  tag_ids: number[];
  /** 分类id */
  cate_id: number;
  /** 文章状态 */
  status: number;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/article",
    method: "put",
    data,
  });
}

/**
* 删除文章（需要认证）
 * @group article
 * @route /article [DELETE]
 * @param {number[]} data.ids 文章id集合
 */
export function reqDeleteArticle(data: {
  /** 文章id集合 */
  ids: number[];
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/article",
    method: "delete",
    data,
  });
}

/**
* 文章审核（需要认证）
 * @group article
 * @route /article/review [PATCH]
 * @param {number} data.article_id 文章id
 * @param {1 | 2 | 3} data.status 文章状态(1:审核中 2:通过 3:未通过)
 * @param {string} data.noPass_reason 未通过原因
 */
export function reqPatchArticleReview(data: {
  /** 文章id */
  article_id: number;
  /** 文章状态(1:审核中 2:通过 3:未通过) */
  status: 1 | 2 | 3;
  /** 未通过原因 */
  noPass_reason?: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/article/review",
    method: "patch",
    data,
  });
}

/**
* 文章 点赞和取消（需要认证）
 * @group article
 * @route /article/like [PATCH]
 * @param {number} pathParams.article_id 文章id
 */
export function reqPatchArticleLike(pathParams: {
  /** 文章id */
  article_id: number;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: `/article/like/${pathParams.article_id}`,
    method: "patch",
  });
}

/**
* 获取文章评论（需要认证）
 * @group article
 * @route /article/comment [GET]
 * @param {string} pathParams.article_id 
 */
export function reqGetArticleComment(pathParams: {
  /**  */
  article_id: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: `/article/comment/${pathParams.article_id}`,
    method: "get",
  });
}

/**
* 获取文章评论分页（需要认证）
 * @group article
 * @route /article/comment/page [GET]
 * @param {string} params.currentPage 当前页数
 * @param {string} params.pageSize 每页数量
 * @param {string} params.article_id 
 */
export function reqGetArticleCommentPage(params: {
  /** 当前页数 */
  currentPage: string;
  /** 每页数量 */
  pageSize: string;
  /**  */
  article_id: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/article/comment/page",
    method: "get",
    params,
  });
}

/**
* 新增文章评论（需要认证）
 * @group article
 * @route /article/comment [POST]
 * @param {number} data.article_id 文章id
 * @param {string} data.content 评论内容
 * @param {number} data.parent_id 一级评论值为0, 二级评论值对所属一级评论的id
 * @param {number} data.reply_id 被回复评论id
 * @param {number} data.reply_user_id 被回复评论的用户id
 */
export function reqPostArticleComment(data: {
  /** 文章id */
  article_id: number;
  /** 评论内容 */
  content: string;
  /** 一级评论值为0, 二级评论值对所属一级评论的id */
  parent_id: number;
  /** 被回复评论id */
  reply_id: number;
  /** 被回复评论的用户id */
  reply_user_id: number;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/article/comment",
    method: "post",
    data,
  });
}

/**
* 删除文章评论（需要认证）
 * @group article
 * @route /article/comment [DELETE]
 * @param {string} pathParams.id 评论id
 */
export function reqDeleteArticleComment(pathParams: {
  /** 评论id */
  id: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: `/article/comment/${pathParams.id}`,
    method: "delete",
  });
}

/**
* 文章评论 点赞或取消（需要认证）
 * @group article
 * @route /article/comment/like [PATCH]
 * @param {number} data.article_id 
 * @param {number} data.comment_id 
 */
export function reqPatchArticleCommentLike(data: {
  /**  */
  article_id: number;
  /**  */
  comment_id: number;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/article/comment/like",
    method: "patch",
    data,
  });
}

/**
* 获取标签
 * @group article
 * @route /tags [GET]
 */
export function reqGetTags(): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/tags",
    method: "get",
  });
}

/**
* 新增标签（需要认证）
 * @group article
 * @route /tags [POST]
 * @param {string} data.tag_name 标签名
 */
export function reqPostTags(data: {
  /** 标签名 */
  tag_name: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/tags",
    method: "post",
    data,
  });
}

/**
* 修改标签（需要认证）
 * @group article
 * @route /tags [PUT]
 * @param {number} data.tag_id 标签id
 * @param {string} data.tag_name 标签名
 */
export function reqPutTags(data: {
  /** 标签id */
  tag_id: number;
  /** 标签名 */
  tag_name: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/tags",
    method: "put",
    data,
  });
}

/**
* 删除标签（需要认证）
 * @group article
 * @route /tags [DELETE]
 * @param {number[]} data.ids 分类id集合
 */
export function reqDeleteTags(data: {
  /** 分类id集合 */
  ids: number[];
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/tags",
    method: "delete",
    data,
  });
}

/**
* 获取分类（需要认证）
 * @group article
 * @route /category [GET]
 */
export function reqGetCategory(): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/category",
    method: "get",
  });
}

/**
* 新增分类（需要认证）
 * @group article
 * @route /category [POST]
 * @param {string} data.cate_name 分类名(长度最大为6)
 */
export function reqPostCategory(data: {
  /** 分类名(长度最大为6) */
  cate_name: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/category",
    method: "post",
    data,
  });
}

/**
* 修改分类（需要认证）
 * @group article
 * @route /category [PUT]
 * @param {number} data.cate_id 分类id
 * @param {string} data.cate_name 分类名
 */
export function reqPutCategory(data: {
  /** 分类id */
  cate_id: number;
  /** 分类名 */
  cate_name: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/category",
    method: "put",
    data,
  });
}

/**
* 删除分类（需要认证）
 * @group article
 * @route /category [DELETE]
 * @param {number[]} data.ids 分类id集合
 */
export function reqDeleteCategory(data: {
  /** 分类id集合 */
  ids: number[];
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/category",
    method: "delete",
    data,
  });
}

/**
* 检查用户名是否使用（需要认证）
 * @group article
 * @route /user/checkUsername [GET]
 * @param {string} params.username 用户名(账号)
 */
export function reqGetUserCheckUsername(params: {
  /** 用户名(账号) */
  username: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user/checkUsername",
    method: "get",
    params,
  });
}

/**
* 用户注册（需要认证）
 * @group article
 * @route /user/register [POST]
 * @param {string} data.nickname 用户昵称
 * @param {string} data.username 用户名(账号)
 * @param {string} data.password 密码
 * @param {string} data.verify_password 二次确认密码
 */
export function reqPostUserRegister(data: {
  /** 用户昵称 */
  nickname: string;
  /** 用户名(账号) */
  username: string;
  /** 密码 */
  password: string;
  /** 二次确认密码 */
  verify_password: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user/register",
    method: "post",
    data,
  });
}

/**
* 用户登录
 * @group article
 * @route /user/login [POST]
 * @param {string} data.username 用户名(账号)
 * @param {string} data.password 密码
 */
export function reqPostUserLogin(data: {
  /** 用户名(账号) */
  username: string;
  /** 密码 */
  password: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

/**
* 刷新token（需要认证）
 * @group article
 * @route /token/refresh/token [POST]
 * @param {string} data.refresh_token 刷新token
 */
export function reqPostTokenRefreshToken(data: {
  /** 刷新token */
  refresh_token: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/token/refresh/token",
    method: "post",
    data,
  });
}

/**
* 用户登出（需要认证）
 * @group article
 * @route /user/logout [POST]
 */
export function reqPostUserLogout(): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user/logout",
    method: "post",
  });
}

/**
* 获取用户信息（需要认证）
 * @group article
 * @route /user [GET]
 * @param {number} params.user_id 用户id(如果不传就获取当前登录的用户信息)
 */
export function reqGetUser(params: {
  /** 用户id(如果不传就获取当前登录的用户信息) */
  user_id?: number;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user",
    method: "get",
    params,
  });
}

/**
* 后台创建用户（需要认证）
 * @group article
 * @route /user [POST]
 * @param {string} data.nickname 用户昵称
 * @param {string} data.username 用户名(账号)
 */
export function reqPostUser(data: {
  /** 用户昵称 */
  nickname: string;
  /** 用户名(账号) */
  username: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user",
    method: "post",
    data,
  });
}

/**
* 修改用户信息（需要认证）
 * @group article
 * @route /user [PUT]
 * @param {number} data.id 用户id
 * @param {string} data.nickname 用户昵称
 * @param {string} data.avatar 用户头像
 * @param {string} data.sex 性别(u:未知 m:男 w:女)
 * @param {string} data.age 年龄
 * @param {string} data.address 地址
 * @param {string} data.phone 手机号
 * @param {string} data.email 邮箱
 */
export function reqPutUser(data: {
  /** 用户id */
  id: number;
  /** 用户昵称 */
  nickname: string;
  /** 用户头像 */
  avatar: string;
  /** 性别(u:未知 m:男 w:女) */
  sex: string;
  /** 年龄 */
  age: string;
  /** 地址 */
  address: string;
  /** 手机号 */
  phone: string;
  /** 邮箱 */
  email: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user",
    method: "put",
    data,
  });
}

/**
* 删除用户（需要认证）
 * @group article
 * @route /user [DELETE]
 * @param {number[]} data.ids 用户id集合
 */
export function reqDeleteUser(data: {
  /** 用户id集合 */
  ids: number[];
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user",
    method: "delete",
    data,
  });
}

/**
* 获取用户列表（需要认证）
 * @group article
 * @route /user/list [GET]
 */
export function reqGetUserList(): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user/list",
    method: "get",
  });
}

/**
* 修改用户密码（需要认证）
 * @group article
 * @route /user/password [PATCH]
 * @param {string} data.username 用户名(账号)
 * @param {string} data.oldPassword 旧密码
 * @param {string} data.newPassword 新密码
 */
export function reqPatchUserPassword(data: {
  /** 用户名(账号) */
  username: string;
  /** 旧密码 */
  oldPassword: string;
  /** 新密码 */
  newPassword: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/user/password",
    method: "patch",
    data,
  });
}

/**
* (mo)单个上传 （需要认证）
 * @group article
 * @route /mo_upload/upload [POST]
 * @param {string} data.file 
 * @param {string} data.type 
 */
export function reqPostMoUploadUpload(data: {
  /**  */
  file: string;
  /**  */
  type?: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/mo_upload/upload",
    method: "post",
    data,
  });
}

/**
* (mo)删除文件（需要认证）
 * @group article
 * @route /mo_upload/files [DELETE]
 * @param {string[]} data.ids 文章id集合
 */
export function reqDeleteMoUploadFiles(data: {
  /** 文章id集合 */
  ids: string[];
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/mo_upload/files",
    method: "delete",
    data,
  });
}

/**
* (mo)查询文件（需要认证）
 * @group article
 * @route /mo_upload/files [GET]
 * @param {string} params.currentPage 当前页数
 * @param {string} params.pageSize 每页数量
 * @param {string} params.fileName 
 */
export function reqGetMoUploadFiles(params: {
  /** 当前页数 */
  currentPage: string;
  /** 每页数量 */
  pageSize: string;
  /**  */
  fileName: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/mo_upload/files",
    method: "get",
    params,
  });
}

/**
* (mo)下载文件（需要认证）
 * @group article
 * @route /mo_upload/files/download [GET]
 * @param {string} pathParams.id 
 */
export function reqGetMoUploadFilesDownload(pathParams: {
  /**  */
  id: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: `/mo_upload/files/download/${pathParams.id}`,
    method: "get",
  });
}

/**
* 单个上传（需要认证）
 * @group article
 * @route /upload/file [POST]
 * @param {string} data.file 
 * @param {string} data.type 
 */
export function reqPostUploadFile(data: {
  /**  */
  file: string;
  /**  */
  type?: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/upload/file",
    method: "post",
    data,
  });
}

/**
* 批量上传（需要认证）
 * @group article
 * @route /upload/files [POST]
 * @param {string} data.file 
 * @param {string} data.dir 
 */
export function reqPostUploadFiles(data: {
  /**  */
  file?: string;
  /**  */
  dir?: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/upload/files",
    method: "post",
    data,
  });
}

/**
* 验证是否已经上传（需要认证）
 * @group article
 * @route /upload/verify [POST]
 * @param {string} data.file_name 
 */
export function reqPostUploadVerify(data: {
  /**  */
  file_name: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/upload/verify",
    method: "post",
    data,
  });
}
