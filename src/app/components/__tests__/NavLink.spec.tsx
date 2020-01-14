import React from 'react'
import renderer from 'react-test-renderer'
import { NavLink } from '../NavLink'
import { Scope } from '@/infrastructure/store';
import { RouterStore } from '@/infrastructure/router/RouterStore';
import { injector } from '@/infrastructure/ioc';
import { History } from '@/infrastructure/History';
import { createMemoryHistory } from 'history';

afterEach(() => {
    injector.invalidate(History)
})

it('should render navigation link', () => {
    injector
        .provide(History, createMemoryHistory())

    const tree = renderer
        .create(
            <Scope store={RouterStore}>
                <NavLink to='/'>Home</NavLink>
            </Scope>
        )
        .toJSON()
    expect(tree).toMatchSnapshot()
})
