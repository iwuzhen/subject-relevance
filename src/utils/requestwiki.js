/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-08 16:39:08
 * @LastEditors: ider
 * @LastEditTime: 2020-04-08 17:05:58
 * @Description:
 */
import axios from "axios";

// 创建axios实例
const service = axios.create({
  timeout: 150000000 // 请求超时时间
});

service.defaults.baseURL = "/wapi";

export default service;
