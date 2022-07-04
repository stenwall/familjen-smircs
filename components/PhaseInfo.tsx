import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

const PhaseInfo = () => {
  return (
    <>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="center"
        gap={2}
        w="100%"
      >
        <Box
          bg="#DFDFCF"
          w="100%"
          pl="20px"
          pr="10px"
          py="15px"
          color="#000000"
          borderRadius="15px"
          height="100"
        >
          <Text fontSize="10px" align="left" casing="uppercase">
            8 July
            <br />
            11:00 AM PST / 24H
            <br />
            SMIRCS GENESIS HOLDERS
          </Text>
        </Box>
        <Box
          bg="#CFCFB1"
          w="100%"
          pl="20px"
          pr="10px"
          py="15px"
          color="#000000"
          borderRadius="15px"
          height="100"
        >
          <Text fontSize="10px" align="left" casing="uppercase">
            9 July
            <br />
            11:00 AM PST / 24H
            <br />
            PREMINT ACCESSLIST/WL
            <br />
            &#8801; 0.15 ETH
          </Text>
        </Box>
        <Box
          bg="#C3C2AA"
          w="100%"
          pl="20px"
          pr="10px"
          py="15px"
          color="#000000"
          borderRadius="15px"
          height="100"
        >
          <Text fontSize="10px" align="left" casing="uppercase">
            10 July
            <br />
            11:00 AM PST / 24H
            <br />
            Public
            <br />
            &#8801; 0.25 ETH
          </Text>
        </Box>
      </Flex>
    </>
  );
};

export default PhaseInfo;
