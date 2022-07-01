import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text
} from '@chakra-ui/react';
import {
  ChainId,
  useContractMetadata,
  useNFTDrop,
  useActiveClaimCondition
} from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import React from 'react';
import ClaimButton from '../components/ClaimButton';
// import { Footer } from '../components/Footer';
// import { Header } from '../components/Header';
// import { DropSvg } from '../components/svg/drop';

const contractAddress = '0xB1709c0Cd6452562F0f13b75FE49c6912b3C2059';
const activeChainId = ChainId.Goerli;

const Home: NextPage = () => {
  const contract = useNFTDrop(contractAddress);
  const activeClaimCondition = useActiveClaimCondition(contract);
  const tokenAddress = activeClaimCondition?.data?.currencyAddress;
  const { data: metadata, isLoading } = useContractMetadata(
    contract?.getAddress()
  );

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
            {/* <Grid
              bg="#F2F0FF"
              border="1px solid rgba(0,0,0,.1)"
              borderRadius="20px"
              w="178px"
              h="178px"
              placeContent="center"
              overflow="hidden"
            >
            </Grid> */}
            <ClaimButton contract={contract} expectedChainId={activeChainId} />
            <Box
              bg="#DC6051"
              w="100%"
              p={2}
              color="#FFEC00"
              borderRadius="15px"
            >
              <Text
                size="display.md"
                fontWeight="title"
                as="h1"
                align="center"
                casing="uppercase"
              >
                {metadata?.name}
              </Text>
            </Box>
            {metadata?.description && (
              <Heading noOfLines={2} as="h2" size="subtitle.md">
                {metadata.description}
              </Heading>
            )}
          </Flex>
        </Center>
      </Flex>
      {/* <Footer /> */}
    </Flex>
  );
};

export default Home;
