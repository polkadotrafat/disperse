# Disperse DAPP Build Using Ink! and React

Disperse DAPP is a batching protocol for both native currency and PSP22/ERC20 or equivalent tokens that can help reduce gas cost for multiple transfers by batching them in a single block.

DAPP is live at https://famous-llama-2bd8e8.netlify.app [Currently live on Shibuya Testnet but I plan to add Shiden once more comprehensive tests are done. Contracts are available on Shiden]

Slides : https://docs.google.com/presentation/d/1iMBasWGsGutQSdDwc1XhFPmtathxhBF25aJJAfUU9KI/edit?usp=sharing

Demo Video :  https://vimeo.com/728534810           [ No Audio ]

Contract Address : ```XAPTQfpsddWDJ9kkkVBQjkchzHjpD9Bz4noneJmfBvTySC7``` [on Shibuya Testnet]
```YCgRauicmg5jjZioTojmD8KAKEzf9Jsz1DfZ1WZsdurQ1eG``` [on Shiden Network]
```5FS7LycuEgvur4mVag5RqZ48NKNrKazPZxZK11Pt5JmxjQ3F``` [on Rococo Contracts Network]

Abis for both disperse and PSP22 token contracts are available in the abi folder and can be uploaded directly to another testnet or mainnet.

MIT License

## Installation

### Backend


```cargo +nightly contract build```

### Frontend (create-react-app)

``` yarn install ```

``` yarn start ```

### Documentation

This DAPP is based on Artem K's [disperse app on ethereum. (PDF Link)](https://disperse.app/disperse.pdf)


To batch together native currency.

```pub fn disperse_currency(&mut self, addresses: Vec<AccountId>, values: Vec<Balance>)-> Result<(),Error>  ```

addresses is an array of addresses and the values is the array of amount that is being send to each of the addresses respectively.

To batch together PSP22/ERC20 or equivalent tokens.

```pub fn disperse_token(&mut self,token_address: AccountId, addresses: Vec<AccountId>, values: Vec<Balance>)-> Result<(),Error>```

token_address is the contract address of the PSP22/ERC20 contract. The other values are same as above.

