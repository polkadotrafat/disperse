import React, {useState,useEffect, useCallback} from 'react'; 
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
} from '@polkadot/extension-dapp';


import Toolbar from './components/Toolbar';
import Home from './containers/Home';
import Native from './containers/Native';
import Tokens from './containers/Tokens';


function App() {
  const [allAccounts,setAllAccounts] = useState();
  const [activeAccount, setActiveAccount] = useState(null);

  console.log(allAccounts);
  console.log("active: ",activeAccount);

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
  return (
    <BrowserRouter>
      <Toolbar />
      <Routes>
        <Route path="/" element={<Home 
        activeAccount={activeAccount} 
        allAccounts={allAccounts}
        />}
         />
        <Route path="/tokens" element={<Tokens activeAccount={activeAccount} />} />
        <Route path="/native" element={<Native activeAccount={activeAccount} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
