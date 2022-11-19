import { Dispatch, SetStateAction, useState } from "react";

const ConnectedButton=(props:{account})=>{
  return(<button
    onClick={async () => {}}
    className="flex flex-row items-center space-x-2 px-4 py-2 text-white bg-blue-300 rounded-sm border-white shadow hover:bg-blue-400 hover:ease-out transition duration-200"
  >
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M12.3007772,20.2064516 C11.8620675,20.9290323 11.1007772,21.3548387 10.2620675,21.3548387 C10.0298095,21.3548387 9.79755139,21.316129 9.57819655,21.2516129 C9.39755139,21.1870968 9.204003,21.1096774 9.03626107,21.0064516 C8.36529333,20.5935484 7.96529333,19.9096774 7.9007772,19.1870968 C7.89140409,19.0839926 7.88808323,18.9793754 7.89136416,18.8743442 C7.55009449,15.0742313 5.43254085,11.8144954 2.19755139,10.0774194 C1.1007772,9.49677419 0.674970747,8.11612903 1.26851913,7.01935484 C1.66851913,6.27096774 2.42980946,5.81935484 3.26851913,5.81935484 C3.64271268,5.81935484 4.01690623,5.90967742 4.33948688,6.09032258 C6.48434923,7.23339294 8.37353109,8.87504028 9.73981084,10.748043 C9.55437093,9.20494486 9.06580772,7.70138229 8.2491643,6.38709677 C7.86206752,5.74193548 7.82335784,4.95483871 8.05561591,4.3483871 C8.17174494,4.03870968 8.32658365,3.75483871 8.59755139,3.47096774 C8.86851913,3.18709677 9.16529333,3.03225806 9.4491643,2.91612903 C9.72013204,2.81290323 9.91368042,2.76129032 10.3007772,2.76129032 C10.7652933,2.76129032 11.2169062,2.90322581 11.5910998,3.1483871 C11.6256625,3.16950877 11.659368,3.19148766 11.6922588,3.21432378 C11.6556159,3.17419355 11.5910998,3.13548387 11.5910998,3.13548387 C14.3738522,4.83605479 16.7449876,7.17977729 18.3834315,9.79420491 C18.1429112,7.64929068 17.5519189,5.57240342 16.6104546,3.57419355 C16.0169062,2.33548387 16.5459385,0.838709677 17.7975514,0.24516129 C18.1330353,0.0774193548 18.4943256,0 18.8685191,0 C19.8233578,0 20.7136804,0.567741935 21.1265836,1.43225806 C21.9007772,3.05806452 22.4943256,4.76129032 22.8943256,6.51612903 C23.2943256,8.29677419 23.5136804,10.1677419 23.5265836,12.0258065 C23.5265836,13.9096774 23.3072288,15.7419355 22.9072288,17.5354839 C22.804003,18.0129032 22.687874,18.4645161 22.5459385,18.9419355 C22.1072288,20.5290323 21.604003,21.7548387 21.1007772,22.6967742 C20.6620675,23.4967742 19.8233578,24 18.9072288,24 C18.5330353,24 18.1717449,23.9096774 17.8362611,23.7548387 C17.087874,23.4064516 16.6362611,22.7612903 16.4685191,22.0516129 C16.4169062,21.8451613 16.404003,21.6258065 16.404003,21.4709677 C16.404003,20.9290323 16.3781966,20.5677419 16.3781966,20.5677419 C16.3781966,17.8729043 15.7339615,15.3069136 14.548495,13.0500263 C14.3781966,15.6 13.6169062,18.0516129 12.3007772,20.2064516 Z"
      />
    </svg>
    <span className="">{props.account.slice(0, 6) + "..." + props.account.slice(-4)}</span>
  </button>)
}
const ConnectButton=(props:{clickOnConnect})=>{
  return(<button
    onClick={props.clickOnConnect}
    className="px-4 py-2 text-white bg-blue-300 rounded-sm border-white shadow hover:bg-blue-400 hover:ease-out transition duration-200"
  >
    Connect to wallet
  </button>)
}

export default function NavBar(props: {
  enableWeb3: () => void;
  account: string;
  isWeb3Enabled: boolean;
  deactivateWeb3: () => Promise<void>;
}) {
  const [navbar, setNavbar] = useState(false);

  const clickOnConnect = async () => {
    await props.enableWeb3();
    // add variable to local storage
    if (typeof localStorage !== "undefined") localStorage.setItem("connected", "true");
  };

  return (
    <nav className="w-full bg-blue-500 shadow">
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div>
          <div className="flex items-center justify-between py-3 md:py-5 md:block ">
            <div className="flex flex-row items-center space-x-1">
              <div className="h-8 w-8">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#F2F4F8"
                    d="M30.3,-29.4C43.5,-25,61.3,-19.5,66.7,-8.8C72.2,2,65.4,17.9,55.9,30.4C46.5,42.9,34.4,52.1,19.9,59.5C5.4,67,-11.6,72.7,-20.1,65.2C-28.5,57.8,-28.5,37.1,-31.1,22.8C-33.6,8.4,-38.7,0.3,-44.3,-14.8C-49.9,-29.8,-56,-52,-48.8,-57.4C-41.5,-62.7,-20.7,-51.4,-6.1,-44.1C8.6,-36.8,17.1,-33.7,30.3,-29.4Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white">Lottery</h2>
            </div>
            <div className="md:hidden">
              <button
                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          {navbar && (
            <div className={`flex-1 justify-self-center pb-3 mt-4  md:pb-0 md:mt-0 md:hidden`}>
              <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                <li className="text-white hover:text-indigo-200">
                  {/* Check if wallet is connected, note that account will hold the address of the account  */}
                  {props.account ? (
                   <ConnectedButton account={props.account}/>
                  ) : (
                    <ConnectButton clickOnConnect={clickOnConnect}/>
                  )}
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="hidden space-x-2 md:inline-block">
          {/* Check if wallet is connected, note that account will hold the address of the account  */}
          {props.account ? (
            <ConnectedButton account={props.account}/>
          ) : (
           <ConnectButton clickOnConnect={clickOnConnect}/>
          )}
        </div>
      </div>
    </nav>
  );
}
