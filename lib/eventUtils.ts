/**
 * Event utility functions
 */

/**
 * Check if an event has passed the current date and is completed
 * @param eventDate - The date of the event
 * @returns boolean indicating if the event is completed
 */
export function isEventCompleted(eventDate: string | Date): boolean {
  if (!eventDate) return false;
  
  const now = new Date();
  const eventDateTime = new Date(eventDate);
  
  // Set current time to start of today to compare dates only
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Set event date to start of event day for comparison
  const eventDay = new Date(eventDateTime);
  eventDay.setHours(0, 0, 0, 0);
  
  const isCompleted = eventDay < today;
  
  // Debug logging (remove in production)
  console.log(`Event date: ${eventDay.toDateString()}, Today: ${today.toDateString()}, Completed: ${isCompleted}`);
  
  return isCompleted;
}

/**
 * Get the status display text for an event
 * @param eventDate - The date of the event
 * @returns Object with status text and styling info
 */
export function getEventStatus(eventDate: string | Date) {
  const isCompleted = isEventCompleted(eventDate);
  
  if (isCompleted) {
    return {
      text: "Event Completed",
      className: "bg-kaizen-gray text-kaizen-white",
      isCompleted: true
    };
  }
  
  return {
    text: "Join now",
    className: "bg-kaizen-yellow text-kaizen-black hover:bg-kaizen-yellow/90",
    isCompleted: false
  };
}

/**
 * Format event date for display
 * @param eventDate - The date of the event
 * @returns Formatted date string
 */
export function formatEventDate(eventDate: string | Date): string {
  if (!eventDate) return "TBD";
  
  const date = new Date(eventDate);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format event time for display
 * @param eventDate - The date of the event
 * @returns Formatted time string
 */
export function formatEventTime(eventDate: string | Date): string {
  if (!eventDate) return "TBD";
  
  const date = new Date(eventDate);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
