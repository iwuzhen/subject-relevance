import request from "@/utils/request";
import requestwiki from "@/utils/requestwiki";

export function getWikiData(params) {
  return request({
    url: "/wiki/getDistance",
    method: "post",
    data: params
  });
}

export function getMasData(params) {
  return request({
    url: "/wiki/getMasDistance",
    method: "post",
    data: params
  });
}

export function getArticlesTotal(params) {
  return request({
    url: "/wiki/getArticlesTotal",
    method: "post",
    data: params
  });
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

export function getZipfByNodes(params) {
  return request({
    url: "/wiki/getZipfByNodes",
    method: "post",
    data: params
  });
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
export function getWikiPageTree(params) {
  if (params.db === "WIKI11") {
    return requestwiki({
      url: "/wikidb11/childArticles",
      method: "get",
      params: params
    });
  } else if (params.db === "WIKI13") {
    return requestwiki({
      url: "/wikidb11/childArticles",
      method: "get",
      params: params
    });
  } else {
    return requestwiki({
      url: "/wiki/childArticles",
      method: "get",
      params: params
    });
  }
}

// 类 tree
export function getWikiCategoryTree(params) {
  if (params.db === "WIKI11") {
    return requestwiki({
      url: "/wikidb11/childCategories",
      method: "get",
      params: params
    });
  } else if (params.db === "WIKI13") {
    return requestwiki({
      url: "/wikidb11/childCategories",
      method: "get",
      params: params
    });
  } else {
    return requestwiki({
      url: "/wiki/childCategories",
      method: "get",
      params: params
    });
  }
}
