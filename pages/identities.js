import Head from "next/head";
import styles from "../styles/Identities.module.css";
import {
  useConnectors,
  useStarknet,
  useStarknetInvoke,
  useStarknetTransactionManager,
} from "@starknet-react/core";
import Button from "../components/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import IdentitiesGallery from "../components/identitiesGallery";
import { useStarknetIdContract } from "../hooks/starknetId";
import ErrorScreen from "../components/errorScreen";
import SuccessScreen from "../components/successScreen";
import LoadingScreen from "../components/loadingScreen";
import MintIdentity from "../components/mintOneIdentity";

export default function Identities() {
  //React
  const router = useRouter();
  const [minted, setMinted] = useState("false");
  const randomTokenId = Math.floor(Math.random() * 100000000);
  const [ownedIdentities, setOwnedIdentities] = useState([]);
  const [rightTokenId, setRightTokenId] = useState(undefined);

  // Connection
  const { disconnect, connectors } = useConnectors();
  const connector = connectors[0];
  const { account } = useStarknet();

  //Contract
  const { contract } = useStarknetIdContract();

  //Mint
  const {
    data: mintData,
    invoke,
    error,
  } = useStarknetInvoke({
    contract: contract,
    method: "mint",
  });
  const { transactions } = useStarknetTransactionManager();

  function mint() {
    invoke({
      args: [[randomTokenId, 0]],
    });
    setRightTokenId(randomTokenId);
  }

  useEffect(() => {
    if (!account) {
      router.push("/home");
    }

    for (const transaction of transactions)
      if (transaction.transactionHash === mintData) {
        if (transaction.status === "TRANSACTION_RECEIVED") {
          setMinted("loading");
        }
        if (
          transaction.status === "ACCEPTED_ON_L2" ||
          transaction.status === "ACCEPTED_ON_L1"
        ) {
          setMinted("true");
        }
      }
  }, [account, router, contract, mintData, transactions, error]);

  // Get NFTs token ids with indexer
  useEffect(() => {
    if (!account) return;

    fetch(`https://api-testnet.aspect.co/api/v0/assets?contract_address=0x04564121a7ad7757c425e4dac1a855998bf186303107d1c28edbf0de420e7023&owner_address=${account}&sort_by=minted_at&order_by=desc`)
      .then((response) => response.json())
      .then((data) => setOwnedIdentities(data.assets));
  }, [account]);

  return (
    <div className="h-screen w-screen">
      <Head>
        <title>Starknet.id</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/starknet-logo.webp" />
      </Head>
      <div className={styles.container}>
        {minted === "false" && (
          <>
            <h1 className="sm:text-5xl text-5xl">Your Starknet identities</h1>
            <div className={styles.containerGallery}>
              <IdentitiesGallery tokensData={ownedIdentities} />
              <MintIdentity onClick={mint} />
            </div>
            <div>
              {connector?.available() ? (
                <Button
                  key={connector.id()}
                  onClick={() => disconnect(connector)}
                >
                  Disconnect
                </Button>
              ) : null}
            </div>
          </>
        )}
        {minted === "loading" && !error && <LoadingScreen />}
        {error && minted === "loading" && (
          <ErrorScreen
            onClick={() => setMinted("false")}
            errorButton="Retry to mint"
          />
        )}
        {minted === "true" && (
          <SuccessScreen
            onClick={() => router.push(`/identities/${rightTokenId}`)}
            successButton="Verify your discord identity now !"
            successMessage="What a chad, your starknet.id is minted !"
          />
        )}
      </div>
    </div>
  );
}
