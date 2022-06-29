import {
  Button,
  Center,
  ChakraProvider,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { css, Global } from "@emotion/react";
import {
  ThirdwebProvider,
  useActiveClaimCondition,
  useAddress,
  useChainId,
  useClaimedNFTSupply,
  useClaimIneligibilityReasons,
  useClaimNFT,
  useContractMetadata,
  useNFTDrop,
  useUnclaimedNFTSupply,
} from "@thirdweb-dev/react";
import { IpfsStorage, NFTDrop } from "@thirdweb-dev/sdk";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import React, { useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { IoDiamondOutline } from "react-icons/io5";
import { ConnectWalletButton } from "../shared/connect-wallet-button";
import { Footer } from "../shared/footer";
import { Header } from "../shared/header";
import { DropSvg } from "../shared/svg/drop";
import chakraTheme from "../shared/theme";
import { fontsizeCss } from "../shared/theme/typography";
import { parseIneligibility } from "../utils/parseIneligibility";
import { parseIpfsGateway } from "../utils/parseIpfsGateway";

interface ClaimPageProps {
  contract?: NFTDrop;
  expectedChainId: number;
}

const ClaimButton: React.FC<ClaimPageProps> = ({
  contract,
  expectedChainId,
}) => {
  const address = useAddress();
  const chainId = useChainId();
  const [quantity, setQuantity] = useState(1);
  const loaded = useRef(false);
  const toast = useToast();

  const activeClaimCondition = useActiveClaimCondition(contract);
  const claimIneligibilityReasons = useClaimIneligibilityReasons(contract, {
    quantity,
    walletAddress: address,
  });
  const unclaimedSupply = useUnclaimedNFTSupply(contract);
  const claimedSupply = useClaimedNFTSupply(contract);
  const claimMutation = useClaimNFT(contract);

  // Enable all queries
  const isEnabled = !!contract && !!address && chainId === expectedChainId;

  const bnPrice = parseUnits(
    activeClaimCondition.data?.currencyMetadata.displayValue || "0",
    activeClaimCondition.data?.currencyMetadata.decimals,
  );
  const priceToMint = bnPrice.mul(quantity);

  const claim = async () => {
    claimMutation.mutate(
      { to: address as string, quantity },
      {
        onSuccess: () => {
          toast({
            title: "Successfully claimed.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
        onError: (err) => {
          console.error(err);
          toast({
            title: "Failed to claim drop.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        },
      },
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
      <Flex w="100%" direction={{ base: "column", md: "row" }} gap={2}>
        <NumberInput
          inputMode="numeric"
          value={quantity}
          onChange={(stringValue, value) => {
            if (stringValue === "") {
              setQuantity(1);
            } else {
              setQuantity(value);
            }
          }}
          min={1}
          max={1000}
          maxW={{ base: "100%", md: "100px" }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button
          fontSize={{ base: "label.md", md: "label.lg" }}
          isLoading={claimMutation.isLoading || isLoading}
          isDisabled={!canClaim}
          leftIcon={<IoDiamondOutline />}
          onClick={claim}
          w="100%"
          colorScheme="blue"
        >
          {isSoldOut
            ? "Sold out"
            : canClaim
            ? `Mint${quantity > 1 ? ` ${quantity}` : ""}${
                activeClaimCondition.data?.price.eq(0)
                  ? " (Free)"
                  : activeClaimCondition.data?.currencyMetadata.displayValue
                  ? ` (${formatUnits(
                      priceToMint,
                      activeClaimCondition.data.currencyMetadata.decimals,
                    )} ${activeClaimCondition.data?.currencyMetadata.symbol})`
                  : ""
              }`
            : claimIneligibilityReasons.data?.length
            ? parseIneligibility(claimIneligibilityReasons.data, quantity)
            : "Minting Unavailable"}
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

const ClaimPage: React.FC<ClaimPageProps> = ({ contract, expectedChainId }) => {
  const { data: metadata, isLoading } = useContractMetadata(
    contract?.getAddress(),
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
    <Center w="100%" h="100%">
      <Flex direction="column" align="center" gap={4} w="100%">
        <Grid
          bg="#F2F0FF"
          border="1px solid rgba(0,0,0,.1)"
          borderRadius="20px"
          w="178px"
          h="178px"
          placeContent="center"
          overflow="hidden"
        >
          {metadata?.image ? (
            <Image
              objectFit="contain"
              w="100%"
              h="100%"
              src={metadata?.image}
              alt={metadata?.name}
            />
          ) : (
            <Icon maxW="100%" maxH="100%" as={DropSvg} />
          )}
        </Grid>
        <Heading size="display.md" fontWeight="title" as="h1">
          {metadata?.name}
        </Heading>
        {metadata?.description && (
          <Heading noOfLines={2} as="h2" size="subtitle.md">
            {metadata.description}
          </Heading>
        )}
        <ClaimButton contract={contract} expectedChainId={expectedChainId} />
      </Flex>
    </Center>
  );
};

interface BodyProps {
  children?: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => {
  return (
    <Flex as="main" px="28px" w="100%" flexGrow={1}>
      {children}
    </Flex>
  );
};

interface NFTDropEmbedProps {
  contractAddress: string;
  expectedChainId: number;
}

const NFTDropEmbed: React.FC<NFTDropEmbedProps> = ({
  contractAddress,
  expectedChainId,
}) => {
  const nftDrop = useNFTDrop(contractAddress);
  const activeClaimCondition = useActiveClaimCondition(nftDrop);
  const tokenAddress = activeClaimCondition?.data?.currencyAddress;

  return (
    <Flex
      position="fixed"
      top={0}
      left={0}
      bottom={0}
      right={0}
      flexDir="column"
      borderRadius="1rem"
      overflow="hidden"
      shadow="0px 1px 1px rgba(0,0,0,0.1)"
      border="1px solid"
      borderColor="blackAlpha.100"
      bg="white"
    >
      <Header tokenAddress={tokenAddress} />
      <Body>
        <ClaimPage contract={nftDrop} expectedChainId={expectedChainId} />
      </Body>
      <Footer />
    </Flex>
  );
};

const urlParams = new URL(window.location.toString()).searchParams;

const App: React.FC = () => {
  const expectedChainId = Number(urlParams.get("chainId"));
  const contractAddress = urlParams.get("contract") || "";
  const rpcUrl = urlParams.get("rpcUrl") || "";
  const relayerUrl = urlParams.get("relayUrl") || "";

  const ipfsGateway = parseIpfsGateway(urlParams.get("ipfsGateway") || "");

  const sdkOptions = useMemo(
    () =>
      relayerUrl
        ? {
            gasless: {
              openzeppelin: { relayerUrl },
            },
          }
        : undefined,
    [relayerUrl],
  );

  return (
    <>
      <Global
        styles={css`
          :host,
          :root {
            ${fontsizeCss};
          }
        `}
      />
      <ChakraProvider theme={chakraTheme}>
        <ThirdwebProvider
          desiredChainId={expectedChainId}
          sdkOptions={sdkOptions}
          storageInterface={
            ipfsGateway ? new IpfsStorage(ipfsGateway) : undefined
          }
          chainRpc={{ [expectedChainId]: rpcUrl }}
        >
          <NFTDropEmbed
            contractAddress={contractAddress}
            expectedChainId={expectedChainId}
          />
        </ThirdwebProvider>
      </ChakraProvider>
    </>
  );
};

const container = document.getElementById("root") as Element;
const root = createRoot(container);
root.render(<App />);