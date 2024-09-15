import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    black: {
      default: string;
      darker: string;
      lighter: string;
    };
    white: {
      default: string;
    };
    gray: {
      default: string;
    };
  }
}
