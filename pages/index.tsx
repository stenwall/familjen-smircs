import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react';
import {
  ChainId,
  useContractMetadata,
  useNFTDrop,
  useActiveClaimCondition,
  useAddress,
  useContractData,
  useContract,
  useClaimConditions
} from '@thirdweb-dev/react';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import type { NextPage } from 'next';
import React, { useMemo } from 'react';
import ClaimButton from '../components/ClaimButton';
// import { Footer } from '../components/Footer';
// import { Header } from '../components/Header';
// import { DropSvg } from '../components/svg/drop';

// const contractAddress = '0xB1709c0Cd6452562F0f13b75FE49c6912b3C2059';
const contractAddress = '0x8c9569C3192B33C7602e376Ee351F694386B00d0';

const activeChainId = ChainId.Goerli;

const Home: NextPage = () => {
  const address = useAddress();
  const contract = useNFTDrop(contractAddress);
  const activeClaimCondition = useActiveClaimCondition(contract);
  const claimConditions = useClaimConditions(contract);
  const tokenAddress = activeClaimCondition?.data?.currencyAddress;
  console.log('activeClaimCondition', activeClaimCondition);
  console.log('claimConditions', claimConditions);
  const contractData = useContract(contractAddress);
  console.log('contractData', contractData.contract);
  // const contractMetaData = useContractMetadata

  const quantityLimitPerTransaction =
    activeClaimCondition.data?.quantityLimitPerTransaction;

  const snapshot = activeClaimCondition.data?.snapshot;

  const useDefault = useMemo(
    () =>
      !snapshot ||
      snapshot?.find(user => user.address === address)?.maxClaimable === '0',
    [snapshot, address]
  );

  const maxClaimable2 = isNaN(Number(quantityLimitPerTransaction))
    ? quantityLimitPerTransaction
    : Number(quantityLimitPerTransaction);

  const maxClaimable = useDefault
    ? isNaN(Number(quantityLimitPerTransaction))
      ? 1000
      : Number(quantityLimitPerTransaction)
    : Number(snapshot?.find(user => user.address === address)?.maxClaimable);

  console.log('useDefault', useDefault);
  console.log('snapshot', snapshot);
  console.log('maxClaimable2', maxClaimable2);
  console.log('maxClaimable', maxClaimable);

  const bnPrice = parseUnits(
    activeClaimCondition.data?.currencyMetadata.displayValue || '0',
    activeClaimCondition.data?.currencyMetadata.decimals
  );
  const priceToMint = bnPrice.mul(1);
  const { data: metadata, isLoading } = useContractMetadata(
    contract?.getAddress()
  );
  console.log('contractMetaaata', metadata)

  if (isLoading) {
    return (
      <Center w="100%" h="100%">
        <Stack direction="row" align="center">
          <Spinner />
          <Heading size="label.sm">Loading...</Heading>
        </Stack>
      </Center>
    );
  }

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      right={0}
      flexDir="column"
      // borderRadius="1rem"
      overflow="hidden"
      // shadow="0px 1px 1px rgba(0,0,0,0.1)"
      // border="1px solid"
      // borderColor="blackAlpha.100"
      bg="#ECECE1"
    >
      {/* <Header tokenAddress={tokenAddress} /> */}
      <Flex as="main" px="28px" w="100%" flexGrow={1}>
        <Center w="100%" h="100%">
          <Flex direction="column" align="center" gap={4} w="100%">
            <ClaimButton contract={contract} expectedChainId={activeChainId} />
            <Box
              bg="#DC6051"
              w="100%"
              py="2px"
              px="20px"
              color="#FFEC00"
              borderRadius="15px"
              height="fit-content"
            >
              <Text
                fontSize="20px"
                color="#FFEC00"
                align="center"
                casing="uppercase"
                m="0"
              >
                {metadata?.name}
              </Text>
              <Text
                fontSize="10px"
                color="#FFEC00"
                align="left"
                casing="uppercase"
              >
                MAX MINT/ {quantityLimitPerTransaction} PER WALLET
              </Text>
              {/* -- BYT UT GRID MOT FLEX
              -- row-wrap */}
              <Grid
                color="#FFEC00"
                templateColumns={'150px auto'}
                gap="2px"
                placeContent="left"
                pb="20px"
              >
                <GridItem w="100%" h="10">
                  <Flex flexDir="column">
                    <Text fontSize="12px" color="#FFEC00" align="left" pb="7px">
                      Amount
                    </Text>
                    <Text
                      fontSize="15px"
                      color="#FFEC00"
                      align="left"
                      overflow="hidden"
                      whiteSpace="nowrap"
                    >
                      1 X SMIRCS..............................
                    </Text>
                  </Flex>
                </GridItem>
                <GridItem w="100%" h="10">
                  <Flex flexDir="column">
                    <Text fontSize="12px" color="#FFEC00" align="left" pb="7px">
                      Total
                    </Text>
                    <Text
                      fontSize="15px"
                      color="#FFEC00"
                      align="left"
                      overflow="hidden"
                    >
                      {`= ${
                        activeClaimCondition.data?.price.eq(0)
                          ? '0 ETH'
                          : activeClaimCondition.data?.currencyMetadata
                              .displayValue
                          ? ` ${formatUnits(
                              priceToMint,
                              activeClaimCondition.data.currencyMetadata
                                .decimals
                            )} ${
                              activeClaimCondition.data?.currencyMetadata.symbol
                            }`
                          : ''
                      }
                      (PHASE-NAME/NO?)`}
                    </Text>
                  </Flex>
                </GridItem>
              </Grid>
            </Box>
          </Flex>
        </Center>
      </Flex>
    </Flex>
  );
};

export default Home;
