#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod disperse {
    use openbrush::contracts::traits::psp22::PSP22Ref;
    use openbrush::contracts::traits::errors::PSP22Error;
    use ink_prelude::vec::Vec;
    use ink_storage::{
        traits::SpreadAllocate
    };

    #[derive(Debug,PartialEq,Eq,scale::Encode,scale::Decode)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo))]
    pub enum Error {
        //Return if the no money is sent to disperse
        ZeroBalance,
        // Input Mismatch
        InputMismatch,
        // Insufficient Balance
        InsufficientBalance,
        // Token Transfer failed
        TransferFailed,
        PSP22Error(PSP22Error),
    }

    #[ink(event)]
    pub struct CurrencyDispersed {
        #[ink(topic)]
        from: Option<AccountId>,
        value: Balance,
    }

    #[ink(event)]
    pub struct TokensDispersed {
        #[ink(topic)]
        from: Option<AccountId>,
        #[ink(topic)]
        token: Option<AccountId>,
        value: Balance,
    }


    #[ink(storage)]
    #[derive(SpreadAllocate)]
    pub struct Disperse {}

    impl Disperse {
        /// Create new contract
        #[ink(constructor,payable)]
        pub fn new() -> Self {
            Self {}
        }

        #[ink(message,payable)]
        pub fn disperse_currency(&mut self, addresses: Vec<AccountId>, values: Vec<Balance>)-> Result<(),Error> {
            let transferred_value = self.env().transferred_value();
            if transferred_value == 0 {
                return Err(Error::ZeroBalance)
            }
            if addresses.len() != values.len() {
                self.settle_balance();
                return Err(Error::InputMismatch)
            }

            let transactions = addresses.len();
            let mut sum: Balance = 0;

            for i in 0..transactions {
                sum += values[i];
            }

            if transferred_value < sum {
                self.settle_balance();
                return Err(Error::InsufficientBalance)
            }

            for i in 0..transactions {
                self.env().transfer(addresses[i].clone(), values[i].clone()).ok();
            }

            self.settle_balance();

            Self::env().emit_event(CurrencyDispersed{
                from: Some(self.env().caller()),
                value: sum,
            });

            Ok(())
        }

        #[ink(message,payable)]
        pub fn disperse_token(&mut self,token_address: AccountId, addresses: Vec<AccountId>, values: Vec<Balance>)-> Result<(),Error> {
            //let token = Erc20::from_account_id(token_address);
            let contract_address: AccountId = self.env().account_id();
            let caller: AccountId = self.env().caller();
            let mut total: Balance = 0;
            if addresses.len() != values.len() {
                return Err(Error::InputMismatch)
            }

            let transactions = addresses.len();

            for i in 0..transactions {
                total = total + values[i];
            }

            PSP22Ref::transfer_from_builder(&token_address,caller,contract_address,total.clone(),Vec::<u8>::new())
            .call_flags(ink_env::CallFlags::default().set_allow_reentry(true))
            .fire()
            .unwrap().ok();


            for i in 0..transactions {
                PSP22Ref::transfer(&token_address,addresses[i].clone(), values[i].clone(),Vec::<u8>::new()).ok();
            }

            Self::env().emit_event(TokensDispersed{
                from: Some(self.env().caller()),
                token: Some(token_address),
                value: total,
            });

            Ok(())
        }


        fn settle_balance(&mut self) {
            let balance: Balance = self.env().balance();
            let sender: AccountId = self.env().caller();

            if balance > 0 {
                self.env().transfer(sender,balance).ok();
            }
        }
    }

    #[cfg(test)]
    mod tests {
        /// Imports all the definitions from the outer scope so we can use them here.
        use super::*;

        /// Imports `ink_lang` so we can use `#[ink::test]`.
        use ink_lang as ink;

        /// We test if the default constructor does its job.
        #[ink::test]
        fn disperse_currency_works() {
            let accounts = default_accounts();
            set_sender(accounts.alice);// Alice is the owner
            let mut disperse = Disperse::new();

            let amount: Balance = 1000;
            let amount1: Balance = 400;
            let amount2: Balance = amount - amount1;
            

            // Set balances of Bob, charlie and Eve

            set_balance(accounts.bob,2000);
            set_balance(accounts.charlie,0);
            set_balance(accounts.eve,0);

            set_sender(accounts.bob);// Bob sends money to charlie and Eve
            set_value(amount);

            let res = disperse.disperse_currency(vec!(accounts.charlie,accounts.eve),vec!(amount1,amount2));

            assert_eq!(get_balance(accounts.charlie),amount1);
            assert_eq!(get_balance(accounts.eve),amount2);
        }

        fn contract_id() -> AccountId {
            ink_env::test::callee::<ink_env::DefaultEnvironment>()
        }

        fn set_sender(sender: AccountId) {
            ink_env::test::set_caller::<ink_env::DefaultEnvironment>(sender);
        }

        fn default_accounts(
        ) -> ink_env::test::DefaultAccounts<ink_env::DefaultEnvironment> {
            ink_env::test::default_accounts::<ink_env::DefaultEnvironment>()
        }

        fn set_balance(account_id: AccountId, balance: Balance) {
            ink_env::test::set_account_balance::<ink_env::DefaultEnvironment>(
                account_id, balance,
            )
        }

        fn set_value(balance: Balance) {
            ink_env::test::set_value_transferred::<ink_env::DefaultEnvironment>(
                balance
            )
        }

        fn get_balance(account_id: AccountId) -> Balance {
            ink_env::test::get_account_balance::<ink_env::DefaultEnvironment>(account_id)
                .expect("Cannot get account balance")
        }
    }
}