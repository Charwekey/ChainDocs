module chaindocs::chaindocs {
    use std::string::{Self, String};
    use sui::object::{Self, UID, ID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::package;
    use sui::display;
    use sui::table::{Self, Table};
    use sui::event;

    /// One-Time Witness for the package
    public struct CHAINDOCS has drop {}

    /// The root object for a user's vault.
    /// This is an owned object that holds the user's folders and documents.
    public struct ChainDocsVault has key, store {
        id: UID,
        name: String,
        description: String,
        /// Mapping from Folder ID to Folder struct
        folders: Table<ID, Folder>,
        /// Mapping from Document ID to Document struct (for root documents or all documents)
        /// We can store all docs here or use dynamic fields. 
        /// For simplicity and scalability, we'll use a Table for direct access if needed, 
        /// or we can use dynamic object fields.
        /// Let's use a Table for "root" documents (not in a folder) and another for all?
        /// Actually, to keep it simple and scalable:
        /// - Folders are in a Table.
        /// - Documents are in a Table.
        /// - Folder struct contains a list of Document IDs.
        documents: Table<ID, Document>,
    }

    /// Represents a Folder to organize documents.
    public struct Folder has store {
        id: ID, // We generate an ID for the folder to reference it
        name: String,
        // We store document IDs that belong to this folder
        document_ids: vector<ID>, 
    }

    /// Represents a stored Document.
    public struct Document has store {
        id: ID, // We generate an ID for the document
        name: String,
        description: String,
        file_bytes: vector<u8>, // The actual file content
        mime_type: String,
        uploaded_at: u64,
        folder_id: Option<ID>, // None if in root
    }

    // Events
    public struct VaultCreated has copy, drop {
        vault_id: ID,
        owner: address,
    }

    public struct FolderCreated has copy, drop {
        vault_id: ID,
        folder_id: ID,
        name: String,
    }

    public struct DocumentUploaded has copy, drop {
        vault_id: ID,
        document_id: ID,
        name: String,
        folder_id: Option<ID>,
    }

    public struct DocumentDeleted has copy, drop {
        vault_id: ID,
        document_id: ID,
    }

    fun init(otw: CHAINDOCS, ctx: &mut TxContext) {
        let publisher = package::claim(otw, ctx);
        
        // Setup Display for ChainDocsVault if needed (optional for now)
        
        transfer::public_transfer(publisher, tx_context::sender(ctx));
    }

    /// Create a new Vault for the user.
    public fun create_vault(name: String, description: String, ctx: &mut TxContext) {
        let id = object::new(ctx);
        let vault_id = object::uid_to_inner(&id);
        
        let vault = ChainDocsVault {
            id,
            name,
            description,
            folders: table::new(ctx),
            documents: table::new(ctx),
        };

        event::emit(VaultCreated {
            vault_id,
            owner: tx_context::sender(ctx),
        });

        transfer::transfer(vault, tx_context::sender(ctx));
    }

    /// Create a new folder within the vault.
    public fun create_folder(
        vault: &mut ChainDocsVault, 
        name: String, 
        ctx: &mut TxContext
    ) {
        // We simulate a UID for the folder by creating a fresh ID
        // Since Folder has `store`, it doesn't need a UID, but we need a unique ID for the Table key.
        // We can use `object::new(ctx)` to get a UID, take the ID, and delete the UID? 
        // Or just use a counter? Using a fresh UID is safer for uniqueness.
        let uid = object::new(ctx);
        let folder_id = object::uid_to_inner(&uid);
        object::delete(uid); // We just wanted the ID

        let folder = Folder {
            id: folder_id,
            name,
            document_ids: vector::empty(),
        };

        table::add(&mut vault.folders, folder_id, folder);

        event::emit(FolderCreated {
            vault_id: object::uid_to_inner(&vault.id),
            folder_id,
            name,
        });
    }

    /// Upload a document to the vault.
    public fun upload_document(
        vault: &mut ChainDocsVault,
        name: String,
        description: String,
        file_bytes: vector<u8>,
        mime_type: String,
        folder_id_option: Option<ID>,
        clock: &sui::clock::Clock,
        ctx: &mut TxContext
    ) {
        // Enforce max size (approx 4MB)
        // 4MB = 4 * 1024 * 1024 = 4,194,304 bytes
        assert!(vector::length(&file_bytes) <= 4194304, 0);

        let uid = object::new(ctx);
        let document_id = object::uid_to_inner(&uid);
        object::delete(uid);

        let document = Document {
            id: document_id,
            name,
            description,
            file_bytes,
            mime_type,
            uploaded_at: sui::clock::timestamp_ms(clock),
            folder_id: folder_id_option,
        };

        // Add to vault documents
        table::add(&mut vault.documents, document_id, document);

        // If it belongs to a folder, add to folder's list
        if (option::is_some(&folder_id_option)) {
            let folder_id = *option::borrow(&folder_id_option);
            // Ensure folder exists
            assert!(table::contains(&vault.folders, folder_id), 1);
            let folder = table::borrow_mut(&mut vault.folders, folder_id);
            vector::push_back(&mut folder.document_ids, document_id);
        };

        event::emit(DocumentUploaded {
            vault_id: object::uid_to_inner(&vault.id),
            document_id,
            name,
            folder_id: folder_id_option,
        });
    }

    /// Delete a document from the vault.
    public fun delete_document(
        vault: &mut ChainDocsVault,
        document_id: ID,
        _ctx: &mut TxContext
    ) {
        assert!(table::contains(&vault.documents, document_id), 2);
        
        let Document { 
            id: _, 
            name: _, 
            description: _, 
            file_bytes: _, 
            mime_type: _, 
            uploaded_at: _, 
            folder_id 
        } = table::remove(&mut vault.documents, document_id);

        // Remove from folder if applicable
        if (option::is_some(&folder_id)) {
            let folder_id = *option::borrow(&folder_id);
            if (table::contains(&vault.folders, folder_id)) {
                let folder = table::borrow_mut(&mut vault.folders, folder_id);
                let (found, index) = vector::index_of(&folder.document_ids, &document_id);
                if (found) {
                    vector::remove(&mut folder.document_ids, index);
                };
            };
        };

        event::emit(DocumentDeleted {
            vault_id: object::uid_to_inner(&vault.id),
            document_id,
        });
    }
}
