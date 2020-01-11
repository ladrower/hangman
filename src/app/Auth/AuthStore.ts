import { action, computed, observable, reaction } from 'mobx'
import { store } from '@/infrastructure/store/store'
import { AxiosError } from 'axios'
import { WebStorage } from '@/infrastructure/WebStorage'
import { HttpReader, IResource } from '@/infrastructure/resource'
import { HttpClient } from '@/infrastructure/http/HttpClient'
import { login } from '@/app/Auth/requests/login';
import { logout } from '@/app/Auth/requests/logout';

@store
export class AuthStore {
  @observable private authToken: string | null = null
  @observable private resource: IResource<{token: string}> = {}

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
    this.resource = this.httpReader.read(login(userName))
    reaction(() => this.resource.data || this.resource, (_, subscription) => {
      const { data } = this.resource
      subscription.dispose()
      return data && this.setToken(data.token)
    })
  }

  @action logout() {
    this.httpReader.read(logout())
    this.resource = {}
    this.setToken(null)
  }
}
