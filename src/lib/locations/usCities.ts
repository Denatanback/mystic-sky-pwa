export const popularUsCities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "Austin, TX",
  "San Jose, CA",
  "Jacksonville, FL",
  "Fort Worth, TX",
  "Columbus, OH",
  "Charlotte, NC",
  "San Francisco, CA",
  "Indianapolis, IN",
  "Seattle, WA",
  "Denver, CO",
  "Washington, DC",
  "Boston, MA",
  "Nashville, TN",
  "Miami, FL",
  "Atlanta, GA",
  "Las Vegas, NV",
  "Portland, OR",
  "Orlando, FL",
  "Tampa, FL",
  "Minneapolis, MN",
  "Detroit, MI",
];

export function findUsCities(query: string, limit = 6) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return popularUsCities.slice(0, limit);

  return popularUsCities
    .filter((city) => city.toLowerCase().includes(normalized))
    .slice(0, limit);
}
