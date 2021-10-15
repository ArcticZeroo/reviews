import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MainRouteSwitch } from './pages/main';
import styled from 'styled-components';

const AppPageContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
`;

function App() {
    return (
        <BrowserRouter>
            <AppPageContainer>
                <MainRouteSwitch/>
            </AppPageContainer>
        </BrowserRouter>
    );
}

export default App;
