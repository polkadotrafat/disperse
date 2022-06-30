#![cfg_attr(not(feature = "std"), no_std)]
#![feature(min_specialization)]
                                
#[openbrush::contract]
pub mod rtok {
    // Imports from ink! 
    use ink_prelude::string::String; 
    use ink_storage::traits::SpreadAllocate;
    
    // Imports from openbrush
    use openbrush::contracts::psp22::*; 
    use openbrush::contracts::psp22::extensions::metadata::*;       

    #[ink(storage)]
    #[derive(Default, SpreadAllocate, PSP22Storage, PSP22MetadataStorage)]
    pub struct RTOK {
        #[PSP22StorageField]
        psp22: PSP22Data,  
        #[PSP22MetadataStorageField]
        metadata: PSP22MetadataData,    
    }

    // Section contains default implementation without any modifications
    impl PSP22 for RTOK {} 
    impl PSP22Metadata for RTOK {}         
        
    impl RTOK {
        #[ink(constructor)]
        pub fn new(initial_supply: Balance) -> Self {
            ink_lang::codegen::initialize_contract(|_instance: &mut RTOK| {  
                _instance.metadata.name = Some(String::from("RTOKEN"));
                _instance.metadata.symbol = Some(String::from("RTOK"));
                _instance.metadata.decimals = 12;
                _instance
                    ._mint(_instance.env().caller(), initial_supply)
                    .expect("Should mint"); 
            })
        }  
    }
}