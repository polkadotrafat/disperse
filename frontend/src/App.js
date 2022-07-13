import React, {useState,useEffect, useCallback} from "react"; 
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import {
  web3Accounts, 
  web3Enable, 
  web3AccountsSubscribe, 
  web3FromSource
} from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { ContractPromise } from "@polkadot/api-contract";
import disperseABI from "./contracts/disperse.json";
import {DISPERSE_ADDRESS_NETWORK,RPC_URL_NETWORK,NAME_NETWORK} from "./assets/constants";
import {BigNumber} from "bignumber.js";


import Toolbar from './components/Toolbar';
import Home from './containers/Home';
import Native from './containers/Native';
import Tokens from './containers/Tokens';

function App() {
  const [allAccounts,setAllAccounts] = useState();
  const [activeAccount, setActiveAccount] = useState(null);
  const [DisperseContract,setDisperseContract] = useState(null);
  const [accountBalance,setAccountBalance] = useState();
  const [signer,setSigner] = useState(null);
  const [rpcURL,setRpcURL] = useState();
  const [contractAddress,setContractAddress] = useState();
  const [networkName,setNetworkName] = useState();

  console.log(allAccounts);
  //console.log("active: ",activeAccount.meta);
  console.log("contract",contractAddress);
  //console.log(signer);

  const walletInit = useCallback ( async () => {
    const allInjected = await web3Enable('disperse');

    if (allInjected.length === 0) {
        console.log("No extension installed");
        return;
    }
    const temp = await web3Accounts();
    setAllAccounts(temp);

    if (!rpcURL) {
      setRpcURL(RPC_URL_NETWORK[0]);
    }

    if (!contractAddress) {
      setContractAddress(DISPERSE_ADDRESS_NETWORK[0]);
    }

    if (!networkName) {
      setNetworkName(NAME_NETWORK[0]);
    }

    let unsubscribe; 

    unsubscribe = await web3AccountsSubscribe(( allAccounts ) => { 
        allAccounts.map(( account ) => {
            console.log("Subscribe : ",account.address);
        })
     });

     unsubscribe && unsubscribe();
  });

  useEffect(() => {
    walletInit();
  },[])

  useEffect(() => {
    if (allAccounts && !activeAccount) {
      setActiveAccount(allAccounts[0]);
    }
  },[allAccounts])

  const setUp = async () => {
    if (activeAccount) {
      const wsProvider = new WsProvider(rpcURL);
      const api = await ApiPromise.create({ provider: wsProvider });
      const contract2 = new ContractPromise(api, disperseABI, contractAddress);
      const {data: balance, nonce} = await api.query.system.account(activeAccount.address);
      const cd = await api.registry.chainDecimals;
      let x = new BigNumber(balance.free);
      let y = new BigNumber(10).exponentiatedBy(new BigNumber(cd));
      let bal = (x.dividedBy(y)).toString();
      setDisperseContract(contract2);
      setAccountBalance(bal);
      console.log("activeAccount ::::",activeAccount);
      const accountSigner = await web3FromSource(activeAccount.meta.source).then(
        (res) => res.signer
      );
      setSigner(accountSigner);
    }
  }

  useEffect(() => {
    setUp();
  },[activeAccount,rpcURL,contractAddress])

  const onHandleSelect = (e) => {
    e.preventDefault();
    console.log("ETAR",e.target.value);
    setActiveAccount(allAccounts[e.target.value]);
  }

  const onHandleNetwork = (e) => {
    e.preventDefault();
    console.log("ETAR",e.target.value);
    setRpcURL(RPC_URL_NETWORK[e.target.value]);
    setContractAddress(DISPERSE_ADDRESS_NETWORK[e.target.value]);
    setNetworkName(NAME_NETWORK[e.target.value]);
  }

  return (
    <BrowserRouter>
      <Toolbar />
      <Routes>
        <Route path="/" element={<Home 
        activeAccount={activeAccount} 
        allAccounts={allAccounts}
        onHandleSelect={onHandleSelect}
        balance={accountBalance}
        onHandleNetwork={onHandleNetwork}
        rpcURL={rpcURL}
        networkName={networkName}
        NAME_NETWORK={NAME_NETWORK}
        />}
         />
        <Route path="/tokens" element={<Tokens 
        activeAccount={activeAccount} 
        signer={signer}
        rpcURL={rpcURL}
        contractAddress={contractAddress}
        disperseContract={DisperseContract}
        />} />
        <Route path="/native" element={<Native 
        activeAccount={activeAccount}
        signer={signer}
        rpcURL={rpcURL}
        disperseContract={DisperseContract}
        balance={accountBalance}
         />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
