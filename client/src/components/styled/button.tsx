import styled from 'styled-components';
import { materialColors } from '../../config/colors';

export const PrimaryButton = styled.button`
  cursor: pointer;
  background: ${materialColors.blue};
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1rem 0.5rem 1rem;
`;