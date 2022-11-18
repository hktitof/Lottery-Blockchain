import { useState } from "react";


export default function NavBar(props:{enableWeb3:()=>void, account:string}) {
  const [navbar, setNavbar] = useState(false);

  const clickOnConnect = async () => {
    await props.enableWeb3();
  };

  return (
    <nav className="w-full bg-purple-800 shadow">
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
            <div
              className={`flex-1 justify-self-center pb-3 mt-4  md:block md:pb-0 md:mt-0 ${
                navbar ? "block" : "hidden"
              }`}
            >
              <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                <li className="text-white hover:text-indigo-200">
                  <button className="px-4 py-2 text-black bg-gray-200 rounded-md shadow hover:bg-gray-100 hover:ease-out transition duration-200">
                    Connect
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <div className="hidden space-x-2 md:inline-block">
          {props.account ? (
            <button
              onClick={()=>{}}
              className="px-4 py-2 text-black bg-gray-200 rounded-md shadow hover:bg-gray-100 hover:ease-out transition duration-200"
            >
              Disconnect
            </button>
          ) : (
            <button
              onClick={clickOnConnect}
              className="px-4 py-2 text-black bg-gray-200 rounded-md shadow hover:bg-gray-100 hover:ease-out transition duration-200"
            >
              Connect to wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
