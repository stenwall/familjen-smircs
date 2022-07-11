import { Box, Flex, Heading, Spinner, Stack, Text } from '@chakra-ui/react';
import {
  ChainId,
  useContractMetadata,
  useNFTDrop,
  useActiveClaimCondition,
  useClaimConditions,
  useUnclaimedNFTSupply
} from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import React from 'react';
import ClaimButton from '../components/ClaimButton';
import InfoBox from '../components/InfoBox';
import PhaseInfo from '../components/PhaseInfo';

// const contractAddress = '0xB1709c0Cd6452562F0f13b75FE49c6912b3C2059';
const contractAddress = '0x8c9569C3192B33C7602e376Ee351F694386B00d0';
// const contractAddress = '0x2EcB2cBEBDDc0b1fd8132946ec2DCB84bcceBB71';

const activeChainId = ChainId.Goerli;

const Home: NextPage = () => {
  const contract = useNFTDrop(contractAddress);
  const { data: activeClaim, isLoading: activeClaimLoading } =
    useActiveClaimCondition(contract);
  const { data: allClaims, isLoading: allClaimsLoading } =
    useClaimConditions(contract);
  const { data: metadata, isLoading: metadataLoading } = useContractMetadata(
    contract?.getAddress()
  );
  const unclaimedSupply = useUnclaimedNFTSupply(contract);

  if (metadataLoading || allClaimsLoading || activeClaimLoading) {
    return (
      <Flex
        position="fixed"
        top={0}
        left={0}
        bottom={0}
        right={0}
        justifyContent="center"
        alignItems="flex-start"
        overflow="hidden"
        bg="#ECECE1"
        mt={20}
      >
        <Stack direction="row" align="center">
          <Spinner />
          <Heading fontSize="52px">LOADING...</Heading>
        </Stack>
      </Flex>
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
      overflow="hidden"
      bg="#ECECE1"
    >
      <Flex as="main" px="15px" w="100%" flexGrow={1}>
        <Flex direction="column" align="center" gap={4} w="100%">
          <ClaimButton contract={contract} expectedChainId={activeChainId} />
          <PhaseInfo activeClaim={activeClaim} allClaims={allClaims} />
          <Box
            bg="#DFDFCF"
            w="100%"
            py="10px"
            px="20px"
            borderRadius="15px"
            height="fit-content"
          >
            <Text fontSize="10px" align="center" casing="uppercase">
              To ensure fairness, we will shuffle the order of the NFT&apos;s and
              randomise them before the reveal.
            </Text>
          </Box>
          <InfoBox
            activeClaim={activeClaim}
            allClaims={allClaims}
            name={metadata?.name}
            isSoldOut={unclaimedSupply.data?.eq(0)}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Home;
