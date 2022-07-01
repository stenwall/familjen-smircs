import React from 'react';
import { formatUnits } from 'ethers/lib/utils';
import { useNetwork } from '@thirdweb-dev/react';
import { ChainIDToName } from '../utils/rpcUtils';
import { ChainId, SUPPORTED_CHAIN_ID } from '@thirdweb-dev/sdk';

const connectorIdToImageUrl: Record<string, string> = {
  MetaMask: 'https://thirdweb.com/logos/metamask-fox.svg',
  WalletConnect: 'https://thirdweb.com/logos/walletconnect-logo.svg',
  'Coinbase Wallet': 'https://thirdweb.com/logos/coinbase-wallet-logo.svg',
  Injected: 'https://thirdweb.com//logos/wallet.png'
};

const MintBtn = ({
  quantity,
  onClickIncrement,
  onClickDecrement,
  onClickMint,
  activeClaimCondition,
  claimNFTLoading,
  priceToMint
}) => {
  const [
    {
      data: { chain: activeChain }
    },
    switchNetwork
  ] = useNetwork();

  // const [{ data, loading }, connect] = useConnect();
  const chainName = ChainIDToName[ChainId.Goerli as SUPPORTED_CHAIN_ID];

  return (
    <div>
      <h3>Quantity</h3>
      <div
      // className={styles.quantityContainer}
      >
        <button
          // className={`${styles.quantityControlButton}`}
          onClick={onClickDecrement}
          disabled={quantity <= 1}
        >
          -
        </button>

        <h4>{quantity}</h4>

        <button
          // className={`${styles.quantityControlButton}`}
          onClick={onClickIncrement}
          disabled={
            quantity >=
            parseInt(activeClaimCondition?.quantityLimitPerTransaction || '0')
          }
        >
          +
        </button>
      </div>

      <button
        // className={`${styles.mainButton} ${styles.spacerTop} ${styles.spacerBottom}`}
        onClick={onClickMint}
        disabled={claimNFTLoading}
      >
        {claimNFTLoading
          ? 'Minting...'
          : `Mint${quantity > 1 ? ` ${quantity}` : ''}${
              activeClaimCondition?.price.eq(0)
                ? ' (Free)'
                : activeClaimCondition?.currencyMetadata.displayValue
                ? ` (${formatUnits(
                    priceToMint,
                    activeClaimCondition.currencyMetadata.decimals
                  )} ${activeClaimCondition?.currencyMetadata.symbol})`
                : ''
            }`}
      </button>
    </div>
  );
};

export default MintBtn;
