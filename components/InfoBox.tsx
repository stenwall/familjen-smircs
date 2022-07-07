import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { ClaimCondition } from '@thirdweb-dev/sdk';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

interface InfoBoxProps {
  activeClaim: ClaimCondition;
  allClaims: ClaimCondition[];
  name: string;
  isSoldOut: boolean;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  activeClaim,
  allClaims,
  name,
  isSoldOut
}) => {
  const quantityLimitPerTransaction = activeClaim?.quantityLimitPerTransaction;
  const bnPrice = parseUnits(
    activeClaim?.currencyMetadata.displayValue || '0',
    activeClaim?.currencyMetadata.decimals
  );
  const priceToMint = bnPrice.mul(1);

  const activeMintPrice = activeClaim?.price.eq(0)
    ? '0 ETH'
    : activeClaim?.currencyMetadata.displayValue
    ? ` ${formatUnits(priceToMint, activeClaim.currencyMetadata.decimals)} ${
        activeClaim?.currencyMetadata.symbol
      }`
    : '';

  const activeMintPhase = () => {
    switch (activeClaim.startTime.toUTCString()) {
      case allClaims[1].startTime.toUTCString():
        return 'SMIRCS GENESIS HOLDERS';
      case allClaims[2].startTime.toUTCString():
        return 'ACCESSLIST/WL';
      case allClaims[3].startTime.toUTCString():
        return 'PUBLIC';
      default:
        return '';
    }
  };

  if (isSoldOut) {
    return (
      <Box
        bg="#DC6051"
        w="100%"
        py="10px"
        px="20px"
        color="#FFEC00"
        borderRadius="15px"
        height="fit-content"
      >
        <Text
          fontSize="40px"
          color="#FFEC00"
          align="center"
          casing="uppercase"
          m="0"
        >
          SOLD OUT
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg="#DC6051"
      w="100%"
      py="10px"
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
        {name}
      </Text>
      <Text
        fontSize="10px"
        color="#FFEC00"
        align="left"
        casing="uppercase"
        mb="10px"
      >
        MAX MINT/ {quantityLimitPerTransaction} PER WALLET
      </Text>
      <Flex
        color="#FFEC00"
        gap="2px"
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Box maxW="150px">
          <Flex flexDir="column" mb="10px">
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
        </Box>
        <Box w="100%">
          <Flex flexDir="column" mb="20px">
            <Text fontSize="12px" color="#FFEC00" align="left" pb="7px">
              Total
            </Text>
            <Text
              fontSize="15px"
              color="#FFEC00"
              align="left"
              overflow="hidden"
            >
              {`= ${activeMintPrice} ${activeMintPhase()}`}
            </Text>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default InfoBox;
