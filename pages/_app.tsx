import type { AppProps } from 'next/app';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import '../styles/globals.css';
import Head from 'next/head';
import { css, Global } from '@emotion/react';
import { fontsizeCss } from '../theme/typography';

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
        `}
      />
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
    </>
  );
}

export default MyApp;
