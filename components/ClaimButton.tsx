import {
  Button,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
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
import { FiMinus, FiPlus } from 'react-icons/fi';
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

  const stepperButtonStyles = {
    width: `30px`,
    height: `30px`,
    overflow: `hidden`,
    margin: `0`,
    backgroundColor: `#376071`,
    color: `#FFEC00`,
    border: `0`,
    borderRadius: `50%`,
    fontSize: `30px`,
    // padding: `10px`,
    // textAlign: `center`,
    display: `grid`,
    alignContent: `center`,
    alignItems: `center`,
    justifyContent: `center`,
    justifyItems: `center`
  };

  if (!isEnabled) {
    return <ConnectWalletButton expectedChainId={expectedChainId} />;
  }

  return (
    <>
      <Stack spacing={4} align="center" w="100%">
        <Flex w="100%" direction="row" gap={5}>
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
            maxW="100px"
            style={{
              display: `grid`,
              gridTemplateColumns: `20px 50px 20px`,
              alignContent: `center`,
              alignItems: `center`,
              justifyContent: `center`,
              justifyItems: `center`,
              gridGap: `5px`
            }}
          >
            {/* <NumberInputStepper> */}
            <NumberDecrementStepper style={{ ...stepperButtonStyles }}>
              <FiMinus />
            </NumberDecrementStepper>
            <NumberInputField
              style={{
                border: `none`,
                textAlign: `center`,
                padding: `0`,
                fontSize: `20px`
              }}
            />
            <NumberIncrementStepper style={{ ...stepperButtonStyles }}>
              <FiPlus />
            </NumberIncrementStepper>

            {/* </NumberInputStepper> */}
          </NumberInput>
          <Button
            fontSize="30px"
            isLoading={claimMutation.isLoading || isLoading}
            isDisabled={!canClaim}
            leftIcon={<IoDiamondOutline />}
            onClick={claim}
            bg="#376071"
            color="#FFEC00"
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
          >
            {isSoldOut
              ? 'SOLD OUT'
              : canClaim
              ? `MINT${quantity > 1 ? ` ${quantity}` : ''}${
                  activeClaimCondition.data?.price.eq(0)
                    ? ' (FREE)'
                    : activeClaimCondition.data?.currencyMetadata.displayValue
                    ? ` (${formatUnits(
                        priceToMint,
                        activeClaimCondition.data.currencyMetadata.decimals
                      )} ${activeClaimCondition.data?.currencyMetadata.symbol})`
                    : ''
                }`
              : claimIneligibilityReasons.data?.length
              ? parseIneligibility(claimIneligibilityReasons.data, quantity)
              : 'MINTING UNAVAILABLE'}
          </Button>
        </Flex>
      </Stack>
      {claimedSupply.data && (
        <Text size="30px" align="left" alignSelf="flex-start">
          {`MINT ${claimedSupply.data?.toString()}/${(
            claimedSupply.data?.add(unclaimedSupply.data || 0) || 0
          ).toString()}`}
        </Text>
      )}
    </>
  );
};

export default ClaimButton;
