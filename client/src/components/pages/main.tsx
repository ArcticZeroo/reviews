import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { HomePage } from './home/home';
import { VisitLog } from './log/visit-log';

export const MainRouteSwitch: React.FC = () => {
    return (
        <Switch>
            <Route path="/log" exact>
                <VisitLog/>
            </Route>
            {/*Final catch-all route*/}
            <Route path="/">
                <HomePage/>
            </Route>
        </Switch>
    );
};