import React from 'react';
import renderer from 'react-test-renderer';
import { LoadingIndicator } from '../LoadingIndicator'

it('should render spinner', () => {
    const Spinner = () => <div>spinner...</div>
    const tree = renderer
        .create(<LoadingIndicator resource={{ loading: true }} component={Spinner}/>)
        .toJSON();
    expect(tree).toMatchSnapshot();
});
