import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import NavBar from '../components/NavBar/Navbar'

// Moralis imports
import { useMoralis } from "react-moralis";
export default function Home() {
  const { enableWeb3, account } = useMoralis();
  console.log("Page Re-rendered...");
  if(account) console.log("connected account : ",account.slice(0,6)+"..."+account.slice(-4));
  return (
    <div className="h-screen w-full">
      <NavBar enableWeb3={enableWeb3} account={account}/>
    </div>
  )
}
