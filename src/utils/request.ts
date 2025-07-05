import axios from "axios";

/**
 * @description 创建请求实例
 */
function createHttp() {
  const http = axios.create();    // 创建 axios 实例

  http.interceptors.request.use(  // 请求拦截
    config => config,
    error => {
      return Promise.reject(error);
    }
  );

  http.interceptors.response.use( // 响应拦截
    response => {
      const dataAxios = response.data;
      const { code } = dataAxios;

      if (code === undefined) {
        return dataAxios;
      } else {
        switch (code) {
          case 1:
            return dataAxios.data;
          default:
            errorCreate(`${dataAxios.msg}: ${response.config.url}`)
        }
      }
    },
    error => {
      const status = error.response.status;
      const errorData: { [key: number]: string } = {
        400: '请求错误',
        401: '未授权，请重新登陆',
        403: '拒绝访问，请授权登陆',
        404: '请求地址错误',
        408: '请求超时',
        500: '服务器内部错误',
        501: '服务未实现',
        502: '网关错误',
        503: '服务不可用',
        504: '网关超时',
        505: 'HTTP版本不支持'
      };
      error.message = errorData[status] || '未知错误';
      errorLog(error)
      return Promise.reject(error)
    }
  )
  return http;
}

/**
 * @description 创建一个错误信息
 * @param msg 错误信息
 */
function errorCreate(msg: string) {
  const error = new Error(msg); // 新建错误实例
  errorLog(error);              // 记录错误日志
  throw error;                  // 抛出错误
}

/**
 * @description 打印一个错误信息
 * @param error 错误信息对象
 */
function errorLog(error: Error) {
  if (import.meta.env.MODE === 'development') {
    console.error('>>>>>> Error >>>>>>');
    console.log(error);
  }
}

/**
 * @description 继承请求默认参数
 * @param config 自定义参数(url, method, data...)
 */
function request(config: any) {
  const http = createHttp()

  const configDefault = { // 设置默认请求参数
    headers: {
      Authorization: '',
      'Content-Type': config?.headers ? config.headers['Content-Type'] ?? 'aplication/json' : 'aplication/json'
    },
    timeout: 3000,
    baseURL: import.meta.env.VITE_APP_API_URL,
    data: {}
  }

  return http(Object.assign(configDefault, config))
}

/**
 * 导出请求方法
 */
export default {
  get<T = any>(url: string, params: any = {}, options = {}) {  // get请求
    const config = {
      url,
      params,
      method: 'get'
    }
    return request(Object.assign(options, config)) as T
  },

  post<T = any>(url: string, data: any = {}, options = {}) {  // post请求
    const config = {
      url,
      data,
      method: 'post'
    }
    return request(Object.assign(options, config)) as T
  }
}
