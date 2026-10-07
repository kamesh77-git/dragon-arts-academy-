import "server-only";

import { MAPS_URL } from "./site";

// Live Google reviews via the Places API (New). Needs GOOGLE_PLACES_API_KEY
// (Places API (New) enabled on the key). GOOGLE_PLACE_ID is optional: when
// it's missing the place is looked up once by name and cached.
//
// Google returns at most 5 reviews ("most relevant" order) plus the overall
// rating and count. Responses are cached for a day. We show Google's
// selection as returned, with author attribution, as the Maps Platform
// terms require. No Review / AggregateRating schema is emitted: Google's
// structured-data guidelines don't allow marking up third-party (Google)
// reviews on your own site.

export interface GoogleReview {
  author: string;
  authorUrl?: string;
  photo?: string;
  rating: number;
  relativeTime: string;
  publishTime?: string;
  text: string;
}

export interface GoogleReviewsData {
  rating: number;
  total: number;
  mapsUrl: string;
  writeReviewUrl: string;
  reviews: GoogleReview[];
}

const SEARCH_QUERY = "Dragon Ryu Arts Academy, Mannivakkam, Chennai";
const DAY = 60 * 60 * 24;

export function writeReviewUrl(placeId?: string) {
  return placeId ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}` : MAPS_URL;
}

async function findPlaceId(key: string): Promise<string | null> {
  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "places.id,places.displayName",
    },
    body: JSON.stringify({ textQuery: SEARCH_QUERY, languageCode: "en", regionCode: "IN" }),
    next: { revalidate: DAY * 30, tags: ["google-reviews"] },
  });
  if (!res.ok) throw new Error(`Places searchText ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { places?: { id: string }[] };
  return data.places?.[0]?.id ?? null;
}

interface PlaceDetails {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  reviews?: {
    rating?: number;
    relativePublishTimeDescription?: string;
    publishTime?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
}

export function parsePlaceDetails(data: PlaceDetails, placeId?: string): GoogleReviewsData | null {
  if (!data.rating || !data.userRatingCount) return null;
  return {
    rating: Math.round(data.rating * 10) / 10,
    total: data.userRatingCount,
    mapsUrl: data.googleMapsUri ?? MAPS_URL,
    writeReviewUrl: writeReviewUrl(placeId),
    reviews: (data.reviews ?? [])
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google user",
        authorUrl: r.authorAttribution?.uri,
        photo: r.authorAttribution?.photoUri,
        rating: r.rating ?? 0,
        relativeTime: r.relativePublishTimeDescription ?? "",
        publishTime: r.publishTime,
        text: (r.text?.text ?? r.originalText?.text ?? "").trim(),
      }))
      .filter((r) => r.text.length > 0),
  };
}

export async function getGoogleReviews(): Promise<GoogleReviewsData | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return null;

  try {
    const placeId = process.env.GOOGLE_PLACE_ID || (await findPlaceId(key));
    if (!placeId) {
      console.error("[google-reviews] place not found for:", SEARCH_QUERY);
      return null;
    }
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=en`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "rating,userRatingCount,googleMapsUri,reviews",
      },
      next: { revalidate: DAY, tags: ["google-reviews"] },
    });
    if (!res.ok) throw new Error(`Place details ${res.status}: ${await res.text()}`);
    return parsePlaceDetails((await res.json()) as PlaceDetails, placeId);
  } catch (err) {
    console.error("[google-reviews] failed, hiding reviews:", err);
    return null;
  }
}
