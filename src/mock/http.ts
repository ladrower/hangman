import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import {data as wordsList} from './data/words.json'
import { GameService, Word } from '@/mock/game/GameService'
import { HTTPCode } from '@/mock/HTTPCode'

export default {
  ...axios,
  create: (config?: AxiosRequestConfig) => {
    const http = axios.create(config)
    const api = new GameService(localStorage, {
      maxAttempts: 6,
      maxRoundScore: 100,
      words: wordsList as Word[]
    })

    http.get = (path: string, config: AxiosRequestConfig = {}): Promise<any> => {
      config = applyRequestInterceptors(config)
      const token = config.headers &&
        config.headers.Authorization &&
        config.headers.Authorization.split('Bearer ')[1]

      switch (path) {
        case '/game': {
          const { code, data } = api.getGame(token)
          if (code === HTTPCode.OK) {
            return responseSuccess(data)
          }
          return responseError(data, code, config)
        }
        default:
          throw new Error(`No mock provided for the path ${path}`)
      }
    }

    http.post = (path: string, payload: any, config: AxiosRequestConfig = {}): Promise<any> => {
      config = applyRequestInterceptors(config)
      const token = config.headers &&
        config.headers.Authorization &&
        config.headers.Authorization.split('Bearer ')[1]

      switch (path) {
        case '/checkin': {
          const { code, data } = api.checkin(payload.userName)
          if (code === HTTPCode.OK) {
            return responseSuccess(data)
          }
          return responseError(data, code, config)
        }
        case '/game': {
          const { code, data } = api.postGame(token)
          if (code === HTTPCode.OK) {
            return responseSuccess(data)
          }
          return responseError(data, code, config)
        }
        case '/guess': {
          const { code, data } = api.guess(payload.character, token)
          if (code === HTTPCode.OK) {
            return responseSuccess(data)
          }
          return responseError(data, code, config)
        }
        default:
          throw new Error(`No mock provided for the path ${path}`)
      }
    }

    function applyRequestInterceptors(config: AxiosRequestConfig) {
      // keeping auth headers passed directly through config when on Documentation
      const overrideAuth = config.headers && config.headers.Authorization
      const requestInterceptors = http.interceptors.request as unknown as { handlers: any[] }
      requestInterceptors.handlers.forEach(({fulfilled}) => fulfilled && fulfilled(config))
      if (overrideAuth) {
        if (!config.headers) {
          config.headers = {}
        }
        config.headers.Authorization = overrideAuth
      }
      return config
    }

    function responseSuccess<T>(data: T) {
      return new Promise<AxiosResponse<T>>(resolve =>
        setTimeout(() => resolve({
          data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {}
        }), 200 + Math.random() * 300))
    }

    function responseError<T>(data: T, status: HTTPCode, config: AxiosRequestConfig) {
      return new Promise<AxiosResponse<T>>((resolve, reject) =>
        setTimeout(() => reject({
          code: status.toString(),
          response: {
            data,
            status,
            config
          }
        }), 200 + Math.random() * 300)
      ).catch(error => {
        const { handlers } = http.interceptors.response as unknown as { handlers: {rejected: (config:  AxiosError<T>) => any}[] }
        let p = new Promise((resolve, reject) => reject(error))
        handlers.forEach(({rejected}) => {
          if (rejected) {
            p = p.catch(rejected)
          }
        })
        return p
      })
    }
    return http
  }
}
