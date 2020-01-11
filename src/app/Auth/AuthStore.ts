import { action, computed, observable, when } from 'mobx'
import { store } from '@/infrastructure/store/store'
import { AxiosError } from 'axios'
import { WebStorage } from '@/infrastructure/WebStorage'
import { HttpReader, IResource } from '@/infrastructure/resource'
import { HttpClient } from '@/infrastructure/http/HttpClient'
import {auth} from '@/app/Auth/requests/auth';

@store
export class AuthStore {
  @observable private authToken: string | null = null
  @observable private resource: IResource<{token: string}> = {}
  private disposeAuthResource: () => void = () => null

  constructor(
    private http: HttpClient,
    private httpReader: HttpReader,
    private storage: WebStorage
  ) { }

  @action init() {
    this.authToken = this.storage.getItem('authToken')

    this.http.interceptors.request.use(config => {
      if (this.token !== null) {
        if (!config.headers) {
          config.headers = {}
        }
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config
    })

    this.http.interceptors.response.use(undefined, async (error: AxiosError) => {
      if (error.response && error.response.status === 401) {
        this.logout()
      }
      throw error
    })
    return this
  }

  @computed get authenticating() {
    return this.resource.loading
  }

  @computed get token() {
    return this.authToken
  }

  @computed get authenticated() {
    return this.authToken !== null
  }

  @action private setToken(token: string | null) {
    if (token !== null) {
      this.storage.setItem('authToken', token)
    } else {
      this.storage.removeItem('authToken')
    }
    this.authToken = token
  }

  @action login(userName: string) {
    this.disposeAuthResource()
    this.resource = this.httpReader.read(auth(userName))
    this.disposeAuthResource = when(() => !this.resource.loading, () =>
        this.resource.data && this.setToken(this.resource.data.token)
    )
  }

  @action logout() {
    this.disposeAuthResource()
    this.setToken(null)
  }
}
