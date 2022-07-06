#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]
                                
#[openbrush::contract]
pub mod token {
    // Imports from ink!  
    use ink_storage::traits::SpreadAllocate;
    
    // Imports from openbrush
    use openbrush::contracts::psp22::*;        

    #[ink(storage)]
    #[derive(Default, SpreadAllocate, PSP22Storage)]
    pub struct Token {
        #[PSP22StorageField]
        psp22: PSP22Data,      
    }

    // Section contains default implementation without any modifications
    impl PSP22 for Token {}          
        
    impl Token {
        #[ink(constructor)]
        pub fn new(initial_supply: Balance) -> Self {
            ink_lang::codegen::initialize_contract(|_instance: &mut Token| {  
                _instance
                    ._mint(_instance.env().caller(), initial_supply)
                    .expect("Should mint"); 
            })
        }  
    }
}