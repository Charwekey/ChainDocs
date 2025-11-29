#[test_only]
module chaindocs::chaindocs_tests {
    use std::string;
    use std::option;
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::clock;
    use chaindocs::chaindocs::{Self, ChainDocsVault};

    // Test addresses
    const ADMIN: address = @0xAD;
    const USER1: address = @0xCAFE;

    // Helper to setup the test scenario
    fun setup_test(): Scenario {
        ts::begin(ADMIN)
    }

    #[test]
    fun test_create_vault() {
        let mut scenario = setup_test();
        
        // 1. Create Vault
        ts::next_tx(&mut scenario, USER1);
        {
            chaindocs::create_vault(
                string::utf8(b"My Vault"),
                string::utf8(b"Personal documents"),
                ts::ctx(&mut scenario)
            );
        };

        // 2. Verify Vault exists and is owned by USER1
        ts::next_tx(&mut scenario, USER1);
        {
            assert!(ts::has_most_recent_for_sender<ChainDocsVault>(&scenario), 0);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_create_folder() {
        let mut scenario = setup_test();
        
        // 1. Create Vault
        ts::next_tx(&mut scenario, USER1);
        {
            chaindocs::create_vault(
                string::utf8(b"My Vault"),
                string::utf8(b"Personal documents"),
                ts::ctx(&mut scenario)
            );
        };

        // 2. Create Folder
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_from_sender<ChainDocsVault>(&scenario);
            chaindocs::create_folder(
                &mut vault,
                string::utf8(b"Finance"),
                ts::ctx(&mut scenario)
            );
            ts::return_to_sender(&scenario, vault);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_upload_document() {
        let mut scenario = setup_test();
        
        // 1. Create Vault
        ts::next_tx(&mut scenario, USER1);
        {
            chaindocs::create_vault(
                string::utf8(b"My Vault"),
                string::utf8(b"Personal documents"),
                ts::ctx(&mut scenario)
            );
        };

        // 2. Create Clock (needed for timestamp)
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));

        // 3. Upload Document
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_from_sender<ChainDocsVault>(&scenario);
            
            let file_content = b"Hello World";
            
            chaindocs::upload_document(
                &mut vault,
                string::utf8(b"hello.txt"),
                string::utf8(b"A text file"),
                file_content,
                string::utf8(b"text/plain"),
                option::none(), // No folder
                &clock,
                ts::ctx(&mut scenario)
            );
            
            ts::return_to_sender(&scenario, vault);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }

    #[test]
    fun test_delete_document() {
        let mut scenario = setup_test();
        
        // 1. Create Vault
        ts::next_tx(&mut scenario, USER1);
        {
            chaindocs::create_vault(
                string::utf8(b"My Vault"),
                string::utf8(b"Personal documents"),
                ts::ctx(&mut scenario)
            );
        };

        // 2. Create Clock
        let clock = clock::create_for_testing(ts::ctx(&mut scenario));
        
        // 3. Upload Document
        ts::next_tx(&mut scenario, USER1);
        {
            let mut vault = ts::take_from_sender<ChainDocsVault>(&scenario);
            chaindocs::upload_document(
                &mut vault,
                string::utf8(b"to_delete.txt"),
                string::utf8(b"Delete me"),
                b"delete",
                string::utf8(b"text/plain"),
                option::none(),
                &clock,
                ts::ctx(&mut scenario)
            );
            ts::return_to_sender(&scenario, vault);
        };

        clock::destroy_for_testing(clock);
        ts::end(scenario);
    }
}
