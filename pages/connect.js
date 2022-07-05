import Head from "next/head";
import styles from "../styles/Identities.module.css";
import { useConnectors, useStarknet } from "@starknet-react/core";
import Button from "../components/button";
import { useEffect } from "react";
import { useRouter } from "next/router";
import ClickableIcon from "../components/clickableIcon";

export default function Connect() {
  const { disconnect, connectors } = useConnectors();
  const { account } = useStarknet();
  const router = useRouter();
  const connector = connectors[0];

  useEffect(() => {
    if (!account) {
      console.log("account", account);
      router.push("/home");
    }
  }, [account, router]);

  return (
    <div className="h-screen w-screen">
      <Head>
        <title>Starknet.id</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/starknet-logo.webp" />
      </Head>

      <div className={styles.container}>
        <h1 className="sm:text-5xl text-5xl">
          Choose a social account to connect
        </h1>
        <div className="flex flex-wrap mt-5">
          <ClickableIcon href="/home" icon="twitter" />
          <ClickableIcon
            href="https://discord.com/oauth2/authorize?client_id=991638947451129886&redirect_uri=https%3A%2F%2Fstarknet.id%2Fdiscord&response_type=code&scope=identify"
            icon="discord"
          />
        </div>

        <div>
          {connector?.available() ? (
            <Button key={connector.id()} onClick={() => disconnect(connector)}>
              Disconnect
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}