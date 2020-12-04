import request from '@/utils/request'
import requestwiki from '@/utils/requestwiki'
import requestgo from '@/utils/requestgo'
import * as localforage from 'localforage'
import axios from 'axios'

// 创建axios实例
const service = axios.create({
  timeout: 150000000 // 请求超时时间
})

const qs = require('qs')

localforage.setDriver([localforage.INDEXEDDB, localforage.WEBSQL])

const store1 = localforage.createInstance({
  name: 'wikiknogen',
  version: 7,
  storeName: 'api', // Should be alphanumeric, with underscores.
  description: 'store api'
})

const store2 = localforage.createInstance({
  name: 'wikiknogenTree',
  version: 8,
  storeName: 'api', // Should be alphanumeric, with underscores.
  description: 'store api'
})

const store3 = localforage.createInstance({
  name: 'wikiGo',
  version: 2,
  storeName: 'api', // Should be alphanumeric, with underscores.
  description: 'store api'
})

// 对请求进行缓存
export const cacheRequest = async requestParams => {
  let item = await store1.getItem(JSON.stringify(requestParams))
  if (!item || typeof item !== 'object') {
    console.log('无缓存')
    const response = await request(requestParams)
    if (response.status === 200 && typeof response.data === 'object') {
      await store1.setItem(JSON.stringify(requestParams), response.data)
    }
    item = response.data
  } else {
    // console.log("命中缓存");
  }
  return item
}
// 对请求进行缓存
export const cacheRequestWiki = async requestParams => {
  let item = await store2.getItem(JSON.stringify(requestParams))
  if (!item || typeof item !== 'object') {
    console.log('无缓存')
    const response = await requestwiki(requestParams)
    if (response.status === 200 && typeof response.data === 'object') {
      await store2.setItem(JSON.stringify(requestParams), response.data)
    }
    item = response.data
  } else {
    // console.log("命中缓存");
  }
  return item
}

// 对请求进行缓存
export const cacheRequestGo = async requestParams => {
  let item = await store3.getItem(JSON.stringify(requestParams))
  if (!item || typeof item !== 'object') {
    console.log('无缓存')
    const response = await requestgo(requestParams)
    if (response.status === 200 && typeof response.data === 'object') {
      console.log(response.status)
      await store3.setItem(JSON.stringify(requestParams), response.data)
    }
    item = response.data
  } else {
    // console.log("命中缓存");
  }
  return item
}

//  mag 包裹
export async function requestWrap(url, method, params) {
  const requestParams = {
    url: url,
    method: method,
    data: params
  }
  const res = await request(requestParams)
  return res.data
}
//  gov2 包裹
export async function requestGoV2Wrap(url, method, params) {
  const requestParams = {
    url: url,
    method: method,
    data: params
  }
  const res = await service(requestParams)
  return res.data
}

export async function RequestBoard(params, method) {
  let requestParams
  if (method === 'get') {
    requestParams = {
      url: '/board/noteboard',
      method: 'get',
      params: params
    }
  } else {
    requestParams = {
      url: '/board/noteboard',
      method: method,
      data: params
    }
  }

  const res = await requestgo(requestParams)
  return res.data
  // return await cacheRequestGo(requestParams);
}

export async function getScaleTrend(params) {
  const requestParams = {
    url: '/smallworld/scaleTrend',
    method: 'get',
    params: params
  }
  // let res = await requestgo(requestParams);
  // return res.data;
  return await cacheRequestGo(requestParams)
}

// 非结构化数据服务器简易存储
export async function getStorage(params) {
  const requestParams = {
    url: '/storage/first',
    method: 'get',
    params: params
  }
  const res = await requestgo(requestParams)
  return res.data
}

// 非结构化数据服务器简易存储多条获取
export async function getMultipleStorage(params) {
  const requestParams = {
    url: '/storage/multiplefirst',
    method: 'get',
    params: params,
    paramsSerializer: function(params) {
      return qs.stringify(params, { arrayFormat: 'repeat' })
    }
  }
  const res = await requestgo(requestParams)
  return res.data
}

// 非结构化数据服务器简易存储
export async function createStorage(params) {
  const requestParams = {
    url: '/storage/create',
    method: 'post',
    data: params
  }
  const res = await requestgo(requestParams)
  return res.data
}

export async function getTranslate(params) {
  const requestParams = {
    url: '/utils/translate',
    method: 'post',
    data: params
  }
  // let res = await requestgo(requestParams);
  // return res.data;
  return await cacheRequestGo(requestParams)
}

export async function getDirectedByYear(params) {
  const requestParams = {
    url: '/smallworld/directedByYear',
    method: 'post',
    data: params
  }
  const res = await requestgo(requestParams)
  return res.data
  // return await cacheRequestGo(requestParams);
}

export async function getUndirectedByYear(params) {
  const requestParams = {
    url: '/smallworld/undirectedByYear',
    method: 'get',
    params: params
  }
  // let res = await requestgo(requestParams);
  // return res.data;
  return await cacheRequestGo(requestParams)
}

export async function getCacheSummary(params) {
  const requestParams = {
    url: '/wiki/cache/page/summary',
    method: 'get',
    params: params
  }
  // let res = await requestgo(requestParams);
  // return res.data;
  return await cacheRequestGo(requestParams)
}

export async function getWikiBirthday(params) {
  const requestParams = {
    url: '/wiki/birthday',
    method: 'post',
    data: params
  }
  const res = await requestgo(requestParams)
  return res.data
  // return await cacheRequestGo(requestParams);
}

// mag 小世界 api
export async function getMagUndirectNet(params) {
  const requestParams = {
    url: '/mag/magsmallworldundirect',
    method: 'post',
    data: params
  }
  const res = await requestgo(requestParams)
  return res.data
  // return await cacheRequestGo(requestParams);
}

//  mag 因果关系-贸易比例
export async function getYinguoData(params) {
  const requestParams = {
    url: '/mag/getYinguoData',
    method: 'post',
    data: params
  }
  const res = await request(requestParams)
  return res.data
  // return await cacheRequestGo(requestParams);
}

export async function getMasYearRefDist(params) {
  const requestParams = {
    url: '/mag/magyearrefdist',
    method: 'post',
    data: params
  }
  const res = await requestgo(requestParams)
  return res.data
}

// mag 自恋度
export async function getMagRefSelfRate(params) {
  const requestParams = {
    url: '/mag/getMagRefSelfRate',
    method: 'post',
    data: params
  }
  const res = await request(requestParams)
  return res.data
  // return await cacheRequestGo(requestParams);
}

// mag google距离中间数据
export async function getGoogleDistance_tempdata(params) {
  const requestParams = {
    url: '/mag/getGoogleDistance_tempdata',
    method: 'post',
    data: params
  }
  const res = await request(requestParams)
  return res.data
}

// mag 各学科 linkin 逐年引用情况
export async function getMasCompositionByYear(params) {
  const requestParams = {
    url: '/mag/getCompositionByYear',
    method: 'post',
    data: params
  }
  const res = await request(requestParams)
  return res.data
}

export async function getWikiData(params) {
  const requestParams = {
    url: '/wiki/getDistance',
    method: 'post',
    data: params
  }
  return await cacheRequest(requestParams)
}

export async function getMagAuthorsAndArticleInfo(params) {
  const requestParams = {
    url: '/mag/getMagAuthorsAndArticleInfo',
    method: 'post',
    data: params
  }
  // let res = await request(requestParams);
  // return res.data;
  return await cacheRequest(requestParams)
}

export async function getMagAuthorsAndArticleInfoV2(params) {
  const requestParams = {
    url: '/mag/getMagAuthorsAndArticleInfo_v2',
    method: 'post',
    data: params
  }
  // let res = await request(requestParams);
  // return res.data;
  return await cacheRequest(requestParams)
}

export async function getLinkTjv2(params) {
  const requestParams = {
    url: '/mag/getLinkTj_v2',
    method: 'post',
    data: params
  }
  // let res = await request(requestParams);
  // return res.data;
  return await cacheRequest(requestParams)
}

export async function getBL_level1(params) {
  const requestParams = {
    url: '/mag/getBL_level1',
    method: 'post',
    data: params
  }
  // let res = await request(requestParams);
  // return res.data;
  return await cacheRequest(requestParams)
}

// mag 第一层父类
export async function getOriginCategories() {
  const requestParams = {
    url: '/mag/getOriginCategories',
    method: 'get'
  }
  const res = await request(requestParams)
  return res.data
  // return await cacheRequest(requestParams);
}

// mag v2幂律相关统计数据
export async function getZipfAndInnerZipfTjData(data) {
  const requestParams = {
    url: '/mag/getZipfAndInnerZipfTjData',
    method: 'post',
    data
  }
  const res = await request(requestParams)
  return res.data
  // return await cacheRequest(requestParams);
}

// 获取子类
export async function getChildCategories(params) {
  const requestParams = {
    url: '/mag/getChildCategories',
    method: 'post',
    data: params
  }
  // let res = await request(requestParams);
  // return res.data;
  return await cacheRequest(requestParams)
}

export async function getFosTjv2(params) {
  const requestParams = {
    url: '/mag/getFosTj_v2',
    method: 'post',
    data: params
  }
  // let res = await request(requestParams);
  // return res.data;
  return await cacheRequest(requestParams)
}

export async function getMagZipf(params) {
  const requestParams = {
    url: '/mag/getMagZipf',
    method: 'post',
    data: params
  }
  return await cacheRequest(requestParams)
}

export async function getMagZipfV2(params) {
  const requestParams = {
    url: '/mag/getMagZipf_v2',
    method: 'post',
    data: params
  }

  const res = await request(requestParams)
  return res.data
  // return await cacheRequest(requestParams);
}

export async function getMagInnerZipf(params) {
  const requestParams = {
    url: '/mag/getMagInnerZipf',
    method: 'post',
    data: params
  }
  return await cacheRequest(requestParams)
}

export async function getMagInnerZipfV2(params) {
  const requestParams = {
    url: '/mag/getMagInnerZipf_v2',
    method: 'post',
    data: params
  }
  return await cacheRequest(requestParams)
}

export async function getDistanceCore(params) {
  const requestParams = {
    url: '/wiki/getDistanceCore',
    method: 'post',
    data: params
  }

  const res = await request(requestParams)
  return res.data
  // return await cacheRequest(requestParams);
}

export function getMasData(params) {
  return request({
    url: '/wiki/getMasDistance',
    method: 'post',
    data: params
  })
}

export function getMasDatav2(params) {
  return request({
    url: '/wiki/getMasDistance_v2',
    method: 'post',
    data: params
  })
}

export function getCoreLinksInDataByCats(params) {
  return request({
    url: '/wiki/getCoreLinksInDataByCats',
    method: 'post',
    data: params
  })
}

export function getCoreLinksInData(params) {
  return request({
    url: '/wiki/getCoreLinksInData',
    method: 'post',
    data: params
  })
}

export async function getCoreZipfByNodes(params) {
  const requestParams = {
    url: '/wiki/getCoreZipfByNodes',
    method: 'post',
    data: params
  }

  const res = await request(requestParams)
  return res.data
  // return await cacheRequest(requestParams);
}
export async function getCoreZipfByNodes_v2(params) {
  const requestParams = {
    url: '/wiki/getCoreZipfByNodes_v2',
    method: 'post',
    data: params
  }

  const res = await request(requestParams)
  return res.data
  // return await cacheRequest(requestParams);
}

export async function getArticlesTotal(params) {
  const requestParams = {
    url: '/wiki/getArticlesTotal',
    method: 'post',
    data: params
  }
  const res = await request(requestParams)
  return res.data
}

export async function getArticlesTotalByCore(params) {
  const requestParams = {
    url: '/wiki/getArticlesTotalByCore',
    method: 'post',
    data: params
  }
  const res = await request(requestParams)
  return res.data
}

export async function getArticlesTotalByCore_plus(params) {
  const requestParams = {
    url: '/wiki/getArticlesTotalByCore_plus',
    method: 'post',
    data: params
  }
  const res = await request(requestParams)
  return res.data
}

export async function getArticlesTotalByCoreNew_v3(params) {
  const requestParams = {
    url: '/wiki/getArticlesTotalByCoreNew_v3',
    method: 'post',
    data: params
  }
  const res = await request(requestParams)
  return res.data
}

export async function getArticlesTotalByCoreNew(params) {
  const requestParams = {
    url: '/wiki/getArticlesTotalByCoreNew',
    method: 'post',
    data: params
  }
  const res = await request(requestParams)
  return res.data
}

export function getDistanceByFile(params) {
  return request({
    url: '/wiki/getDistanceByFile',
    method: 'post',
    data: params
  })
}

export function getMasArticlesTotal(params) {
  return request({
    url: '/wiki/getMasArticlesTotal',
    method: 'post',
    data: params
  })
}

export function getMasArticlesTotalV2(params) {
  return request({
    url: '/wiki/getMasArticlesTotal_v2',
    method: 'post',
    data: params
  })
}

export function getViewAndEdits(params) {
  return request({
    url: '/wiki/getViewAndEdits',
    method: 'post',
    data: params
  })
}

export function getZipf(params) {
  return request({
    url: '/wiki/getZipf',
    method: 'post',
    data: params
  })
}

export async function getZipfByNodes(params) {
  const requestParams = {
    url: '/wiki/getZipfByNodes',
    method: 'post',
    data: params
  }
  return await cacheRequest(requestParams)
}
export async function getPeopleZipfByNodes(params) {
  const requestParams = {
    url: '/wiki/getPeopleZipfByNodes',
    method: 'post',
    data: params
  }
  return await cacheRequest(requestParams)
}
export async function getPeopleInnerZipfByNodes(params) {
  const requestParams = {
    url: '/wiki/getPeopleInnerZipfByNodes',
    method: 'post',
    data: params
  }
  return await cacheRequest(requestParams)
}

export function getPagerankZipf(params) {
  return request({
    url: '/wiki/getPagerankZipf',
    method: 'post',
    data: params
  })
}

export function getDfb(params) {
  return request({
    url: '/wiki/getDfb',
    method: 'post',
    data: params
  })
}
export function getBanshuaiqi(params) {
  return request({
    url: '/wiki/getBanshuaiqi',
    method: 'post',
    data: params
  })
}
export function getTopArticles(params) {
  return request({
    url: '/wiki/getTopArticles',
    method: 'post',
    data: params
  })
}
// 人和人的相关度
export async function getDistanceByPeoples(params) {
  const requestParams = {
    url: '/wiki/getDistanceByPeoples',
    method: 'post',
    data: params
  }
  return await cacheRequest(requestParams)
}
// 人和学科的相关度
export async function getDistanceByPeopleAndCats(params) {
  const requestParams = {
    url: '/wiki/getDistanceByPeopleAndCats',
    method: 'post',
    data: params
  }
  return await cacheRequest(requestParams)
}
// http://wikidb.lambdax.cn:5555/wikidb_web/rest/Britannica/childCategories?categoryTitle=TG9naWM=
// 大英百科全书 tree
export function getBritannicaTree(params) {
  return requestwiki({
    url: '/Britannica/childCategories',
    method: 'get',
    params: params
  })
}

// 文章 tree
export async function getWikiPageTree(params) {
  let requestParams
  if (params.db === 'WIKI11') {
    params.db = 'WIKI13'
    requestParams = {
      url: '/wikidb11/childArticles',
      method: 'get',
      params: params
    }
  } else if (params.db === 'WIKI13') {
    requestParams = {
      url: '/wikidb13/childArticles',
      method: 'get',
      params: params
    }
  } else {
    requestParams = {
      url: '/wiki/childArticles',
      method: 'get',
      params: params
    }
  }
  return await cacheRequestWiki(requestParams)
}

// 类 tree
export async function getWikiCategoryTree(params) {
  let requestParams
  if (params.db === 'WIKI11') {
    params.db = 'WIKI13'
    requestParams = {
      url: '/wikidb11/childCategories',
      method: 'get',
      params: params
    }
  } else if (params.db === 'WIKI13') {
    requestParams = {
      url: '/wikidb13/childCategories',
      method: 'get',
      params: params
    }
  } else {
    requestParams = {
      url: '/wiki/childCategories',
      method: 'get',
      params: params
    }
  }
  return await cacheRequestWiki(requestParams)
}
