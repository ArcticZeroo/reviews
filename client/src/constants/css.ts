import { materialColors } from '../config/colors';

export const coolTopLeftBorder = `
  border-top: 0.2rem solid ${materialColors.blue};
  border-left: 0.2rem solid ${materialColors.blue};
  border-top-left-radius: 1rem;
  padding: 1rem;
`;

export const spaceBottomOfChildren = `
  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;