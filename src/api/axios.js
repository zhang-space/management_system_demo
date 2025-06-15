
import axios from 'axios'

// 设置URL
const baseUrl = '/api'

/**
 * HttpRequest类
 * 对axios进行封装，提供统一的请求方法和拦截器配置
 */
class HttpRequest {
  /**
   * 构造函数
   * @param {string} baseUrl - API的基础URL
   * @returns {void} 无返回值，初始化实例
   */
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  /**
   * 获取默认配置
   * @returns {Object} 返回默认的请求配置对象，包含baseUrl和header
   */
  getInsideConfig() {
    const config = {
      baseUrl: this.baseUrl,
      header: {}
    }
    return config
  }

  /**
   * 配置请求和响应拦截器
   * @param {AxiosInstance} instance - axios实例
   * @returns {void} 无返回值，直接修改传入的axios实例
   */
  interceptors(instance) {
    // 添加请求拦截器
    instance.interceptors.request.use(function (config) {
      return config; // 返回修改后的配置，继续发送请求
    }, function (error) {
      return Promise.reject(error); // 返回Promise的reject状态，中断请求
    });

    // 添加响应拦截器
    instance.interceptors.response.use(function (response) {
      return response; // 返回处理后的响应数据，传递给then回调
    }, function (error) {
      console.log(error, 'error')
      return Promise.reject(error); // 返回Promise的reject状态，传递给catch回调
    });
  }

  /**
   * 发送请求
   * @param {Object} options - 请求配置选项
   * @returns {Promise<AxiosResponse>} 返回axios请求的Promise对象
   *                                  成功时resolve响应对象，失败时reject错误信息
   */
  request(options) {
    // 创建新的axios实例
    const instance = axios.create()
    // 合并默认配置和自定义配置
    options = { ...this.getInsideConfig(), ...options }
    // 添加拦截器
    this.interceptors(instance)
    // 发送请求并返回Promise
    return instance(options)
  }
}

/**
 * 导出HttpRequest实例
 * 使用预设的baseUrl创建实例，可直接调用request方法发送请求
 * @type {HttpRequest}
 */
export default new HttpRequest(baseUrl)