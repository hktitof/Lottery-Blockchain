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
  const { enableWeb3, isWeb3Enabled, account } = useMoralis();

  // States
  const [connectedFirstTime, setConnectedFirstTime] = useState(false);
  const [connected, setConnected] = useState(false);

  // TODO : fix connect to wallet by implementing connect button conditions

  // useEffects

  //toast for connected wallet verfiication
  useEffect(() => {
    if (!connected) {
      if (connectedFirstTime && account) {
        setConnected(true);
        console.log("here....");
        const notify = () => toast.success("Connected to wallet");
        notify();
      }
    }
  }, [account, connected, connectedFirstTime]);

  // check if wallet is connected
  useEffect(() => {
    console.log("isWeb3Enabled value : ", isWeb3Enabled);
  }, [isWeb3Enabled]);

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
      <NavBar
        enableWeb3={enableWeb3}
        account={account}
        setConnectedFirstTime={setConnectedFirstTime}
        isWeb3Enabled={isWeb3Enabled}
      />
    </div>
  );
}
