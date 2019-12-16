import request from "@/utils/request";
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
