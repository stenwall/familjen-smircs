import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Text
} from '@chakra-ui/react';
import { useConnect, useNetwork } from '@thirdweb-dev/react';
import { SUPPORTED_CHAIN_ID } from '@thirdweb-dev/sdk';
import React from 'react';
import { FiInfo } from 'react-icons/fi';
import { IoSwapHorizontalSharp } from 'react-icons/io5';
import { ChainIDToName, supportedChains } from '../utils/rpcUtils';

interface ConnectWalletButtonProps {
  expectedChainId: number;
}

const connectorIdToImageUrl: Record<string, string> = {
  MetaMask: 'https://thirdweb.com/logos/metamask-fox.svg',
  WalletConnect: 'https://thirdweb.com/logos/walletconnect-logo.svg',
  'Coinbase Wallet': 'https://thirdweb.com/logos/coinbase-wallet-logo.svg',
  Injected: 'https://thirdweb.com//logos/wallet.png'
};

export const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({
  expectedChainId
}) => {
  const [
    {
      data: { chain: activeChain }
    },
    switchNetwork
  ] = useNetwork();

  const [{ data, loading }, connect] = useConnect();
  const chainName = ChainIDToName[expectedChainId as SUPPORTED_CHAIN_ID];

  if (activeChain && expectedChainId !== activeChain.id) {
    if (switchNetwork) {
      return (
        <Stack w="100%">
          <Button
            fontSize="30px"
            w="full"
            bg="#376071"
            color="#FFEC00"
            borderRadius="full"
            _hover={{
              background: '#334D5Bv'
            }}
            _active={{
              background: '#24353F'
            }}
            _focus={{
              background: '#24353F'
            }}
            leftIcon={<IoSwapHorizontalSharp />}
            onClick={() => switchNetwork(expectedChainId)}
          >
            SWITCH NETWORK {chainName ? `TO ${chainName.toUpperCase()}` : ''}
          </Button>
          <Stack
            w="100%"
            direction="row"
            bg={`orange.50`}
            borderRadius="md"
            borderWidth="1px"
            borderColor={`orange.100`}
            align="center"
            padding="10px"
            spacing={3}
          >
            <Icon as={FiInfo} color={`orange.400`} boxSize={6} />
            <Stack>
              <Text color={`orange.800`}>
                You are currently connected to the wrong network. Please switch
                your network to continue.
              </Text>
              <Text color={`orange.800`}>
                If you are using WalletConnect or Coinbase Wallet, you may need
                to manually switch networks on your app.
              </Text>
            </Stack>
          </Stack>
        </Stack>
      );
    }

    return (
      <Alert variant="left-accent" status="warning">
        <AlertIcon />

        <AlertDescription>
          <Text>You wallet is connected to the wrong network.</Text>
          {expectedChainId && (
            <Text>
              Please switch your wallet to{' '}
              <strong>
                {supportedChains.find(c => c.id === expectedChainId)?.name}
              </strong>
              .
            </Text>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Menu matchWidth>
      <MenuButton
        fontSize="40px"
        isLoading={loading}
        as={Button}
        bg="#376071"
        color="#FFEC00"
        py="2px"
        px="10px"
        borderRadius="full"
        _hover={{
          background: '#334D5B'
        }}
        _active={{
          background: '#24353F'
        }}
        _focus={{
          background: '#24353F'
        }}
        w="full"
        rightIcon={<ChevronDownIcon />}
      >
        CONNECT WALLET
      </MenuButton>

      <MenuList bg="#DFDFD0" border="0">
        <Flex
          bg="#DFDFD0"
          direction={{ base: 'column', md: 'row' }}
          gap={2}
          px={3}
        >
          {data.connectors
            .filter(c => c.ready)
            .map(_connector => {
              if (!_connector.ready) {
                return null;
              }

              return (
                <Button
                  fontSize="22px"
                  flexGrow={1}
                  size="sm"
                  // variant="outline"
                  bg="#CFCFB1"
                  _hover={{
                    background: '#ECECE1'
                  }}
                  _active={{
                    background: '#ECECE1'
                  }}
                  _focus={{
                    background: '#ECECE1'
                  }}
                  key={_connector.name}
                  isLoading={
                    loading && data?.connector?.name === _connector?.name
                  }
                  onClick={() => connect(_connector)}
                  leftIcon={
                    <Image
                      maxWidth={6}
                      src={
                        Object.keys(connectorIdToImageUrl).includes(
                          _connector.name
                        )
                          ? connectorIdToImageUrl[_connector.name]
                          : connectorIdToImageUrl['Injected']
                      }
                      alt={_connector.name}
                    />
                  }
                >
                  {_connector.name !== 'Injected'
                    ? _connector.name
                    : 'Mobile Wallet'}
                </Button>
              );
            })}
        </Flex>
      </MenuList>
    </Menu>
  );
};
