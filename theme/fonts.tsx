import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'Merchant copy';
        src: url('https://uploads-ssl.webflow.com/6278d92c988fe4187644f025/6278d92c988fe4d07e44f033_MERCHANT-COPY.REGULAR.TTF') format('truetype');
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }
      `}
  />
);

export default Fonts;
