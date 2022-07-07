import { Box, Flex, Text } from '@chakra-ui/react';
import { ClaimCondition } from '@thirdweb-dev/sdk';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React from 'react';

interface PhaseInfoProps {
  activeClaim: ClaimCondition;
  allClaims: ClaimCondition[];
}

const PhaseInfo: React.FC<PhaseInfoProps> = ({ activeClaim, allClaims }) => {
  const bnPrice = parseUnits(
    activeClaim?.currencyMetadata.displayValue || '0',
    activeClaim?.currencyMetadata.decimals
  );
  const priceToMint = bnPrice.mul(1);

  const getDate = dateTime => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-GB', {
      timeZone: 'PST',
      day: 'numeric',
      month: 'long'
    });
  };

  const getTime = (thisClaimTime, nextClaimTime?) => {
    const thisTime = new Date(thisClaimTime);
    const time = thisTime.toLocaleString('en-US', {
      timeZone: 'PST',
      hour: '2-digit',
      minute: '2-digit'
    });
    if (nextClaimTime) {
      const nextTime = new Date(nextClaimTime);
      const hours = Math.abs(nextTime.getTime() - thisTime.getTime()) / 36e5;
      return `${time} PST / ${Math.round(hours)}H`;
    }
    return `${time} PST`;
  };

  const getPrice = currencyMetadata => {
    return currencyMetadata.displayValue
      ? `\u2261 ${formatUnits(priceToMint, currencyMetadata.decimals)} ${
          activeClaim?.currencyMetadata.symbol
        }`
      : '';
  };

  const getQuantity = maxQuantity => {
    return maxQuantity === 'unlimited'
      ? maxQuantity
      : `Max ${maxQuantity} / wallet`;
  };

  return (
    <>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        gap={2}
        w="100%"
      >
        {allClaims[1] && (
          <Box
            bg="#DFDFCF"
            w="100%"
            pl="20px"
            pr="10px"
            py="15px"
            color="#000000"
            borderRadius="15px"
            height="110"
          >
            <Text fontSize="10px" align="left" casing="uppercase">
              <>
                {getDate(allClaims[1]?.startTime)}
                <br />
                {getTime(allClaims[1]?.startTime, allClaims[2]?.startTime)}
                <br />
                SMIRCS GENESIS HOLDERS
                <br />
                {getQuantity(allClaims[1]?.maxQuantity)}
              </>
            </Text>
          </Box>
        )}
        {allClaims[2] && (
          <Box
            bg="#CFCFB1"
            w="100%"
            pl="20px"
            pr="10px"
            py="15px"
            color="#000000"
            borderRadius="15px"
            height="110"
          >
            <Text fontSize="10px" align="left" casing="uppercase">
              {getDate(allClaims[2]?.startTime)}
              <br />
              {getTime(allClaims[2]?.startTime, allClaims[3]?.startTime)}
              <br />
              ACCESSLIST/WL
              <br />
              {getPrice(allClaims[2]?.currencyMetadata)}
              <br />
              {getQuantity(allClaims[2]?.maxQuantity)}
            </Text>
          </Box>
        )}
        {allClaims[3] && (
          <Box
            bg="#C3C2AA"
            w="100%"
            pl="20px"
            pr="10px"
            py="15px"
            color="#000000"
            borderRadius="15px"
            height="110"
          >
            <Text fontSize="10px" align="left" casing="uppercase">
              {getDate(allClaims[3]?.startTime)}
              <br />
              {getTime(allClaims[3]?.startTime)}
              <br />
              Public
              <br />
              {getPrice(allClaims[3]?.currencyMetadata)}
              <br />
              {getQuantity(allClaims[3]?.maxQuantity)}
            </Text>
          </Box>
        )}
      </Flex>
    </>
  );
};

export default PhaseInfo;
