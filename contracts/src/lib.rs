#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, Address, Env, Symbol, Vec, String, IntoVal,
};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Initialized,
    Organizer,
    Name,
    TokenAddr,        // optional: token/NFT contract address to mint on join
    Joined(Address),  // per-attendee marker
    JoinCount,
}

#[contract]
pub struct KaizenEvent;

/// Minimal interface for a token-like contract with "mint" (fungible OR NFT-1)
/// If using OpenZeppelin Soroban NFT, switch `mint` signature accordingly.
pub trait TokenLike {
    fn mint(env: &Env, token: &Address, to: &Address, amount: i128);
}

pub struct TokenClient;
impl TokenLike for TokenClient {
    fn mint(env: &Env, token: &Address, to: &Address, amount: i128) {
        // Calls token contract's `mint`(to, amount). Adjust name if using NFT impl.
        let _ = env.invoke_contract(
            token,
            &Symbol::new(env, "mint"),
            (to.clone(), amount).into_val(env),
        );
    }
}

#[contractimpl]
impl KaizenEvent {
    /// One-time initializer for an event instance.
    /// `token` is optional: if Some, contract will mint 1 unit to attendee on join.
    pub fn init(e: Env, organizer: Address, name: String, token: Option<Address>) {
        if e.storage().instance().has(&DataKey::Initialized) {
            panic!("already initialized");
        }
        organizer.require_auth(); // organizer must authorize init

        e.storage().instance().set(&DataKey::Initialized, &true);
        e.storage().instance().set(&DataKey::Organizer, &organizer);
        e.storage().instance().set(&DataKey::Name, &name);
        if let Some(t) = token {
            e.storage().instance().set(&DataKey::TokenAddr, &t);
        }
        e.storage().instance().set(&DataKey::JoinCount, &0i128);

        e.events().publish(
            (Symbol::new(&e, "kaizen"), Symbol::new(&e, "init")),
            (organizer, name),
        );
    }

    /// Returns tuple: (name, organizer, token_addr_opt, join_count)
    pub fn info(e: Env) -> (String, Address, Option<Address>, i128) {
        let name: String = e.storage().instance().get(&DataKey::Name).unwrap();
        let organizer: Address = e.storage().instance().get(&DataKey::Organizer).unwrap();
        let token: Option<Address> = e.storage().instance().get(&DataKey::TokenAddr).unwrap_or(None);
        let count: i128 = e.storage().instance().get(&DataKey::JoinCount).unwrap_or(0i128);
        (name, organizer, token, count)
    }

    /// Attendee joins the event.
    /// - requires attendee auth
    /// - prevents double-join
    /// - optionally mints 1 unit from token/NFT contract to attendee
    pub fn join(e: Env, attendee: Address) {
        attendee.require_auth(); // host-managed auth

        let joined_key = DataKey::Joined(attendee.clone());
        if e.storage().persistent().has(&joined_key) {
            panic!("already joined");
        }

        // Mark joined
        e.storage().persistent().set(&joined_key, &true);

        // Increment count
        let mut count: i128 = e.storage().instance().get(&DataKey::JoinCount).unwrap_or(0i128);
        count += 1;
        e.storage().instance().set(&DataKey::JoinCount, &count);

        // Optional mint/airdrop (1 unit)
        if let Some(token_addr) = e.storage().instance().get::<_, Address>(&DataKey::TokenAddr) {
            TokenClient::mint(&e, &token_addr, &attendee, 1i128);
        }

        // Emit an event for indexers/UX
        e.events().publish(
            (Symbol::new(&e, "kaizen"), Symbol::new(&e, "join")),
            attendee,
        );
    }

    /// Check if an address joined.
    pub fn has_joined(e: Env, addr: Address) -> bool {
        e.storage().persistent().get(&DataKey::Joined(addr)).unwrap_or(false)
    }

    /// Optional: only organizer can set/replace token later.
    pub fn set_token(e: Env, caller: Address, token: Address) {
        let org: Address = e.storage().instance().get(&DataKey::Organizer).unwrap();
        caller.require_auth();
        if caller != org { panic!("only organizer"); }
        e.storage().instance().set(&DataKey::TokenAddr, &token);
    }
}
