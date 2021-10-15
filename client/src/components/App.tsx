import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { MainRouteSwitch } from './pages/main';
import styled from 'styled-components';
import { materialColors } from '../config/colors';
import { LinkWithoutStyle } from './styled/link';

const AppPageContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 1rem;
  box-sizing: border-box;
  background: ${materialColors.almostBlack};
  color: #FAFAFA;
`;

const AppNavBar = styled.ul`
  display: flex;
  list-style-type: none;
  margin-bottom: 1rem;
`;

const AppNavBarLink = styled(LinkWithoutStyle)`
  padding: 0.5rem;
  border: 0.1rem solid #EEE;
  border-radius: 0.5rem;
  transition: all 0.25s ease;
  
  &:hover {
    background: #EEE;
    border-color: ${materialColors.almostBlack};
    color: ${materialColors.almostBlack};
  }
`;

function App() {
    return (
        <BrowserRouter>
            <AppPageContainer>
                <AppNavBar>
                    <AppNavBarLink to="/">
                        Home
                    </AppNavBarLink>
                </AppNavBar>
                <MainRouteSwitch/>
            </AppPageContainer>
        </BrowserRouter>
    );
}

export default App;
