#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, log};

#[derive(Clone)]
#[contracttype]
pub struct RewardToken {
    pub name: String,
    pub symbol: String,
    pub decimals: u32,
    pub total_supply: i128,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    TokenInfo,
    Balance(Address),
    Admin,
    EventRewards(u64),
    ClaimedRewards(Address, u64), // (user, event_id)
}

#[contract]
pub struct TokenRewards;

#[contractimpl]
impl TokenRewards {
    /// Initialize the token rewards contract
    pub fn init(
        env: Env,
        admin: Address,
        name: String,
        symbol: String,
        decimals: u32,
        total_supply: i128,
    ) {
        let token = RewardToken {
            name,
            symbol,
            decimals,
            total_supply,
        };

        env.storage().persistent().set(&DataKey::TokenInfo, &token);
        env.storage().persistent().set(&DataKey::Admin, &admin);
        
        // Give all initial supply to admin
        env.storage().persistent().set(&DataKey::Balance(admin.clone()), &total_supply);

        log!(&env, "Token Rewards initialized: {} ({})", token.name, token.symbol);
    }

    /// Set reward amount for an event
    pub fn set_event_reward(
        env: Env,
        admin: Address,
        event_id: u64,
        reward_amount: i128,
    ) {
        admin.require_auth();

        let stored_admin: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin not set");

        if stored_admin != admin {
            panic!("Only admin can set event rewards");
        }

        env.storage().persistent().set(&DataKey::EventRewards(event_id), &reward_amount);
        
        log!(&env, "Event reward set: {} tokens for event {}", reward_amount, event_id);
    }

    /// Claim tokens for attending an event
    pub fn claim_event_reward(
        env: Env,
        user: Address,
        event_id: u64,
    ) -> i128 {
        user.require_auth();

        // Check if already claimed
        let claim_key = DataKey::ClaimedRewards(user.clone(), event_id);
        if env.storage().persistent().has(&claim_key) {
            panic!("Reward already claimed for this event");
        }

        // Get reward amount for event
        let reward_amount: i128 = env.storage()
            .persistent()
            .get(&DataKey::EventRewards(event_id))
            .unwrap_or(0);

        if reward_amount == 0 {
            panic!("No reward set for this event");
        }

        // Get admin balance (contract's token pool)
        let admin: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin not set");
        
        let admin_balance: i128 = env.storage()
            .persistent()
            .get(&DataKey::Balance(admin.clone()))
            .unwrap_or(0);

        if admin_balance < reward_amount {
            panic!("Insufficient tokens in reward pool");
        }

        // Transfer tokens from admin to user
        let new_admin_balance = admin_balance - reward_amount;
        let user_balance: i128 = env.storage()
            .persistent()
            .get(&DataKey::Balance(user.clone()))
            .unwrap_or(0);
        let new_user_balance = user_balance + reward_amount;

        // Update balances
        env.storage().persistent().set(&DataKey::Balance(admin), &new_admin_balance);
        env.storage().persistent().set(&DataKey::Balance(user.clone()), &new_user_balance);

        // Mark as claimed
        env.storage().persistent().set(&claim_key, &true);

        log!(&env, "Reward claimed: {} tokens by {} for event {}", reward_amount, user, event_id);
        reward_amount
    }

    /// Batch distribute rewards to multiple users
    pub fn batch_distribute_rewards(
        env: Env,
        admin: Address,
        event_id: u64,
        recipients: Vec<Address>,
    ) -> Vec<i128> {
        admin.require_auth();

        let stored_admin: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin not set");

        if stored_admin != admin {
            panic!("Only admin can batch distribute rewards");
        }

        let reward_amount: i128 = env.storage()
            .persistent()
            .get(&DataKey::EventRewards(event_id))
            .unwrap_or(0);

        if reward_amount == 0 {
            panic!("No reward set for this event");
        }

        let total_reward = reward_amount * (recipients.len() as i128);
        let admin_balance: i128 = env.storage()
            .persistent()
            .get(&DataKey::Balance(admin.clone()))
            .unwrap_or(0);

        if admin_balance < total_reward {
            panic!("Insufficient tokens in reward pool");
        }

        let mut distributed_amounts: Vec<i128> = Vec::new(&env);
        let mut new_admin_balance = admin_balance;

        for recipient in recipients.iter() {
            let claim_key = DataKey::ClaimedRewards(recipient.clone(), event_id);
            
            if !env.storage().persistent().has(&claim_key) {
                let user_balance: i128 = env.storage()
                    .persistent()
                    .get(&DataKey::Balance(recipient.clone()))
                    .unwrap_or(0);
                
                let new_user_balance = user_balance + reward_amount;
                new_admin_balance -= reward_amount;

                env.storage().persistent().set(&DataKey::Balance(recipient.clone()), &new_user_balance);
                env.storage().persistent().set(&claim_key, &true);

                distributed_amounts.push_back(reward_amount);
            } else {
                distributed_amounts.push_back(0); // Already claimed
            }
        }

        env.storage().persistent().set(&DataKey::Balance(admin), &new_admin_balance);

        log!(&env, "Batch distributed rewards for event {}: {} recipients", event_id, recipients.len());
        distributed_amounts
    }

    /// Get token balance
    pub fn balance(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::Balance(user))
            .unwrap_or(0)
    }

    /// Get token info
    pub fn token_info(env: Env) -> RewardToken {
        env.storage()
            .persistent()
            .get(&DataKey::TokenInfo)
            .expect("Token not initialized")
    }

    /// Transfer tokens between users
    pub fn transfer(
        env: Env,
        from: Address,
        to: Address,
        amount: i128,
    ) {
        from.require_auth();

        if amount <= 0 {
            panic!("Transfer amount must be positive");
        }

        let from_balance: i128 = env.storage()
            .persistent()
            .get(&DataKey::Balance(from.clone()))
            .unwrap_or(0);

        if from_balance < amount {
            panic!("Insufficient balance");
        }

        let to_balance: i128 = env.storage()
            .persistent()
            .get(&DataKey::Balance(to.clone()))
            .unwrap_or(0);

        let new_from_balance = from_balance - amount;
        let new_to_balance = to_balance + amount;

        env.storage().persistent().set(&DataKey::Balance(from.clone()), &new_from_balance);
        env.storage().persistent().set(&DataKey::Balance(to.clone()), &new_to_balance);

        log!(&env, "Transferred {} tokens from {} to {}", amount, from, to);
    }

    /// Check if user has claimed reward for event
    pub fn has_claimed_reward(env: Env, user: Address, event_id: u64) -> bool {
        let claim_key = DataKey::ClaimedRewards(user, event_id);
        env.storage().persistent().has(&claim_key)
    }

    /// Get event reward amount
    pub fn get_event_reward(env: Env, event_id: u64) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::EventRewards(event_id))
            .unwrap_or(0)
    }

    /// Mint additional tokens (admin only)
    pub fn mint(env: Env, admin: Address, amount: i128) {
        admin.require_auth();

        let stored_admin: Address = env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin not set");

        if stored_admin != admin {
            panic!("Only admin can mint tokens");
        }

        let admin_balance: i128 = env.storage()
            .persistent()
            .get(&DataKey::Balance(admin.clone()))
            .unwrap_or(0);
        
        let new_admin_balance = admin_balance + amount;

        // Update total supply
        let mut token_info: RewardToken = env.storage()
            .persistent()
            .get(&DataKey::TokenInfo)
            .expect("Token not initialized");
        
        token_info.total_supply += amount;

        env.storage().persistent().set(&DataKey::Balance(admin), &new_admin_balance);
        env.storage().persistent().set(&DataKey::TokenInfo, &token_info);

        log!(&env, "Minted {} tokens to admin", amount);
    }

    /// Get current admin
    pub fn get_admin(env: Env) -> Address {
        env.storage()
            .persistent()
            .get(&DataKey::Admin)
            .expect("Admin not set")
    }
}
