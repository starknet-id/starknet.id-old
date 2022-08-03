import Head from "next/head";
import styles from "../styles/Home.module.css";
import Button from "../components/button";
import animationData from "../public/assets/lottie-ethereum.json";
import Lottie from "../components/lottie";
import { useConnectors, useStarknet } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Wallets from "../components/wallets";

export default function HomePage() {
  const { account } = useStarknet();
  const [hasWallet, setHasWallet] = useState(false);
  const { available, connect } = useConnectors();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      router.push("/identities");
    }
  }, [account, router]);

  return (
    <div className="h-screen w-screen">
      <Head>
        <title>Starknet.id</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/starknet-logo.webp" />
      </Head>

      {hasWallet ? <Wallets close={() => setHasWallet(false)} /> : null}

      <div className={styles.container}>
        <div>
          <div className="text-center">
            <h1 className="md:text-8xl text-5xl">Starknet.id</h1>
            <p className="italic mt-6">
              &quot;Be a Chad and own your on-chain identity&quot;
            </p>
            <div className={styles.center}>
              <div className="mt-8">
                <Button
                  onClick={() =>
                    available.length === 1
                      ? connect(available[0])
                      : setHasWallet(true)
                  }
                >
                  Claim your Starknet.id
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="md:h-3/5 h-2/5">
          <Lottie animationData={animationData} width="100%" height="100%" />
        </div>
      </div>
      <footer>
        <div>
          Made with ❤️ by&nbsp;
          <a className="footerLink" href="https://twitter.com/AgeOfEykar">
            Eykar
          </a>
          &nbsp;and&nbsp;
          <a className="footerLink" href="https://twitter.com/ImperiumWars">
            Imperium
          </a>
          &nbsp;
        </div>
      </footer>
    </div>
  );
}
