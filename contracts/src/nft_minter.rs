#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, Bytes, log};

#[derive(Clone)]
#[contracttype]
pub struct NFTMetadata {
    pub name: String,
    pub description: String,
    pub image: String,
    pub event_id: u64,
    pub mint_timestamp: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    TokenCounter,
    TokenOwner(u64),
    TokenMetadata(u64),
    OwnerTokens(Address),
    EventNFTs(u64),
    Admin,
}

#[contract]
pub struct NFTMinter;

#[contractimpl]
impl NFTMinter {
    /// Initialize the NFT contract
    pub fn init(env: Env, admin: Address) {
        let counter: u64 = 0;
        env.storage().persistent().set(&DataKey::TokenCounter, &counter);
        env.storage().persistent().set(&DataKey::Admin, &admin);
        
        log!(&env, "NFT Minter initialized with admin: {}", admin);
    }

    /// Mint NFT for event attendee
    pub fn mint_event_nft(
        env: Env,
        to: Address,
        event_id: u64,
        name: String,
        description: String,
        image: String,
    ) -> u64 {
        // Only admin can mint for now (in production, this would be the event manager contract)
        let admin: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin not set");
        admin.require_auth();

        // Get and increment token counter
        let mut counter: u64 = env.storage()
            .persistent()
            .get(&DataKey::TokenCounter)
            .unwrap_or(0);
        
        counter += 1;

        // Create metadata
        let metadata = NFTMetadata {
            name: name.clone(),
            description,
            image,
            event_id,
            mint_timestamp: env.ledger().timestamp(),
        };

        // Store token data
        env.storage().persistent().set(&DataKey::TokenOwner(counter), &to);
        env.storage().persistent().set(&DataKey::TokenMetadata(counter), &metadata);
        env.storage().persistent().set(&DataKey::TokenCounter, &counter);

        // Update owner's token list
        let mut owner_tokens: Vec<u64> = env.storage()
            .persistent()
            .get(&DataKey::OwnerTokens(to.clone()))
            .unwrap_or(Vec::new(&env));
        owner_tokens.push_back(counter);
        env.storage().persistent().set(&DataKey::OwnerTokens(to.clone()), &owner_tokens);

        // Update event's NFT list
        let mut event_nfts: Vec<u64> = env.storage()
            .persistent()
            .get(&DataKey::EventNFTs(event_id))
            .unwrap_or(Vec::new(&env));
        event_nfts.push_back(counter);
        env.storage().persistent().set(&DataKey::EventNFTs(event_id), &event_nfts);

        log!(&env, "NFT minted: {} for event: {} to: {}", counter, event_id, to);
        counter
    }

    /// Batch mint NFTs for multiple attendees
    pub fn batch_mint_event_nfts(
        env: Env,
        recipients: Vec<Address>,
        event_id: u64,
        name: String,
        description: String,
        image: String,
    ) -> Vec<u64> {
        let admin: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin not set");
        admin.require_auth();

        let mut token_ids: Vec<u64> = Vec::new(&env);

        for recipient in recipients.iter() {
            let token_id = Self::mint_event_nft(
                env.clone(),
                recipient.clone(),
                event_id,
                name.clone(),
                description.clone(),
                image.clone(),
            );
            token_ids.push_back(token_id);
        }

        log!(&env, "Batch minted {} NFTs for event: {}", token_ids.len(), event_id);
        token_ids
    }

    /// Get token owner
    pub fn owner_of(env: Env, token_id: u64) -> Address {
        env.storage()
            .persistent()
            .get(&DataKey::TokenOwner(token_id))
            .expect("Token not found")
    }

    /// Get token metadata
    pub fn token_metadata(env: Env, token_id: u64) -> NFTMetadata {
        env.storage()
            .persistent()
            .get(&DataKey::TokenMetadata(token_id))
            .expect("Token not found")
    }

    /// Get tokens owned by address
    pub fn tokens_of_owner(env: Env, owner: Address) -> Vec<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::OwnerTokens(owner))
            .unwrap_or(Vec::new(&env))
    }

    /// Get NFTs for specific event
    pub fn event_nfts(env: Env, event_id: u64) -> Vec<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::EventNFTs(event_id))
            .unwrap_or(Vec::new(&env))
    }

    /// Get total supply
    pub fn total_supply(env: Env) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::TokenCounter)
            .unwrap_or(0)
    }

    /// Transfer token (simple implementation)
    pub fn transfer(
        env: Env,
        from: Address,
        to: Address,
        token_id: u64,
    ) {
        from.require_auth();

        let current_owner: Address = env.storage()
            .persistent()
            .get(&DataKey::TokenOwner(token_id))
            .expect("Token not found");

        if current_owner != from {
            panic!("Not token owner");
        }

        // Update owner
        env.storage().persistent().set(&DataKey::TokenOwner(token_id), &to);

        // Update from owner's token list
        let mut from_tokens: Vec<u64> = env.storage()
            .persistent()
            .get(&DataKey::OwnerTokens(from.clone()))
            .unwrap_or(Vec::new(&env));
        
        // Remove token from current owner's list
        let mut new_from_tokens: Vec<u64> = Vec::new(&env);
        for token in from_tokens.iter() {
            if token != token_id {
                new_from_tokens.push_back(token);
            }
        }
        env.storage().persistent().set(&DataKey::OwnerTokens(from.clone()), &new_from_tokens);

        // Add to new owner's token list
        let mut to_tokens: Vec<u64> = env.storage()
            .persistent()
            .get(&DataKey::OwnerTokens(to.clone()))
            .unwrap_or(Vec::new(&env));
        to_tokens.push_back(token_id);
        env.storage().persistent().set(&DataKey::OwnerTokens(to.clone()), &to_tokens);

        log!(&env, "Token {} transferred from {} to {}", token_id, from, to);
    }

    /// Check if token exists
    pub fn token_exists(env: Env, token_id: u64) -> bool {
        env.storage().persistent().has(&DataKey::TokenOwner(token_id))
    }

    /// Update admin (only current admin)
    pub fn update_admin(env: Env, current_admin: Address, new_admin: Address) {
        current_admin.require_auth();

        let stored_admin: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin not set");

        if stored_admin != current_admin {
            panic!("Only admin can update admin");
        }

        env.storage().persistent().set(&DataKey::Admin, &new_admin);
        log!(&env, "Admin updated to: {}", new_admin);
    }

    /// Get current admin
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin not set")
    }
}
