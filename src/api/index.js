import request from "@/utils/request";
import requestwiki from "@/utils/requestwiki";
import * as localforage from "localforage";

let store1 = localforage.createInstance({
  name: "wikiknogen",
  version: 1,
  storeName: "api", // Should be alphanumeric, with underscores.
  description: "store api"
});
let store2 = localforage.createInstance({
  name: "wikiknogenTree",
  version: 1.0,
  storeName: "api", // Should be alphanumeric, with underscores.
  description: "store api"
});

// 对请求进行缓存
let cacheRequest = async requestParams => {
  let item = await store1.getItem(JSON.stringify(requestParams));
  if (!item) {
    let response = await request(requestParams);
    await store1.setItem(JSON.stringify(requestParams), response.data);
    item = response.data;
  }
  return item;
};
// 对请求进行缓存
let cacheRequestWiki = async requestParams => {
  let item = await store2.getItem(JSON.stringify(requestParams));
  if (!item) {
    let response = await requestwiki(requestParams);
    await store2.setItem(JSON.stringify(requestParams), response.data);
    item = response.data;
  }
  return item;
};

export async function getWikiData(params) {
  let requestParams = {
    url: "/wiki/getDistance",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}

export async function getDistanceCore(params) {
  let requestParams = {
    url: "/wiki/getDistanceCore",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}

export function getMasData(params) {
  return request({
    url: "/wiki/getMasDistance",
    method: "post",
    data: params
  });
}

export function getCoreLinksInDataByCats(params) {
  return request({
    url: "/wiki/getCoreLinksInDataByCats",
    method: "post",
    data: params
  });
}

export function getCoreLinksInData(params) {
  return request({
    url: "/wiki/getCoreLinksInData",
    method: "post",
    data: params
  });
}

export function getCoreZipfByNodes(params) {
  return request({
    url: "/wiki/getCoreZipfByNodes",
    method: "post",
    data: params
  });
}

export async function getArticlesTotal(params) {
  let requestParams = {
    url: "/wiki/getArticlesTotal",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}

export function getDistanceByFile(params) {
  return request({
    url: "/wiki/getDistanceByFile",
    method: "post",
    data: params
  });
}

export function getMasArticlesTotal(params) {
  return request({
    url: "/wiki/getMasArticlesTotal",
    method: "post",
    data: params
  });
}

export function getViewAndEdits(params) {
  return request({
    url: "/wiki/getViewAndEdits",
    method: "post",
    data: params
  });
}

export function getZipf(params) {
  return request({
    url: "/wiki/getZipf",
    method: "post",
    data: params
  });
}

export async function getZipfByNodes(params) {
  let requestParams = {
    url: "/wiki/getZipfByNodes",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}
export async function getPeopleZipfByNodes(params) {
  let requestParams = {
    url: "/wiki/getPeopleZipfByNodes",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}
export async function getPeopleInnerZipfByNodes(params) {
  let requestParams = {
    url: "/wiki/getPeopleInnerZipfByNodes",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}

export function getPagerankZipf(params) {
  return request({
    url: "/wiki/getPagerankZipf",
    method: "post",
    data: params
  });
}

export function getDfb(params) {
  return request({
    url: "/wiki/getDfb",
    method: "post",
    data: params
  });
}
export function getBanshuaiqi(params) {
  return request({
    url: "/wiki/getBanshuaiqi",
    method: "post",
    data: params
  });
}
export function getTopArticles(params) {
  return request({
    url: "/wiki/getTopArticles",
    method: "post",
    data: params
  });
}
// 人和人的相关度
export async function getDistanceByPeoples(params) {
  let requestParams = {
    url: "/wiki/getDistanceByPeoples",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}
// 人和学科的相关度
export async function getDistanceByPeopleAndCats(params) {
  let requestParams = {
    url: "/wiki/getDistanceByPeopleAndCats",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}
// http://wikidb.lambdax.cn:5555/wikidb_web/rest/Britannica/childCategories?categoryTitle=TG9naWM=
// 大英百科全书 tree
export function getBritannicaTree(params) {
  return requestwiki({
    url: "/Britannica/childCategories",
    method: "get",
    params: params
  });
}

// 文章 tree
export async function getWikiPageTree(params) {
  let requestParams;
  if (params.db === "WIKI11") {
    requestParams = {
      url: "/wikidb11/childArticles",
      method: "get",
      params: params
    };
  } else if (params.db === "WIKI13") {
    requestParams = {
      url: "/wikidb11/childArticles",
      method: "get",
      params: params
    };
  } else {
    requestParams = {
      url: "/wiki/childArticles",
      method: "get",
      params: params
    };
  }
  return await cacheRequestWiki(requestParams);
}

// 类 tree
export async function getWikiCategoryTree(params) {
  let requestParams;
  if (params.db === "WIKI11") {
    requestParams = {
      url: "/wikidb11/childCategories",
      method: "get",
      params: params
    };
  } else if (params.db === "WIKI13") {
    requestParams = {
      url: "/wikidb11/childCategories",
      method: "get",
      params: params
    };
  } else {
    requestParams = {
      url: "/wiki/childCategories",
      method: "get",
      params: params
    };
  }
  return await cacheRequestWiki(requestParams);
}
