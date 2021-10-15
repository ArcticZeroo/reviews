import React from 'react';
import styled from 'styled-components';
import { Overlay } from '../overlay';

const LoadingTopLayer = styled(Overlay)`
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

/**
 * A loading overlay, which centers a loading icon that is absolutely positioned on top of your other content.
 * To use this overlay, you must set the position of the parent to be relative.
 * @constructor
 */
export const LoadingOverlay: React.FC = () => {
    return (
        <LoadingTopLayer>
            Loading...
        </LoadingTopLayer>
    );
};