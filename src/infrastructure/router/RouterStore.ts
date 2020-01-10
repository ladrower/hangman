import { action } from 'mobx'
import { computed, observable } from 'mobx'
import { History, Location } from '../History'
import { store } from '@/infrastructure/store/store'

@store
export class RouterStore {
  @observable location: Location

  @computed get url() {
    const { pathname, search, hash } = this.location
    return pathname + search + hash
  }

  @action protected updateLocation = (location: Location) => (this.location = location)

  constructor(readonly history: History) {
    this.location = this.history.location
    this.history.listen(this.updateLocation)
  }

  navigate = <T extends {}>(to: string, state?: T) => this.history.push(to, state)
}
