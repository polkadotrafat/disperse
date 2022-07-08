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
import {DISPERSE_ADDRESS,RPC_URL} from "./assets/constants";
import {BigNumber} from "bignumber.js";


import Toolbar from './components/Toolbar';
import Home from './containers/Home';
import Native from './containers/Native';
import Tokens from './containers/Tokens';
import { Form } from "react-bootstrap";


function App() {
  const [allAccounts,setAllAccounts] = useState();
  const [activeAccount, setActiveAccount] = useState(null);
  const [DisperseContract,setDisperseContract] = useState(null);
  const [accountBalance,setAccountBalance] = useState();
  const [signer,setSigner] = useState(null);

  console.log(allAccounts);
  //console.log("active: ",activeAccount.meta);
  //console.log(DisperseContract);
  //console.log(signer);

  const walletInit = useCallback ( async () => {
    const allInjected = await web3Enable('disperse');

    if (allInjected.length === 0) {
        console.log("No extension installed");
        return;
    }
    const temp = await web3Accounts();
    setAllAccounts(temp);

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
      const wsProvider = new WsProvider(RPC_URL);
      const api = await ApiPromise.create({ provider: wsProvider });
      const contract2 = new ContractPromise(api, disperseABI, DISPERSE_ADDRESS);
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
  },[activeAccount])

  const onHandleSelect = (e) => {
    e.preventDefault();
    console.log("ETAR",e.target.value);
    setActiveAccount(allAccounts[e.target.value]);
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
        />}
         />
        <Route path="/tokens" element={<Tokens 
        activeAccount={activeAccount} 
        signer={signer}
        disperseContract={DisperseContract}
        />} />
        <Route path="/native" element={<Native 
        activeAccount={activeAccount}
        signer={signer}
        disperseContract={DisperseContract}
        balance={accountBalance}
         />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
