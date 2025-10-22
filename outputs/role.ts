import request from '@/utils/request';


/**
* 获取角色列表（需要认证）
 * @group role
 * @route /role [GET]
 * @param {string} params.role_name 角色名
 * @param {string} params.sort 排序( asc | desc ) 默认asc
 */
export function reqGetRole(params: {
  /** 角色名 */
  role_name?: string;
  /** 排序( asc | desc ) 默认asc */
  sort?: string;
}): Promise<{
  code: number;
  msg: string;
  total: number;
  currentPage: string;
  pageSize: string;
  data: {
    role_id: number;
    role_name: string;
    role_key: string;
    role_sort: number;
    status: number;
    create_by: string;
    create_time: string;
    update_by: string;
    update_time: string;
    remark: string;
  }[];
}> {
  return request({
    url: "/role",
    method: "get",
    params,
  });
}

/**
* 创建角色（需要认证）
 * @group role
 * @route /role [POST]
 * @param {string} data.role_name 角色名称
 * @param {string} data.role_key 角色权限字符
 * @param {number} data.role_sort 排序
 * @param {string} data.remark 备注
 */
export function reqPostRole(data: {
  /** 角色名称 */
  role_name: string;
  /** 角色权限字符 */
  role_key: string;
  /** 排序 */
  role_sort: number;
  /** 备注 */
  remark: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/role",
    method: "post",
    data,
  });
}

/**
* 修改角色（需要认证）
 * @group role
 * @route /role [PUT]
 * @param {number} data.role_id 角色id
 * @param {string} data.role_name 角色名称
 * @param {string} data.role_key 角色权限字符
 * @param {number} data.role_sort 排序
 * @param {string} data.remark 备注
 */
export function reqPutRole(data: {
  /** 角色id */
  role_id: number;
  /** 角色名称 */
  role_name: string;
  /** 角色权限字符 */
  role_key: string;
  /** 排序 */
  role_sort: number;
  /** 备注 */
  remark: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/role",
    method: "put",
    data,
  });
}

/**
* 删除角色（需要认证）
 * @group role
 * @route /role [DELETE]
 * @param {number[]} data.ids 要删除的id集合
 */
export function reqDeleteRole(data: {
  /** 要删除的id集合 */
  ids: number[];
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/role",
    method: "delete",
    data,
  });
}

/**
* 获取角色已选菜单（需要认证）
 * @group role
 * @route /role/selectedMenu [GET]
 * @param {number} pathParams.role_id 
 */
export function reqGetRoleSelectedMenu(pathParams: {
  /**  */
  role_id: number;
}): Promise<{
  code: number;
  msg: string;
  total: number;
  currentPage: string;
  pageSize: string;
  data: {
    undefined?: number;
  }[];
}> {
  return request({
    url: `/role/selectedMenu/${pathParams.role_id}`,
    method: "get",
  });
}

/**
* 修改角色状态（需要认证）
 * @group role
 * @route /role/status [PATCH]
 * @param {number} data.role_id 角色id
 * @param {number} data.status 1正常 0停用, 默认1
 */
export function reqPatchRoleStatus(data: {
  /** 角色id */
  role_id: number;
  /** 1正常 0停用, 默认1 */
  status: number;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/role/status",
    method: "patch",
    data,
  });
}
