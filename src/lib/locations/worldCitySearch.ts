export type PlaceSuggestion = {
  label: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
};

const fallbackCities: PlaceSuggestion[] = [
  { label: "New York, United States", city: "New York", region: "New York", country: "United States", countryCode: "US" },
  { label: "Los Angeles, United States", city: "Los Angeles", region: "California", country: "United States", countryCode: "US" },
  { label: "San Francisco, United States", city: "San Francisco", region: "California", country: "United States", countryCode: "US" },
  { label: "San Diego, United States", city: "San Diego", region: "California", country: "United States", countryCode: "US" },
  { label: "London, United Kingdom", city: "London", region: "England", country: "United Kingdom", countryCode: "GB" },
  { label: "Londrina, Brazil", city: "Londrina", region: "Paraná", country: "Brazil", countryCode: "BR" },
  { label: "Paris, France", city: "Paris", region: "Île-de-France", country: "France", countryCode: "FR" },
  { label: "Paramaribo, Suriname", city: "Paramaribo", region: "Paramaribo District", country: "Suriname", countryCode: "SR" },
  { label: "Parma, Italy", city: "Parma", region: "Emilia-Romagna", country: "Italy", countryCode: "IT" },
  { label: "Berlin, Germany", city: "Berlin", region: "Berlin", country: "Germany", countryCode: "DE" },
  { label: "Madrid, Spain", city: "Madrid", region: "Community of Madrid", country: "Spain", countryCode: "ES" },
  { label: "Rome, Italy", city: "Rome", region: "Lazio", country: "Italy", countryCode: "IT" },
  { label: "Amsterdam, Netherlands", city: "Amsterdam", region: "North Holland", country: "Netherlands", countryCode: "NL" },
  { label: "Lisbon, Portugal", city: "Lisbon", region: "Lisbon", country: "Portugal", countryCode: "PT" },
  { label: "Toronto, Canada", city: "Toronto", region: "Ontario", country: "Canada", countryCode: "CA" },
  { label: "Vancouver, Canada", city: "Vancouver", region: "British Columbia", country: "Canada", countryCode: "CA" },
  { label: "Mexico City, Mexico", city: "Mexico City", region: "Mexico City", country: "Mexico", countryCode: "MX" },
  { label: "São Paulo, Brazil", city: "São Paulo", region: "São Paulo", country: "Brazil", countryCode: "BR" },
  { label: "Buenos Aires, Argentina", city: "Buenos Aires", region: "Buenos Aires", country: "Argentina", countryCode: "AR" },
  { label: "Santiago, Chile", city: "Santiago", region: "Santiago Metropolitan Region", country: "Chile", countryCode: "CL" },
  { label: "San Salvador, El Salvador", city: "San Salvador", region: "San Salvador Department", country: "El Salvador", countryCode: "SV" },
  { label: "Bogotá, Colombia", city: "Bogotá", region: "Capital District", country: "Colombia", countryCode: "CO" },
  { label: "Lima, Peru", city: "Lima", region: "Lima Province", country: "Peru", countryCode: "PE" },
  { label: "Istanbul, Turkey", city: "Istanbul", region: "Istanbul Province", country: "Turkey", countryCode: "TR" },
  { label: "Dubai, United Arab Emirates", city: "Dubai", region: "Dubai", country: "United Arab Emirates", countryCode: "AE" },
  { label: "Tel Aviv, Israel", city: "Tel Aviv", region: "Tel Aviv District", country: "Israel", countryCode: "IL" },
  { label: "Cairo, Egypt", city: "Cairo", region: "Cairo Governorate", country: "Egypt", countryCode: "EG" },
  { label: "Cape Town, South Africa", city: "Cape Town", region: "Western Cape", country: "South Africa", countryCode: "ZA" },
  { label: "Johannesburg, South Africa", city: "Johannesburg", region: "Gauteng", country: "South Africa", countryCode: "ZA" },
  { label: "Moscow, Russia", city: "Moscow", region: "Moscow", country: "Russia", countryCode: "RU" },
  { label: "Saint Petersburg, Russia", city: "Saint Petersburg", region: "Saint Petersburg", country: "Russia", countryCode: "RU" },
  { label: "Bangkok, Thailand", city: "Bangkok", region: "Bangkok", country: "Thailand", countryCode: "TH" },
  { label: "Singapore, Singapore", city: "Singapore", region: "Central Region", country: "Singapore", countryCode: "SG" },
  { label: "Hong Kong, Hong Kong", city: "Hong Kong", region: "Hong Kong", country: "Hong Kong", countryCode: "HK" },
  { label: "Tokyo, Japan", city: "Tokyo", region: "Tokyo", country: "Japan", countryCode: "JP" },
  { label: "Seoul, South Korea", city: "Seoul", region: "Seoul", country: "South Korea", countryCode: "KR" },
  { label: "Beijing, China", city: "Beijing", region: "Beijing", country: "China", countryCode: "CN" },
  { label: "Shanghai, China", city: "Shanghai", region: "Shanghai", country: "China", countryCode: "CN" },
  { label: "Mumbai, India", city: "Mumbai", region: "Maharashtra", country: "India", countryCode: "IN" },
  { label: "Delhi, India", city: "Delhi", region: "Delhi", country: "India", countryCode: "IN" },
  { label: "Sydney, Australia", city: "Sydney", region: "New South Wales", country: "Australia", countryCode: "AU" },
  { label: "Melbourne, Australia", city: "Melbourne", region: "Victoria", country: "Australia", countryCode: "AU" },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function searchFallbackCities(query: string, limit = 8): PlaceSuggestion[] {
  const normalized = normalize(query.trim());
  if (normalized.length < 2) return [];

  return fallbackCities
    .map((place, index) => {
      const city = normalize(place.city);
      const label = normalize(place.label);
      const country = normalize(place.country);
      let rank = 99;

      if (city.startsWith(normalized)) rank = 0;
      else if (city.includes(normalized)) rank = 1;
      else if (label.startsWith(normalized)) rank = 2;
      else if (label.includes(normalized)) rank = 3;
      else if (country.includes(normalized)) rank = 4;

      return { place, rank, index };
    })
    .filter(({ rank }) => rank < 99)
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ place }) => place)
    .slice(0, limit);
}

type GeoNamesPlace = {
  name?: string;
  adminName1?: string;
  countryName?: string;
  countryCode?: string;
  fcl?: string;
};

type GeoNamesResponse = {
  geonames?: GeoNamesPlace[];
  status?: {
    message?: string;
    value?: number;
  };
};

function mapGeoNamesPlace(place: GeoNamesPlace): PlaceSuggestion | null {
  if (place.fcl && place.fcl !== "P") return null;

  const city = place.name ?? "";
  const country = place.countryName ?? "";
  if (!city || !country) return null;

  return {
    label: `${city}, ${country}`,
    city,
    region: place.adminName1 ?? "",
    country,
    countryCode: place.countryCode ?? "",
  };
}

export async function searchWorldCities(query: string, limit = 8): Promise<PlaceSuggestion[]> {
  const normalized = query.trim();
  if (normalized.length < 2) return [];

  const username = process.env.GEONAMES_USERNAME?.trim();
  if (!username) return searchFallbackCities(normalized, limit);

  try {
    const url = new URL("https://secure.geonames.org/searchJSON");
    url.searchParams.set("q", normalized);
    url.searchParams.set("featureClass", "P");
    url.searchParams.set("maxRows", String(limit));
    url.searchParams.set("lang", "en");
    url.searchParams.set("isNameRequired", "true");
    url.searchParams.set("orderby", "relevance");
    url.searchParams.set("username", username);

    const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
    if (!response.ok) return searchFallbackCities(normalized, limit);

    const data = (await response.json()) as GeoNamesResponse;
    if (data.status) return searchFallbackCities(normalized, limit);

    const places = (data.geonames ?? [])
      .map(mapGeoNamesPlace)
      .filter((place): place is PlaceSuggestion => Boolean(place));

    return places.length ? places.slice(0, limit) : searchFallbackCities(normalized, limit);
  } catch {
    return searchFallbackCities(normalized, limit);
  }
}
