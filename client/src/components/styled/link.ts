import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { materialColors } from '../../config/colors';

export const LinkWithoutStyle = styled(Link)`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`;

export const LinkButton = styled(LinkWithoutStyle)`
  background: ${materialColors.blue};
  padding: 0.5rem 1rem 0.5rem 1rem;
  border-radius: 0.5rem;
`;