/*
 * @Version: 0.0.1
 * @Author: ider
 * @Date: 2020-04-08 16:39:08
 * @LastEditors: ider
 * @LastEditTime: 2020-12-03 15:59:32
 * @Description:
 */
import axios from 'axios'

// 创建axios实例
const service = axios.create({
  timeout: 150000000 // 请求超时时间
})

service.defaults.baseURL = '/goapi'

// respone拦截器，将
service.interceptors.response.use(
  response => {
    /**
     * msg为非success是抛错 可结合自己业务进行修改
     */
    response.data = JSON.parse(JSON.stringify(response.data).replace(/Engineering disciplines/g, 'Engineering'))
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
