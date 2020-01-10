import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import ReactDOM from 'react-dom'
import axios from 'axios'
import httpMock from '@/mock/http'
import { createBrowserHistory } from 'history'
import { configure } from 'mobx'
import React from 'react'
import { App } from '@/app/App'
import { createNew, injectable, injector } from '@/infrastructure/ioc'
import { History } from '@/infrastructure/History'
import { HttpClient, HttpFactory } from '@/infrastructure/http/HttpClient'
import { Scope } from '@/infrastructure/store'
import { AuthStore } from '@/app/Auth/AuthStore'
import { RouterStore } from '@/infrastructure/router/RouterStore'
import { WebStorage } from '@/infrastructure/WebStorage'

declare global {
  const ENVIRONMENT: 'DEVELOPMENT' | 'PRODUCTION'
  const API_BASE_URL: string
}

configure({
  enforceActions: 'observed'
})

injector
  .provide(History, createBrowserHistory())
  .provide(WebStorage, localStorage)
  .provide(HttpFactory, ENVIRONMENT !== 'PRODUCTION' ? httpMock : axios)

@injectable
export class Application {
  constructor(http: HttpClient) {
    http.configure({
      baseURL: API_BASE_URL
    })
  }

  run() {
    ReactDOM.render(
      <Scope store={[AuthStore, RouterStore]}>
        <App />
      </Scope>,
      document.getElementById('root')
    )
  }
}

createNew(Application).run()
