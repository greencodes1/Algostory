import logo from './logo.svg';
import {Routes, Route} from 'react-router-dom';
import Home from "./pages/Home"
import Create from "./pages/Create"
import Profile from "./pages/UserProfile"
import Explorepage from "./pages/Explorepage"
import Collectionpage from "./pages/Collectionpage"
import Bookpage from "./pages/Bookpage"
import Createpdf from "./pages/Createpdf"
import Bookpage2 from "./pages/Bookpage2"
import Bookpage3 from "./pages/Bookpage3"
import algosdk from 'algosdk'
import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
// import WalletConnect from "@walletconnect/client";
// import QRCodeModal from "algorand-walletconnect-qrcode-modal";
// import { NetworkId, WalletId, WalletManager, WalletProvider } from '@txnlab/use-wallet-react'
import { ProvidersArray, PROVIDER_ID, useInitializeProviders, WalletProvider } from '@txnlab/use-wallet'

// const walletManager = new WalletManager({
//   wallets: [
//     WalletId.DEFLY,
//     WalletId.EXODUS,
//     WalletId.PERA,
//     // {
//     //   id: WalletId.WALLETCONNECT,
//     //   options: { projectId: '0790358b5b4480a11370e65fed8039e1' }
//     // },
//     // {
//     //   id: WalletId.BIATEC,
//     //   options: { projectId: 'fcfde0713d43baa0d23be0773c80a72b' }
//     // },
//     WalletId.KMD,
//     WalletId.KIBISIS,
//     WalletId.LIQUID,
//     {
//       id: WalletId.LUTE,
//       options: { siteName: 'Example site' }
//     },
//     // {
//     //   id: WalletId.MAGIC,
//     //   options: { apiKey: 'pk_live_D17FD8D89621B5F3' }
//     // }
//   ],
//   algod: {
//     token: '',
//     baseServer:  "https://testnet-api.algonode.cloud/",
//     port: ''
//   },
//   network: NetworkId.TESTNET

// })

let providersArray = [
  { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
  { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
  { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
  { id: PROVIDER_ID.EXODUS },
  // If you are interested in WalletConnect v2 provider
  // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
]

const App = () => {

  const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: "testnet",
      nodeServer: "https://testnet-api.algonode.cloud",
      nodePort: "",
      nodeToken: "",
    },
    algosdkStatic: algosdk,
  })
  return (
    <WalletProvider value={walletProviders}>
                         <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create/:id" element={<Create />} />
        <Route path="/create2" element={<Createpdf/>} />

        <Route path="/explore" element={<Explorepage />} />
        <Route path="/collection" element={<Collectionpage />} />
        <Route path="/nftbook/:id" element={<Bookpage />} />
        <Route path="/nftbook2/:id" element={<Bookpage2 />} />
        <Route path="/resalebook" element={<Bookpage3 />} />
       
      </Routes>
                  </WalletProvider>
  
      
  );
};

export default App;
