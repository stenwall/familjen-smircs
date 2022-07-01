import type { AppProps } from 'next/app';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import '../styles/globals.css';
import Head from 'next/head';
import { css, Global } from '@emotion/react';
import { fontsizeCss } from '../theme/typography';
import { ChakraProvider } from '@chakra-ui/react';
import chakraTheme from '../theme/index'

function MyApp({ Component, pageProps }: AppProps) {
  const activeChainId = ChainId.Goerli;

  return (
    <>
      <Global
        styles={css`
          :host,
          :root {
            ${fontsizeCss};
          }
          ,
          /* latin */
          @font-face {
            font-family: 'Merchant copy';
            src: url('https://uploads-ssl.webflow.com/6278d92c988fe4187644f025/6278d92c988fe4d07e44f033_MERCHANT-COPY.REGULAR.TTF')
              format('truetype');
            font-weight: 600;
            font-style: normal;
            font-display: swap;
          }
        `}
      />
      <ChakraProvider theme={chakraTheme}>
        <ThirdwebProvider desiredChainId={activeChainId}>
          <Head>
            <title>SMIRCS NFT DROP</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <Component {...pageProps} />
        </ThirdwebProvider>
      </ChakraProvider>
    </>
  );
}

export default MyApp;
