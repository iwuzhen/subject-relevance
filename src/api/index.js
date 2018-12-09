import request from '@/utils/request'
export function getData (params) {
  return request({
    url: '/wiki/getDistance',
    method: 'post',
    data: params
  })
}
