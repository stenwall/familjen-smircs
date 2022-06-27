import React from 'react';
import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';

const ConnectMetamaskBtn = () => {
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  return (
    <div>
      {address ? (
        <h4>Connected as {address}</h4>
      ) : (
        <button onClick={connectWithMetamask}>Connect Metamask Wallet</button>
      )}
    </div>
  );
};

export default ConnectMetamaskBtn;
