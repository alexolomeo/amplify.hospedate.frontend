export function formatLocation(location: { city?: string; state?: string }) {
  return [location.city, location.state].filter(Boolean).join(', ');
}
