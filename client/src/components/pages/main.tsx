import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomePage } from './home/home';

export const MainRouteSwitch: React.FC = () => {
    return (
        <Switch>
            {/*Final catch-all route*/}
            <Route path="/">
                <HomePage/>
            </Route>
        </Switch>
    );
};