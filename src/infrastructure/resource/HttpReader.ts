import { injectable } from '@/infrastructure/ioc'
import { HttpClient, HttpService } from '@/infrastructure/http/HttpClient'
import { AxiosError, AxiosResponse } from 'axios'
import { observable, runInAction } from 'mobx'
import { IResource } from '@/infrastructure/resource'

export interface IHttpResource<T> extends IResource<T, AxiosError<T>> {}
export interface HttpRequest<T> {
  (http: HttpService): Promise<AxiosResponse<T>>
}

@injectable
export class HttpReader {
  constructor(
    private http: HttpClient
  ) { }

  read<T>(request: HttpRequest<T>): IHttpResource<T> {
    const result = observable.object<{
      response?: {
        data?: T,
        error?: AxiosError<T>
      }
    }>({
      response: undefined
    })

    this.http.request(request)
      .then(({ data }) => runInAction(() => result.response = { data }))
      .catch(( error ) => runInAction(() => result.response = { error }))

    return observable.object({
      get loading() {
        return !result.response
      },
      get error() {
        const { response } = result
        return response && response.error
      },
      get data() {
        const { response } = result
        return response && response.data
      }
    })
  }
}
