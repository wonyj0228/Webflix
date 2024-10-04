import { css, type CSSObject, type Interpolation } from 'styled-components';

export type Breakpoints =
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'extraLarge';

export const breakpoints: Record<Breakpoints, string> = {
  extraSmall: '@media (max-width: 600px)',
  small: '@media (min-width: 600px)',
  medium: '@media (min-width: 768px)',
  large: '@media (min-width: 992px)',
  extraLarge: '@media (min-width: 1200px)',
};

const media = Object.entries(breakpoints).reduce((acc, [key, value]) => {
  return {
    ...acc,
    [key]: (
      first: CSSObject | TemplateStringsArray,
      ...interpolations: Interpolation<Object>[]
    ) => css`
      ${value} {
        ${css(first, ...interpolations)}
      }
    `,
  };
}, {}) as Record<Breakpoints, any>;

export default media;
