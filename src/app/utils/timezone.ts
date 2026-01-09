// Timezone utility for U.S. flight booking

/**
 * Determines the appropriate timezone for a field based on its ID
 * @param fieldId - The field identifier (e.g., 'departureDate', 'returnDate')
 * @returns Timezone abbreviation or undefined
 */
export function getTimezoneForField(fieldId?: string): string | undefined {
  if (!fieldId) return undefined;

  const lowerFieldId = fieldId.toLowerCase();

  // Departure dates typically use the departure city's timezone
  if (lowerFieldId.includes('departure')) {
    return 'ET'; // Eastern Time (can be dynamic based on departure city)
  }

  // Return dates typically use the departure city's timezone
  if (lowerFieldId.includes('return')) {
    return 'ET'; // Eastern Time
  }

  // Arrival dates use arrival city timezone
  if (lowerFieldId.includes('arrival')) {
    return 'PT'; // Pacific Time (can be dynamic based on arrival city)
  }

  // Check-in/Check-out for hotels use local time
  if (lowerFieldId.includes('checkin') || lowerFieldId.includes('checkout')) {
    return undefined; // Local time, no specific timezone label needed
  }

  return undefined;
}

/**
 * Gets the timezone for a specific U.S. city
 * @param city - City name
 * @returns Timezone abbreviation
 */
export function getTimezoneForCity(city: string): string {
  const cityLower = city.toLowerCase();

  // Eastern Time (ET)
  const easternCities = ['new york', 'boston', 'atlanta', 'miami', 'washington'];
  if (easternCities.some(c => cityLower.includes(c))) {
    return 'ET';
  }

  // Central Time (CT)
  const centralCities = ['chicago', 'dallas', 'houston', 'austin', 'denver'];
  if (centralCities.some(c => cityLower.includes(c))) {
    return 'CT';
  }

  // Mountain Time (MT)
  const mountainCities = ['denver', 'phoenix', 'salt lake'];
  if (mountainCities.some(c => cityLower.includes(c))) {
    return 'MT';
  }

  // Pacific Time (PT)
  const pacificCities = ['los angeles', 'san francisco', 'seattle', 'portland', 'las vegas'];
  if (pacificCities.some(c => cityLower.includes(c))) {
    return 'PT';
  }

  // Default to ET
  return 'ET';
}

/**
 * Formats a date with U.S. formatting and timezone
 * @param dateString - Date in YYYY-MM-DD format
 * @param timezone - Optional timezone abbreviation
 * @returns Formatted date string (e.g., "March 18, 2026 (ET)")
 */
export function formatDateWithTimezone(dateString: string, timezone?: string): string {
  const date = new Date(dateString + 'T12:00:00'); // Add time to avoid timezone issues
  const formatted = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return timezone ? `${formatted} (${timezone})` : formatted;
}
