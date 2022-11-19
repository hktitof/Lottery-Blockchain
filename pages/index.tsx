//React Imports
import { useEffect, useState } from "react";

// Components Imports
import NavBar from "../components/NavBar/Navbar";

// Moralis imports
import { useMoralis } from "react-moralis";

//torast imports
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  // Moralis
  const { enableWeb3, isWeb3Enabled, account, Moralis, deactivateWeb3 } = useMoralis();
  const [detectedAccount, setDetectedAccount] = useState<String | null>(null);
  const [notifyConnectedWallet, setNotifyConnectedWallet] = useState<Boolean>(false);
  const [notifyChangedAccount, setNotifyChangedAccount] = useState<Boolean>(false);
  const [walletIsDisconnected, setWalletIsDisconnected] = useState<Boolean>(false);

  // TODO : fix connect to wallet by implementing connect button conditions

  // useEffects

  //toast for connected wallet verfiication
  useEffect(() => {
    if (account && !notifyConnectedWallet) {
      console.log("notify Connected Wallet");
      const notify = () => toast.success("Connected to wallet");
      notify();
      setNotifyConnectedWallet(true);
      setDetectedAccount(account);
    }
  }, [account, notifyConnectedWallet]);

  // toast for user when connected wallet again after disconnected from his wallet
  useEffect(()=>{
    if(account && walletIsDisconnected){
      console.log("Wallet Connected Again ");
      toast.success("Connected to wallet");
      setWalletIsDisconnected(false);
    }
  },[account,walletIsDisconnected])

  // check if wallet is connected
  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof localStorage !== "undefined") {
      if (localStorage.getItem("connected") === "true") {
        enableWeb3();
      }
    }
  }, [enableWeb3, isWeb3Enabled]);

  // check if wallet if disconnected
  useEffect(() => {
    Moralis.onAccountChanged(account => {
      if (detectedAccount !== null) {
        if (detectedAccount.localeCompare(account) !== 0) {
          console.log("Account changed to ", account);
          if (account) {
            setDetectedAccount(account);
            setNotifyChangedAccount(true); // this will trigger the toast only when the account is changed
          }

          if (!account) {
            // if there is no account, account == null
            localStorage.removeItem("connected");
            deactivateWeb3();
            setWalletIsDisconnected(true);
            console.log("Null Account detected");
          }
        }
      }
    });
  }, [Moralis, account, deactivateWeb3, detectedAccount]);

  // check if Moralis.onAccountChanged event is found that account is changed a
  useEffect(() => {
    console.log("notify Changed Account");
    if (detectedAccount !== null && notifyChangedAccount) {
      toast.success("Successfully changed Account");
    }
  }, [detectedAccount, notifyChangedAccount]);

  console.log("Page Re-rendered...");
  if (account) console.log("connected account : ", account.slice(0, 6) + "..." + account.slice(-4));
  return (
    <div className="h-screen w-full">
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={24}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 3000,
          style: {
            background: "#fff",
            color: "#000",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={24}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 3000,
          style: {
            background: "#fff",
            color: "#000",
          },

          // Default options for specific types
          error: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <NavBar enableWeb3={enableWeb3} account={account} isWeb3Enabled={isWeb3Enabled} deactivateWeb3={deactivateWeb3} />
    </div>
  );
}
