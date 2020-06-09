import request from "@/utils/request";
import requestwiki from "@/utils/requestwiki";
import requestgo from "@/utils/requestgo";
import * as localforage from "localforage";
localforage.setDriver([localforage.INDEXEDDB, localforage.WEBSQL]);

let store1 = localforage.createInstance({
  name: "wikiknogen",
  version: 7,
  storeName: "api", // Should be alphanumeric, with underscores.
  description: "store api"
});

let store2 = localforage.createInstance({
  name: "wikiknogenTree",
  version: 8,
  storeName: "api", // Should be alphanumeric, with underscores.
  description: "store api"
});

let store3 = localforage.createInstance({
  name: "wikiGo",
  version: 2,
  storeName: "api", // Should be alphanumeric, with underscores.
  description: "store api"
});

// 对请求进行缓存
let cacheRequest = async requestParams => {
  let item = await store1.getItem(JSON.stringify(requestParams));
  if (!item) {
    console.log("无缓存");
    let response = await request(requestParams);
    if (response.status == 200) {
      await store1.setItem(JSON.stringify(requestParams), response.data);
    }
    item = response.data;
  } else {
    // console.log("命中缓存");
  }
  return item;
};
// 对请求进行缓存
let cacheRequestWiki = async requestParams => {
  let item = await store2.getItem(JSON.stringify(requestParams));
  if (!item) {
    console.log("无缓存");
    let response = await requestwiki(requestParams);
    if (response.status == 200) {
      await store2.setItem(JSON.stringify(requestParams), response.data);
    }
    item = response.data;
  } else {
    // console.log("命中缓存");
  }
  return item;
};

// 对请求进行缓存
export let cacheRequestGo = async requestParams => {
  let item = await store3.getItem(JSON.stringify(requestParams));
  if (!item) {
    console.log("无缓存");
    let response = await requestgo(requestParams);
    if (response.status == 200) {
      console.log(response.status);
      await store3.setItem(JSON.stringify(requestParams), response.data);
    }
    item = response.data;
  } else {
    // console.log("命中缓存");
  }
  return item;
};

export async function getScaleTrend(params) {
  let requestParams = {
    url: "/smallworld/scaleTrend",
    method: "get",
    params: params
  };
  // let res = await requestgo(requestParams);
  // return res.data;
  return await cacheRequestGo(requestParams);
}
export async function getUndirectedByYear(params) {
  let requestParams = {
    url: "/smallworld/undirectedByYear",
    method: "get",
    params: params
  };
  // let res = await requestgo(requestParams);
  // return res.data;
  return await cacheRequestGo(requestParams);
}

export async function getWikiData(params) {
  let requestParams = {
    url: "/wiki/getDistance",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}

export async function getMagAuthorsAndArticleInfo(params) {
  let requestParams = {
    url: "/mag/getMagAuthorsAndArticleInfo",
    method: "post",
    data: params
  };
  // let res = await request(requestParams);
  // return res.data;
  return await cacheRequest(requestParams);
}

export async function getMagZipf(params) {
  let requestParams = {
    url: "/mag/getMagZipf",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}

export async function getMagInnerZipf(params) {
  let requestParams = {
    url: "/mag/getMagInnerZipf",
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

export async function getCoreZipfByNodes(params) {
  let requestParams = {
    url: "/wiki/getCoreZipfByNodes",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}
export async function getCoreZipfByNodes_v2(params) {
  let requestParams = {
    url: "/wiki/getCoreZipfByNodes_v2",
    method: "post",
    data: params
  };
  return await cacheRequest(requestParams);
}

export async function getArticlesTotal(params) {
  let requestParams = {
    url: "/wiki/getArticlesTotal",
    method: "post",
    data: params
  };
  let res = await request(requestParams);
  return res.data;
}

export async function getArticlesTotalByCore(params) {
  let requestParams = {
    url: "/wiki/getArticlesTotalByCore",
    method: "post",
    data: params
  };
  let res = await request(requestParams);
  return res.data;
}

export async function getArticlesTotalByCore_plus(params) {
  let requestParams = {
    url: "/wiki/getArticlesTotalByCore_plus",
    method: "post",
    data: params
  };
  let res = await request(requestParams);
  return res.data;
}

export async function getArticlesTotalByCoreNew_v3(params) {
  let requestParams = {
    url: "/wiki/getArticlesTotalByCoreNew_v3",
    method: "post",
    data: params
  };
  let res = await request(requestParams);
  return res.data;
}

export async function getArticlesTotalByCoreNew(params) {
  let requestParams = {
    url: "/wiki/getArticlesTotalByCoreNew",
    method: "post",
    data: params
  };
  let res = await request(requestParams);
  return res.data;
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
    params.db = "WIKI13";
    requestParams = {
      url: "/wikidb11/childArticles",
      method: "get",
      params: params
    };
  } else if (params.db === "WIKI13") {
    requestParams = {
      url: "/wikidb13/childArticles",
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
    params.db = "WIKI13";
    requestParams = {
      url: "/wikidb11/childCategories",
      method: "get",
      params: params
    };
  } else if (params.db === "WIKI13") {
    requestParams = {
      url: "/wikidb13/childCategories",
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
