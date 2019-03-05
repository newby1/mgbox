import "whatwg-fetch";
import "url-polyfill";
import extend from "extend";

class AbstractApi {
    constructor(){
    }
    get() {}
    post() {}
}

export const METHODS = {
    GET: "GET",
    HEAD: "HEAD",
    POST: "POST",
    DELETE: "DELETE",
    OPTIONS: "OPTIONS",
    PUT: "PUT",
    JSONP: "JSONP"
};
const NET_ERROR = "网络异常";

export class Api extends AbstractApi {

    constructor(host){
        super();
        this.host = host;
    }
    static getSearchParams(obj){
        let urlSearchParamsObj = new URLSearchParams();
        for(let key in obj){
            urlSearchParamsObj.set(key, obj[key]);
        }
        return urlSearchParamsObj.toString();
    }
    getUrl(url, data, method = METHODS.GET){
        let urlIns;
        let key;
        if (url.indexOf("http") === 0){
            urlIns  = new URL(url);
        }else{
            url = this.host + url;
            urlIns  = new URL(url, document.URL);
        }
        if (method == METHODS.GET || method == METHODS.HEAD){
            for(key in data){
                urlIns.searchParams.set(key, data[key]);
            }
            urlIns.searchParams.set("_t", +new Date());
        }
        return urlIns.toString();
    }

    fetch(url, data, option){
        let args = {
            method: METHODS.GET,
            credentials: "same-origin"
        };
        Object.assign(args, option);
        url = this.getUrl(url, data, args.method);
        //处理body 以及参数
        if (args.method == METHODS.GET || args.method == METHODS.HEAD){
        }else{
            if (data.constructor == Object.prototype.constructor){
                args.body = Api.getSearchParams(data);
            }else{
                args.body = data;
            }
        }
        let request =  new Request(url, args);
        return new Promise((resolve, reject) => {
            window.fetch(request).then((response) => {
                    if(response.ok){
                        if(args.dataType && args.dataType == "html") {
                            response.text().then(data => {
                                resolve(data);
                            },
                            e => {
                                reject(new Error("html data error"));
                            });
                            return;
                        }
                        response.json().then(data => {
                            resolve(data);
                        },
                        e => {
                            reject(new Error("data json error"));
                        });

                    }else{
                        reject(new Error("error " + response.status));
                    }
                },
                e  => {
                    reject(e);
                });
        });

    }
    get (url, data , option){
        return this.fetch(url, data, option);
    }
    post(url, data, option){
        let args = {
            method: METHODS.POST,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        };
        return this.fetch(url, data, Object.assign(args, option));

    }
    jsonp(url, data, option){
        let args = {
            type: "text/javascript",
            charset: "UTF-8",
            jsonp: "callback",
            jsonpCallback: "jsonp" + Math.random().toString().substr(2)
        };
        Object.assign(args, option);
        data = data || {};
        data[args.jsonp] = args.jsonpCallback;
        return new Promise((resolve, reject) => {
            window[args.jsonpCallback] = function (data) {
                resolve(data);
                window[args.jsonpCallback] = null;
            };
            let script = document.createElement("script");
            script.type = args.type;
            script.charset = args.charset;
            script.onload = function () {
                script.onload =  null;
                document.head.removeChild(script);
            };
            script.onerror = function () {
                script.onerror =  null;
                document.head.removeChild(script);
                reject(new Error(NET_ERROR));
            };
            script.src = this.getUrl(url, data);
            document.head.appendChild(script);
        });
    }
}

const storage = {
    get(key) {
        return localStorage.getItem(key);
    },
    set(key, val, cacheDuration) {
        localStorage.setItem(key, JSON.stringify(val) + "|" + (+new Date()) + "|" + cacheDuration);
    },
    remove(key) {
        localStorage.removeItem(key);
    }

};

class CacheApi extends Api {
    constructor(host){
        super(host);
        this.caches = {};
    }
    memoryCache(method, url, data, option){
        let args = {
            memoryCache : false
        };
        Object.assign(args, option);
        let key = url + JSON.stringify(data);
        let res = this.caches[key];
        if (!res){
            this.caches[key] = new Promise((resolve, reject) => {
                super[method.toLowerCase()](url, data , option).then(data => {
                    if ( !args.memoryCache){
                        this.caches[key] = null;
                    }
                    resolve(data);
                }, e => {
                    this.caches[key] = null;
                    reject(e);
                });
            });
        }
        return this.caches[key];

    }
    localCache(method, url, data, option){
        let args = {
            localCache: {
                cacheTime: 5 * 60 * 1000 //毫秒
            }
        };
        extend(true, args, option);
        let key = url + JSON.stringify(data);
        let localData = storage.get(key);

        return new Promise((resolve, reject ) => {
            if (localData ){
                let arr = localData.split("|");
                let isAvailable = parseInt(arr[1]) + parseInt(arr[2]) > +new Date;
                if (isAvailable){
                    let data = null;
                    try{
                        data = JSON.parse(arr[0]);
                    }catch (e) {
                        console.log("local cache parse data is error");

                    }
                    resolve(data);
                    return;
                }
            }
            super[method.toLowerCase()](url, data, args).then(data => {
                    storage.set(key, data, args.localCache.cacheTime);
                    resolve(data);
                },
                e => {
                    reject(e);
                }
            );
        });
    }
    cache(method, url, data, option){
        let args = {
            memoryCache: false,
            localCache: false
        };
        Object.assign(args, option);
        if (args.localCache){
            return this.localCache(method, url, data, option)
        }
        return this.memoryCache(method, url, data, option)

    }
    get(url, data, option){
        return this.cache(METHODS.GET, url, data, option);
    }
    jsonp(url, data, option){
        return this.cache(METHODS.JSONP, url, data, option);
    }
}

export  default  CacheApi;
