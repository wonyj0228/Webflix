import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from './Routes/Home';
import Search from './Routes/Search';
import { theme } from './theme';
import { RecoilRoot } from 'recoil';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Trend from './Routes/Trend';
import media from './media';

const GlobalStyle = createGlobalStyle`
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-weight: 300;
  font-size : 10px;
  font-family: "Noto Sans", "Noto Sans KR", sans-serif;
  color:${(props) => props.theme.white.default};
  line-height: 1.2;
  background-color: ${(props) => props.theme.black.default};
}
a {
  text-decoration:none;
  color:inherit;
}
::-webkit-scrollbar {
  display: none;
}
html {
  ${media.extraSmall`
    font-size : 12px;
  `}
  ${media.small`
    font-size : 12px;
  `}
  ${media.medium`
    font-size : 12px;
  `}
  ${media.large`
    font-size : 15px;
  `}
  ${media.extraLarge`
    font-size : 17px;
  `}
}
`;

const Router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, path: '/', element: <Home /> },
        { path: '/:movieId', element: <Home /> },
        { path: '/trend', element: <Trend /> },
        { path: '/search', element: <Search /> },
        { path: '/search/:movieId', element: <Search /> },
      ],
    },
  ],
  { basename: process.env.PUBLIC_URL }
);

const client = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <RecoilRoot>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={theme}>
        <ReactQueryDevtools initialIsOpen={true} />
        <GlobalStyle />
        <RouterProvider router={Router} />
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);
