import React, { useEffect } from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, wait } from '@testing-library/react'
import { useStore, Scope, store, observe } from './'
import { action, observable } from 'mobx'

describe('store', () => {

  @store
  class Tesla {
    readonly model = 3
    @observable isRunning = false
    @action start() {
      this.isRunning = true
    }
    @action stop() {
      this.isRunning = false
    }
  }

  function TeslaTheCar() {
    const { model } = useStore(Tesla)
    return <h1>Model {model}</h1>
  }

  it('requires the stores to be defined', () => {
    expect(() => render(<TeslaTheCar />)).toThrow()
    expect(() => render(
      <Scope store={Tesla}>
        <TeslaTheCar />
      </Scope>)).not.toThrow()
  })

  it('can use simple store in render', () => {
    const { getByRole } = render(
      <Scope store={Tesla}>
        <TeslaTheCar />
      </Scope>
    )
    expect(getByRole('heading')).toHaveTextContent('Model 3')
  })

  it('gets different instances if scoped with <Use>', async () => {
    function TheCar({isRunning}: {isRunning: boolean}) {
      return <h1>The car is {isRunning ? 'running' : 'stopped'}</h1>
    }
    function TeslaSlot() {
      const car = useStore(Tesla)
      return observe(car, ({isRunning}) => <TheCar isRunning={isRunning}/>)
    }
    function TeslaGarage() {
      const tesla = useStore(Tesla)
      useEffect(() => {
        tesla.start()
      }, [])
      return (
        <>
          <TeslaSlot/>
          <Scope store={Tesla}>
            <TeslaSlot/>
          </Scope>
          <TeslaSlot/>
        </>
      )
    }

    const { getAllByRole } = render(
      <Scope store={Tesla}>
        <TeslaGarage/>
      </Scope>
    )
    await wait()
    expect(getAllByRole('heading')[0]).toHaveTextContent('The car is running')
    expect(getAllByRole('heading')[1]).toHaveTextContent('The car is stopped')
    expect(getAllByRole('heading')[2]).toHaveTextContent('The car is running')
  })
})
