/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-05-17 22:38:56
 * @LastEditors: ider
 * @LastEditTime: 2020-05-20 15:42:40
 * @Description: 缓存工具包
 */

import * as localforage from "localforage";
localforage.setDriver([localforage.INDEXEDDB, localforage.WEBSQL]);

export class localCache {
  constructor(localforageConfig) {
    this.store = localforage.createInstance(
      Object.assign(
        {
          name: "wikiknogen",
          version: 7,
          storeName: "api", // Should be alphanumeric, with underscores.
          description: "store api"
        },
        localforageConfig
      )
    );
  }

  async getItem(key) {
    let item = await this.store.getItem(key);
    return item;
  }
  async setItem(key, data) {
    await this.store.setItem(key, data);
  }
}
