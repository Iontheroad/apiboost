import request from '@/utils/request';


/**
* 获取友链（需要认证）
 * @group blogroll
 * @route /blogroll [GET]
 * @param {number} params.currentPage 当前页
 * @param {number} params.pageSize 每页数量
 */
export function reqGetBlogroll(params: {
  /** 当前页 */
  currentPage: number;
  /** 每页数量 */
  pageSize: number;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/blogroll",
    method: "get",
    params,
  });
}

/**
* 新增友链（需要认证）
 * @group blogroll
 * @route /blogroll [POST]
 * @param {string} data.site_name 网站名称
 * @param {string} data.site_url 网站地址
 * @param {string} data.site_icon 网站图标
 * @param {string} data.email 联系方式
 * @param {string} data.description 网站描述
 */
export function reqPostBlogroll(data: {
  /** 网站名称 */
  site_name: string;
  /** 网站地址 */
  site_url: string;
  /** 网站图标 */
  site_icon: string;
  /** 联系方式 */
  email: string;
  /** 网站描述 */
  description: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/blogroll",
    method: "post",
    data,
  });
}

/**
* 修改友链（需要认证）
 * @group blogroll
 * @route /blogroll [PUT]
 * @param {number} data.id 友链id
 * @param {string} data.site_name 网站名称
 * @param {string} data.site_url 网站地址
 * @param {string} data.site_icon 网站图标
 * @param {string} data.email 联系方式
 * @param {string} data.description 网站描述
 */
export function reqPutBlogroll(data: {
  /** 友链id */
  id: number;
  /** 网站名称 */
  site_name: string;
  /** 网站地址 */
  site_url: string;
  /** 网站图标 */
  site_icon: string;
  /** 联系方式 */
  email: string;
  /** 网站描述 */
  description: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/blogroll",
    method: "put",
    data,
  });
}

/**
* 删除友链（需要认证）
 * @group blogroll
 * @route /blogroll [DELETE]
 * @param {number[]} data.ids 友链id集合
 */
export function reqDeleteBlogroll(data: {
  /** 友链id集合 */
  ids: number[];
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/blogroll",
    method: "delete",
    data,
  });
}
