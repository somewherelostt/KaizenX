#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Vec, Map, IntoVal, TryFromVal, BytesN, log};

#[derive(Clone)]
#[contracttype]
pub struct Event {
    pub id: u64,
    pub title: String,
    pub description: String,
    pub organizer: Address,
    pub date: u64,
    pub location: String,
    pub price: i128,
    pub max_attendees: u32,
    pub current_attendees: u32,
    pub is_active: bool,
    pub nft_contract: Option<Address>,
    pub token_reward_amount: i128,
}

#[derive(Clone)]
#[contracttype]
pub struct Ticket {
    pub event_id: u64,
    pub attendee: Address,
    pub purchase_timestamp: u64,
    pub ticket_id: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    EventCounter,
    Event(u64),
    Ticket(u64, Address), // (event_id, attendee)
    EventAttendees(u64),
    UserTickets(Address),
}

#[contract]
pub struct EventManager;

#[contractimpl]
impl EventManager {
    /// Initialize the contract
    pub fn init(env: Env) {
        let counter: u64 = 0;
        env.storage().persistent().set(&DataKey::EventCounter, &counter);
    }

    /// Create a new event
    pub fn create_event(
        env: Env,
        organizer: Address,
        title: String,
        description: String,
        date: u64,
        location: String,
        price: i128,
        max_attendees: u32,
        token_reward_amount: i128,
    ) -> u64 {
        organizer.require_auth();

        // Get and increment event counter
        let mut counter: u64 = env.storage()
            .persistent()
            .get(&DataKey::EventCounter)
            .unwrap_or(0);
        
        counter += 1;

        let event = Event {
            id: counter,
            title: title.clone(),
            description,
            organizer: organizer.clone(),
            date,
            location,
            price,
            max_attendees,
            current_attendees: 0,
            is_active: true,
            nft_contract: None,
            token_reward_amount,
        };

        // Store the event
        env.storage().persistent().set(&DataKey::Event(counter), &event);
        env.storage().persistent().set(&DataKey::EventCounter, &counter);
        
        // Initialize attendees list
        let attendees: Vec<Address> = Vec::new(&env);
        env.storage().persistent().set(&DataKey::EventAttendees(counter), &attendees);

        log!(&env, "Event created: {} with ID: {}", title, counter);
        counter
    }

    /// Purchase a ticket for an event
    pub fn purchase_ticket(
        env: Env,
        attendee: Address,
        event_id: u64,
    ) -> u64 {
        attendee.require_auth();

        // Get event
        let mut event: Event = env.storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .expect("Event not found");

        // Check if event is active and not full
        if !event.is_active {
            panic!("Event is not active");
        }

        if event.current_attendees >= event.max_attendees {
            panic!("Event is full");
        }

        // Check if user already has a ticket
        let ticket_key = DataKey::Ticket(event_id, attendee.clone());
        if env.storage().persistent().has(&ticket_key) {
            panic!("Already have a ticket for this event");
        }

        // Create ticket
        let ticket_id = event_id * 10000 + (event.current_attendees as u64) + 1;
        let ticket = Ticket {
            event_id,
            attendee: attendee.clone(),
            purchase_timestamp: env.ledger().timestamp(),
            ticket_id,
        };

        // Update event attendees
        event.current_attendees += 1;
        
        // Get and update attendees list
        let mut attendees: Vec<Address> = env.storage()
            .persistent()
            .get(&DataKey::EventAttendees(event_id))
            .unwrap_or(Vec::new(&env));
        attendees.push_back(attendee.clone());

        // Update user's tickets list
        let mut user_tickets: Vec<u64> = env.storage()
            .persistent()
            .get(&DataKey::UserTickets(attendee.clone()))
            .unwrap_or(Vec::new(&env));
        user_tickets.push_back(ticket_id);

        // Store updates
        env.storage().persistent().set(&DataKey::Event(event_id), &event);
        env.storage().persistent().set(&ticket_key, &ticket);
        env.storage().persistent().set(&DataKey::EventAttendees(event_id), &attendees);
        env.storage().persistent().set(&DataKey::UserTickets(attendee.clone()), &user_tickets);

        log!(&env, "Ticket purchased: {} for event: {}", ticket_id, event_id);
        ticket_id
    }

    /// Get event details
    pub fn get_event(env: Env, event_id: u64) -> Event {
        env.storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .expect("Event not found")
    }

    /// Get user's tickets
    pub fn get_user_tickets(env: Env, user: Address) -> Vec<u64> {
        env.storage()
            .persistent()
            .get(&DataKey::UserTickets(user))
            .unwrap_or(Vec::new(&env))
    }

    /// Get event attendees
    pub fn get_event_attendees(env: Env, event_id: u64) -> Vec<Address> {
        env.storage()
            .persistent()
            .get(&DataKey::EventAttendees(event_id))
            .unwrap_or(Vec::new(&env))
    }

    /// Update event status (organizer only)
    pub fn update_event_status(
        env: Env,
        organizer: Address,
        event_id: u64,
        is_active: bool,
    ) {
        organizer.require_auth();

        let mut event: Event = env.storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .expect("Event not found");

        if event.organizer != organizer {
            panic!("Only organizer can update event status");
        }

        event.is_active = is_active;
        env.storage().persistent().set(&DataKey::Event(event_id), &event);

        log!(&env, "Event status updated: {} -> {}", event_id, is_active);
    }

    /// Set NFT contract for event rewards
    pub fn set_event_nft_contract(
        env: Env,
        organizer: Address,
        event_id: u64,
        nft_contract: Address,
    ) {
        organizer.require_auth();

        let mut event: Event = env.storage()
            .persistent()
            .get(&DataKey::Event(event_id))
            .expect("Event not found");

        if event.organizer != organizer {
            panic!("Only organizer can set NFT contract");
        }

        event.nft_contract = Some(nft_contract);
        env.storage().persistent().set(&DataKey::Event(event_id), &event);

        log!(&env, "NFT contract set for event: {}", event_id);
    }

    /// Get total number of events
    pub fn get_event_count(env: Env) -> u64 {
        env.storage()
            .persistent()
            .get(&DataKey::EventCounter)
            .unwrap_or(0)
    }

    /// Check if user has ticket for event
    pub fn has_ticket(env: Env, user: Address, event_id: u64) -> bool {
        let ticket_key = DataKey::Ticket(event_id, user);
        env.storage().persistent().has(&ticket_key)
    }
}
