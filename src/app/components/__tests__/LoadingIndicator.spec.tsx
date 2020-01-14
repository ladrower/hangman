import React from 'react';
import renderer from 'react-test-renderer';
import { LoadingIndicator } from '../LoadingIndicator'

const Spinner = () => <div>spinner...</div>

it('should render spinner', () => {
    const tree = renderer
        .create(<LoadingIndicator resource={{ loading: true }} component={Spinner}/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('should not render spinner', () => {
    const tree = renderer
        .create(<LoadingIndicator resource={{ loading: false }} component={Spinner}/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
