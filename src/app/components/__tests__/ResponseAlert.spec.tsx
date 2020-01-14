import React from 'react'
import renderer from 'react-test-renderer'
import { ResponseAlert } from '../ResponseAlert'

it('should render nothing when request pending', () => {
    const tree = renderer
        .create(<ResponseAlert resource={{}} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('should render success alert', () => {
    const tree = renderer
        .create(<ResponseAlert resource={{ data: {a: 1, b: 1} }} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('should render failure alert', () => {
    const tree = renderer
        .create(<ResponseAlert resource={{ error: {code: 500, message: 'Internal Server Error'} }} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
