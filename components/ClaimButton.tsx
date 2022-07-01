import {
  Button,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react';
import {
  useActiveClaimCondition,
  useAddress,
  useChainId,
  useClaimedNFTSupply,
  useClaimIneligibilityReasons,
  useClaimNFT,
  useUnclaimedNFTSupply
} from '@thirdweb-dev/react';
import { NFTDrop } from '@thirdweb-dev/sdk';
import { parseUnits, formatUnits } from 'ethers/lib/utils';
import { useMemo, useRef, useState } from 'react';
import { IoDiamondOutline } from 'react-icons/io5';
import { parseIneligibility } from '../utils/parseIneligibility';
import { ConnectWalletButton } from './ConnectWalletButton';

interface ClaimButtonProps {
  contract?: NFTDrop;
  expectedChainId: number;
}

const ClaimButton: React.FC<ClaimButtonProps> = ({
  contract,
  expectedChainId
}) => {
  const address = useAddress();
  const chainId = useChainId();
  const [quantity, setQuantity] = useState(1);
  const loaded = useRef(false);
  const toast = useToast();

  const activeClaimCondition = useActiveClaimCondition(contract);
  const claimIneligibilityReasons = useClaimIneligibilityReasons(contract, {
    quantity,
    walletAddress: address
  });
  const unclaimedSupply = useUnclaimedNFTSupply(contract);
  const claimedSupply = useClaimedNFTSupply(contract);
  const claimMutation = useClaimNFT(contract);

  // Enable all queries
  const isEnabled = !!contract && !!address && chainId === expectedChainId;

  const bnPrice = parseUnits(
    activeClaimCondition.data?.currencyMetadata.displayValue || '0',
    activeClaimCondition.data?.currencyMetadata.decimals
  );
  const priceToMint = bnPrice.mul(quantity);

  const quantityLimitPerTransaction =
    activeClaimCondition.data?.quantityLimitPerTransaction;

  const snapshot = activeClaimCondition.data?.snapshot;

  const useDefault = useMemo(
    () =>
      !snapshot ||
      snapshot?.find(user => user.address === address)?.maxClaimable === '0',
    [snapshot, address]
  );

  const maxClaimable = useDefault
    ? isNaN(Number(quantityLimitPerTransaction))
      ? 1000
      : Number(quantityLimitPerTransaction)
    : Number(snapshot?.find(user => user.address === address)?.maxClaimable);

  const lowerMaxClaimable = Math.min(
    maxClaimable,
    unclaimedSupply.data?.toNumber() || 1000
  );

  const claim = async () => {
    claimMutation.mutate(
      { to: address as string, quantity },
      {
        onSuccess: () => {
          toast({
            title: 'Successfully claimed.',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
        },
        onError: err => {
          console.error(err);
          toast({
            title: 'Failed to claim drop.',
            status: 'error',
            duration: 9000,
            isClosable: true
          });
        }
      }
    );
  };

  // Only sold out when available data is loaded
  const isSoldOut = unclaimedSupply.data?.eq(0);

  const isLoading = claimIneligibilityReasons.isLoading && !loaded.current;

  const canClaim =
    !isSoldOut && !!address && !claimIneligibilityReasons.data?.length;

  if (!isEnabled) {
    return <ConnectWalletButton expectedChainId={expectedChainId} />;
  }

  return (
    <Stack spacing={4} align="center" w="100%">
      <Flex w="100%" direction={{ base: 'column', md: 'row' }} gap={2}>
        <NumberInput
          inputMode="numeric"
          value={quantity}
          onChange={(stringValue, value) => {
            if (stringValue === '') {
              setQuantity(1);
            } else {
              setQuantity(value);
            }
          }}
          min={1}
          max={lowerMaxClaimable}
          maxW={{ base: '100%', md: '100px' }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button
          fontSize={{ base: 'label.md', md: 'label.lg' }}
          isLoading={claimMutation.isLoading || isLoading}
          isDisabled={!canClaim}
          leftIcon={<IoDiamondOutline />}
          onClick={claim}
          w="100%"
          colorScheme="blue"
        >
          {isSoldOut
            ? 'Sold out'
            : canClaim
            ? `Mint${quantity > 1 ? ` ${quantity}` : ''}${
                activeClaimCondition.data?.price.eq(0)
                  ? ' (Free)'
                  : activeClaimCondition.data?.currencyMetadata.displayValue
                  ? ` (${formatUnits(
                      priceToMint,
                      activeClaimCondition.data.currencyMetadata.decimals
                    )} ${activeClaimCondition.data?.currencyMetadata.symbol})`
                  : ''
              }`
            : claimIneligibilityReasons.data?.length
            ? parseIneligibility(claimIneligibilityReasons.data, quantity)
            : 'Minting Unavailable'}
        </Button>
      </Flex>
      {claimedSupply.data && (
        <Text size="label.md" color="green.800">
          {`${claimedSupply.data?.toString()} / ${(
            claimedSupply.data?.add(unclaimedSupply.data || 0) || 0
          ).toString()} claimed`}
        </Text>
      )}
    </Stack>
  );
};

export default ClaimButton;
