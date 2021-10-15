import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MainRouteSwitch } from './pages/main';

function App() {
    return (
        <BrowserRouter>
            <MainRouteSwitch/>
        </BrowserRouter>
    );
}

export default App;
