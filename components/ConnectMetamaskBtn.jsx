import React from 'react';
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';

const ConnectMetamaskBtn = () => {
  const connectWithMetamask = useMetamask();

  return (
    <>
      <button onClick={connectWithMetamask}>Connect Metamask Wallet</button>
    </>
  );
};

export default ConnectMetamaskBtn;
