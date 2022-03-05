import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

import { Peripherals } from "../components/peripherals";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>BLE bridge</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Peripherals />
    </div>
  );
};

export default Home;
