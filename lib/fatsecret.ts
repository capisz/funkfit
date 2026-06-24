// On-device FatSecret food search for FunkFit.
//
// The original Elephit web app called FatSecret from a server route so the
// client secret never reached the browser. A bare Expo app has no server, so we
// call FatSecret directly using OAuth2 client-credentials. Provide credentials
// via app config / EAS secrets as EXPO_PUBLIC_FATSECRET_CLIENT_ID and
// EXPO_PUBLIC_FATSECRET_CLIENT_SECRET. When they are absent, search is disabled
// and the user can still log food manually.
//
// Note: EXPO_PUBLIC_* values are embedded in the app bundle, so treat the
// client secret as semi-public. For a production release, proxy these calls
// through a small backend instead.

const FATSECRET_TOKEN_URL = 'https://oauth.fatsecret.com/connect/token';
const FATSECRET_API_URL = 'https://platform.fatsecret.com/rest/server.api';

const CLIENT_ID =
  process.env.EXPO_PUBLIC_FATSECRET_CLIENT_ID ||
  process.env.EXPO_PUBLIC_FATSECRET_CONSUMER_KEY ||
  '';
const CLIENT_SECRET =
  process.env.EXPO_PUBLIC_FATSECRET_CLIENT_SECRET ||
  process.env.EXPO_PUBLIC_FATSECRET_CONSUMER_SECRET ||
  '';

export interface NormalizedFoodSearchResult {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  brand: string | null;
  type: string | null;
}

interface FatSecretToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface FatSecretFoodSearchItem {
  food_id?: string | number;
  food_name?: string;
  food_description?: string;
  brand_name?: string;
  food_type?: string;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

export function isFoodSearchConfigured(): boolean {
  return Boolean(CLIENT_ID && CLIENT_SECRET);
}

export async function searchFoods(query: string): Promise<NormalizedFoodSearchResult[]> {
  if (!isFoodSearchConfigured() || !query.trim()) return [];

  const data = await callFatSecretApi<{ foods?: { food?: FatSecretFoodSearchItem | FatSecretFoodSearchItem[] } }>({
    method: 'foods.search',
    search_expression: query,
    format: 'json',
    max_results: '20',
  });

  const rawFoods = data?.foods?.food;
  const foods = Array.isArray(rawFoods) ? rawFoods : rawFoods ? [rawFoods] : [];
  return foods.map(normalizeSearchFood);
}

async function callFatSecretApi<TResponse = unknown>(
  params: Record<string, string>
): Promise<TResponse | null> {
  const token = await getAccessToken();
  const response = await fetch(FATSECRET_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: toFormBody(params),
  });

  const text = await response.text();
  if (!response.ok) {
    console.error('FatSecret API request failed:', response.status, text);
    throw new Error('FatSecret API request failed');
  }
  return parseJson(text) as TResponse | null;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value;
  }

  const response = await fetch(FATSECRET_TOKEN_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${base64Encode(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: toFormBody({ grant_type: 'client_credentials', scope: 'basic' }),
  });

  const text = await response.text();
  const data = parseJson(text) as FatSecretToken | null;
  if (!response.ok || !data?.access_token) {
    console.error('FatSecret token request failed:', response.status, text);
    throw new Error('FatSecret token request failed');
  }

  const ttlMs = Math.max(0, (data.expires_in - 60) * 1000);
  cachedToken = { value: data.access_token, expiresAt: Date.now() + ttlMs };
  return data.access_token;
}

function normalizeSearchFood(food: FatSecretFoodSearchItem): NormalizedFoodSearchResult {
  const description = food.food_description || '';
  return {
    id: String(food.food_id || ''),
    name: food.food_name || 'Unknown food',
    calories: pickMacro(description, /Calories:\s*([\d.]+)/i),
    protein: pickMacro(description, /Protein:\s*([\d.]+)/i),
    carbs: pickMacro(description, /Carbs:\s*([\d.]+)/i),
    fat: pickMacro(description, /Fat:\s*([\d.]+)/i),
    brand: food.brand_name || null,
    type: food.food_type || null,
  };
}

function pickMacro(description: string, pattern: RegExp): number {
  const match = description.match(pattern);
  return match ? Number.parseFloat(match[1]) || 0 : 0;
}

function toFormBody(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// Minimal base64 for ASCII credentials (React Native has no Buffer/btoa).
const B64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function base64Encode(input: string): string {
  let output = '';
  let i = 0;
  while (i < input.length) {
    const c1 = input.charCodeAt(i++);
    const c2 = input.charCodeAt(i++);
    const c3 = input.charCodeAt(i++);
    const e1 = c1 >> 2;
    const e2 = ((c1 & 3) << 4) | (c2 >> 4);
    let e3 = ((c2 & 15) << 2) | (c3 >> 6);
    let e4 = c3 & 63;
    if (Number.isNaN(c2)) {
      e3 = 64;
      e4 = 64;
    } else if (Number.isNaN(c3)) {
      e4 = 64;
    }
    output +=
      B64_CHARS.charAt(e1) +
      B64_CHARS.charAt(e2) +
      (e3 === 64 ? '=' : B64_CHARS.charAt(e3)) +
      (e4 === 64 ? '=' : B64_CHARS.charAt(e4));
  }
  return output;
}
