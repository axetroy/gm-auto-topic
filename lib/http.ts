/**
 * Created by axetroy on 2017/7/14.
 */
declare function GM_xmlhttpRequest(agm: GM_xmlhttpRequestConfig$): void

interface HttpHeader$ {
  [s: string]: string;
}

interface Response$ {
  response: string;
  readyState: number;
  responseHeaders: any;
  responseText: string;
  status: number;
  statusText: string;
  context: any;
  finalUrl: string;
}

interface RequestConfig$ {
  binary?: boolean;
  context?: any;
  overrideMimeType?: string;
  user?: string;
  password?: string;
  synchronous?: boolean;
  timeout?: number;
  upload?: any;
  onabort?(response: Response$): void;
  onerror?(response: Response$): void;
  onload?(): void;
  onprogress?(): void;
  onreadystatechange?(response: Response$): void;
  ontimeout?(response: Response$): void;
}

interface CommonRequestConfig$ {
  method: string;
  url: string;
  data: Object | string;
  header: HttpHeader$;
}

interface GM_xmlhttpRequestConfig$
  extends CommonRequestConfig$,
    RequestConfig$ {}

function isFunction(func): boolean {
  return typeof func === 'function';
}

class Http {
  constructor(config) {}
  create(config): Http {
    return new Http(config);
  }
  request(
    method: string,
    url: string,
    data: Object | string = '',
    header: HttpHeader$ = {},
    config: RequestConfig$ = {}
  ): Promise<Response$> {
    return new Promise((resolve, reject) => {
      const commonRequestConfig: CommonRequestConfig$ = {
        method,
        url,
        data,
        header
      };
      const GM_xmlhttpRequestConfig: GM_xmlhttpRequestConfig$ = {
        ...commonRequestConfig,
        ...config
      };
      let {
        onreadystatechange,
        onerror,
        onabort,
        ontimeout
      } = GM_xmlhttpRequestConfig;
      GM_xmlhttpRequestConfig.synchronous = true; // async
      GM_xmlhttpRequestConfig.onreadystatechange = function(response: Response$) {
        isFunction(onreadystatechange) &&
          onreadystatechange.call(this, response);
        console.log(response.readyState);
        if (response.readyState !== 4) return;
        response.status >= 200 && response.status < 400 && response.finalUrl
          ? resolve(response)
          : reject(response);
      };

      GM_xmlhttpRequestConfig.onerror = function(response: Response$) {
        isFunction(onerror) && onerror.call(this, response);
      };

      GM_xmlhttpRequestConfig.onabort = function(response: Response$) {
        isFunction(onabort) && onabort.call(this, response);
        reject(response);
        resolve();
      };

      GM_xmlhttpRequestConfig.ontimeout = function(response: Response$) {
        isFunction(ontimeout) && ontimeout.call(this, response);
        reject(response);
      };
      console.log(GM_xmlhttpRequestConfig);

      GM_xmlhttpRequest({ ...GM_xmlhttpRequestConfig });
    });
  }
  get(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    config?: RequestConfig$
  ): Promise<Response$> {
    return this.request('GET', url, data, header, config);
  }
  post(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    config?: RequestConfig$
  ): Promise<Response$> {
    return this.request('POST', url, data, header, config);
  }
  put(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    config?: RequestConfig$
  ): Promise<Response$> {
    return this.request('PUT', url, data, header, config);
  }
  ['delete'](
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    config?: RequestConfig$
  ): Promise<Response$> {
    return this.request('DELETE', url, data, header, config);
  }
  head(
    url: string,
    data?: Object | string,
    header?: HttpHeader$,
    config?: RequestConfig$
  ): Promise<Response$> {
    return this.request('HEAD', url, data, header, config);
  }
}

const timeout = 5000;
let http = new Http({ timeout });

export { http, Response$, timeout };
export default http;
