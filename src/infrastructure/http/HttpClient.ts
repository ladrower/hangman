import { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse, AxiosStatic } from 'axios'
import { injectable } from '../ioc'

export interface HttpService extends AxiosInstance {}
export class HttpService implements AxiosInstance {}

export interface HttpFactory extends AxiosStatic {}
export class HttpFactory implements AxiosStatic {}

@injectable
export class HttpClient {
  private httpService: HttpService = this.httpFactory.create()
  readonly interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  } = this.httpService.interceptors

  constructor(private httpFactory: HttpFactory) {}

  configure(config: AxiosRequestConfig) {
    Object.assign(this.httpService.defaults, config)
  }

  request<T>(requestFunc: (http: HttpService) => T): T {
    return requestFunc(this.httpService)
  }
}
