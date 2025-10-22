import request from '@/utils/request';


/**
* 获取动态路由（需要认证）
 * @group menu
 * @route /menu/getRouters [GET]
 */
export function reqGetMenuGetRouters(): Promise<{
  code: number;
  msg: string;
  total: number;
  currentPage: string;
  pageSize: string;
  data: {
    parent_id: number;
    menu_id: number;
    name: string;
    path: string;
    component: string;
    meta: object;
    children: number[];
  }[];
}> {
  return request({
    url: "/menu/getRouters",
    method: "get",
  });
}

/**
* 查询菜单管理列表（需要认证）
 * @group menu
 * @route /menu/list [GET]
 */
export function reqGetMenuList(): Promise<{
  code: number;
  msg: string;
  total: number;
  currentPage: string;
  pageSize: string;
  data: {
    menu_id: number;
    menu_name: string;
    parent_id: number;
    perms: string;
    route_name: string;
    path: string;
    component: string;
    target: string;
    menu_type: string;
    active_menu: string;
    icon: string;
    order_num: number;
    is_link: number;
    is_keep_alive: number;
    is_hidden: number;
    is_disabled: number;
    is_refresh: number;
    is_affix: number;
    is_full: number;
    is_always_show: number;
    create_by: string;
    create_time: string;
    update_by: string;
    update_time: string;
    remark: string;
    children?: number[];
  }[];
}> {
  return request({
    url: "/menu/list",
    method: "get",
  });
}

/**
* 添加或编辑菜单（需要认证）
 * @group menu
 * @route /menu [POST]
 * @param {number} data.menu_id 菜单ID
 * @param {string} data.menu_name 菜单名称title
 * @param {number} data.parent_id 父菜单ID
 * @param {string} data.route_name 路由别名
 * @param {string} data.path 路由地址
 * @param {string} data.component 组件路径
 * @param {string} data.target 打开方式（self页签 blank新窗口）
 * @param {string} data.menu_type 菜单类型（M目录 C菜单 F按钮）
 * @param {string} data.active_menu 需要高亮的菜单
 * @param {string} data.icon 菜单图标
 * @param {number} data.order_num 显示顺序
 * @param {string} data.is_link 是否外链
 * @param {string} data.is_keep_alive 是否缓存keep-alive
 * @param {string} data.is_hidden 菜单状态（0显示 1隐藏）
 * @param {string} data.is_refresh 是否刷新（0刷新 1不刷新）
 * @param {string} data.is_affix 是否固定在tabs
 * @param {string} data.is_full 是否全屏
 * @param {string} data.is_always_show 是否一直显示该路由
 * @param {string} data.perms 权限标识
 * @param {string} data.remark 备注
 */
export function reqPostMenu(data: {
  /** 菜单ID */
  menu_id: number;
  /** 菜单名称title */
  menu_name: string;
  /** 父菜单ID */
  parent_id: number;
  /** 路由别名 */
  route_name?: string;
  /** 路由地址 */
  path?: string;
  /** 组件路径 */
  component?: string;
  /** 打开方式（self页签 blank新窗口） */
  target?: string;
  /** 菜单类型（M目录 C菜单 F按钮） */
  menu_type: string;
  /** 需要高亮的菜单 */
  active_menu?: string;
  /** 菜单图标 */
  icon?: string;
  /** 显示顺序 */
  order_num?: number;
  /** 是否外链 */
  is_link?: string;
  /** 是否缓存keep-alive */
  is_keep_alive?: string;
  /** 菜单状态（0显示 1隐藏） */
  is_hidden?: string;
  /** 是否刷新（0刷新 1不刷新） */
  is_refresh?: string;
  /** 是否固定在tabs */
  is_affix?: string;
  /** 是否全屏 */
  is_full?: string;
  /** 是否一直显示该路由 */
  is_always_show?: string;
  /** 权限标识 */
  perms?: string;
  /** 备注 */
  remark?: string;
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/menu",
    method: "post",
    data,
  });
}

/**
* 删除菜单 （需要认证）
 * @group menu
 * @route /menu [DELETE]
 * @param {number[]} data.ids 
 */
export function reqDeleteMenu(data: {
  /**  */
  ids: number[];
}): Promise<{
  code: number;
  msg: string;
  data?: any;
}> {
  return request({
    url: "/menu",
    method: "delete",
    data,
  });
}
