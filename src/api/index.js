import request from '@/utils/request'
export function getWikiData (params) {
  return request({
    url: '/wiki/getDistance',
    method: 'post',
    data: params
  })
}

export function getMasData (params) {
  return request({
    url: '/wiki/getMasDistance',
    method: 'post',
    data: params
  })
}
