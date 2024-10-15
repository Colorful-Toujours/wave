import { type RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { useWsStore } from './ws';
import { store } from '@/store';
import { login, yblogin } from '@/api/login';
import { ACCESS_TOKEN_KEY, USER_NAME, REAL_NAME, USER_ID } from '@/enums/cacheEnum';
import { Storage } from '@/utils/Storage';
import { logout, getInfo, permmenu } from '@/api/account';
import { getPermissionByToken, getPermission } from '@/api/user/permission';
import { generatorDynamicRouter } from '@/router/generator-router';
import { resetRouter } from '@/router';
// import { getPermission } from '@/api/user';

interface UserState {
  token: string;
  name: string;
  realname: string;
  id: string;
  avatar: string;
  // like [ 'sys:user:add', 'sys:user:update' ]
  perms: string[];
  menus: RouteRecordRaw[];
  userInfo: Partial<API.AdminUserInfo>;
  newMenus: RouteRecordRaw[];
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    token: Storage.get(ACCESS_TOKEN_KEY, null),
    name: Storage.get(USER_NAME, null),
    realname: Storage.get(REAL_NAME, null),
    id: Storage.get(USER_ID, null),
    avatar: '',
    perms: [],
    menus: [],
    userInfo: {},
    newMenus: [],
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getName(): string {
      return this.name;
    },
    getPerms(): string[] {
      return this.perms;
    },
  },
  actions: {
    /** 清空token及用户信息 */
    resetToken() {
      this.avatar = this.token = this.name = '';
      this.perms = [];
      this.menus = [];
      this.newMenus = [];
      this.userInfo = {};
      Storage.clear();
    },
    /** 登录成功保存token */
    setToken(token: string) {
      this.token = token ?? '';
      const ex = 7 * 24 * 60 * 60 * 1000;
      Storage.set(ACCESS_TOKEN_KEY, this.token, ex);
    },
    /** 登录 */
    async login(params: API.LoginParams) {
      try {
        const { token, username, realname, id } = await yblogin(params);
        this.setToken(token);
        console.log('login 接口返回', username);
        this.name = username;
        this.realname = realname;
        this.id = id;
        Storage.set(USER_NAME, this.name);
        Storage.set(REAL_NAME, this.realname);
        Storage.set(USER_ID, this.id);
        return this.afterLogin();
      } catch (error) {
        return Promise.reject(error);
      }
    },
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    async afterLogin() {
      try {
        const wsStore = useWsStore();
        const ret = await getPermission();
        const { data: menus } = await getPermissionByToken();
        // const routerVal=await getPermissionByToken();
        // let filterMenus= menus.filter(function(item) {
        //     return item.name != "同端口语音"
        //   });
        // function filterAndExpandItems(originalArray, ids) {
        //   // 创建一个Set来快速查找ID
        //   const idSet = new Set(ids.map((idObj) => idObj.id || idObj)); // 如果ids是对象数组，则取id属性；否则直接使用id值

        //   // 创建一个结果数组
        //   const result = [];

        //   // 遍历原始数组
        //   for (const item of originalArray) {
        //     // 如果当前项的ID在ID集合中，则直接添加到结果数组
        //     if (idSet.has(item.id)) {
        //       result.push({
        //         createtime: item.createtime,
        //         delflag: item.delflag,
        //         id: item.id,
        //         parentPermissionId: item.parentPermissionId,
        //         permissionCode: item.permissionCode,
        //         permissionLevel: item.permissionLevel,
        //         permissionName: item.permissionName,
        //         permissionType: item.permissionType,
        //         permissionUrl: item.permissionUrl,
        //         remark: item.remark,
        //         systemId: item.systemId,
        //         thirdpartyPermissionId: item.thirdpartyPermissionId,
        //         updatetime: item.updatetime,
        //       });
        //     }

        //     // 检查子项
        //     if (item.permissionDtoList && item.permissionDtoList.length > 0) {
        //       for (const child of item.permissionDtoList) {
        //         // 如果子项的ID在ID集合中，但父项的ID不在（即我们只通过子项找到了父项）
        //         if (idSet.has(child.id) && !idSet.has(item.id)) {
        //           // 添加父项到结果数组（注意：这里假设每个子项只有一个父项）
        //           result.push({
        //             createtime: item.createtime,
        //             delflag: item.delflag,
        //             id: item.id,
        //             parentPermissionId: item.parentPermissionId,
        //             permissionCode: item.permissionCode,
        //             permissionLevel: item.permissionLevel,
        //             permissionName: item.permissionName,
        //             permissionType: item.permissionType,
        //             permissionUrl: item.permissionUrl,
        //             remark: item.remark,
        //             systemId: item.systemId,
        //             thirdpartyPermissionId: item.thirdpartyPermissionId,
        //             updatetime: item.updatetime,
        //           });
        //         }
        //         // 如果子项的ID在ID集合中，并且我们可能已经添加了父项（或不需要再次检查），
        //         // 则我们不需要在这里再次添加子项，因为它可能已经在之前的迭代中被添加了。
        //         // 但在这个特定的逻辑中，我们其实还是会添加子项，因为我们的ID集合可能直接包含了子项。
        //         // 如果只想要唯一的项，可以在结果数组中添加一个去重机制。
        //         if (idSet.has(child.id)) {
        //           result.push({
        //             createtime: child.createtime,
        //             delflag: child.delflag,
        //             id: child.id,
        //             parentPermissionId: child.parentPermissionId,
        //             permissionCode: child.permissionCode,
        //             permissionLevel: child.permissionLevel,
        //             permissionName: child.permissionName,
        //             permissionType: child.permissionType,
        //             permissionUrl: child.permissionUrl,
        //             remark: child.remark,
        //             systemId: child.systemId,
        //             thirdpartyPermissionId: child.thirdpartyPermissionId,
        //             updatetime: child.updatetime,
        //           });
        //         }
        //       }
        //     }
        //   }

        //   // 注意：这个实现没有去除重复的项，如果ID集合中直接包含了子项和父项，它们都会被添加。
        //   // 如果需要去除重复项，可以在返回结果之前对result进行去重处理。

        //   return result;
        // }

        // console.log(
        //   '返回所有的权限111111',
        //   filterAndExpandItems(ret.data[0].permissionDtoList, menus),
        // );
        // let asdfg = [];
        // // asdfg = filterAndExpandItems(ret.data[0].permissionDtoList, menus);
        // console.log('返回所有的权限1111', asdfg);

        // const [userInfo, { data: menus }] = await Promise.all([getInfo(), getPermissionByToken()]);
        // const [userInfo, { perms, menus }] = await Promise.all([getInfo(), permmenu()]);
        // this.perms = perms;
        // this.name = userInfo.name;
        // this.avatar = userInfo.headImg;
        // this.userInfo = userInfo;
        // 生成路由
        const generatorResult = generatorDynamicRouter(menus);
        // const generatorResult = generatorDynamicRouter(filterMenus);
        this.menus = generatorResult.menus.filter((item) => !item.meta?.hideInMenu);
        this.newMenus = generatorResult.menus.filter((item) => !item.meta?.hideInMenu);
        !wsStore.client && wsStore.initSocket();
        return { menus };
      } catch (error) {
        // return this.logout();
      }
    },
    /** 登出 */
    async logout() {
      await logout();
      const wsStore = useWsStore();
      wsStore.closeSocket();
      this.resetToken();
      resetRouter();
    },
    /* 重新设置侧边栏展示 */
    setMeun(data: Array<T>) {
      this.menus = data;
    },
  },
});

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
