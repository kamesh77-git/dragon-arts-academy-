/* eslint-disable @next/next/no-img-element -- reviewer photos are Google-hosted with unknown sizes */
import type { GoogleReviewsData } from "@/lib/google-reviews";
import { MAPS_URL } from "@/lib/site";
import ReviewText from "./ReviewText";
import Stars from "./Stars";

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.58-5.05-3.71H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.71A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l2.99-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l2.99 2.33C4.66 5.16 6.65 3.58 9 3.58z" />
    </svg>
  );
}

export default function GoogleReviews({ data }: { data: GoogleReviewsData | null }) {
  const writeUrl = data?.writeReviewUrl ?? MAPS_URL;

  return (
    <section className="section reviews" id="reviews" aria-labelledby="reviews-title">
      <div className="container">
        <div className="section__header">
          <p className="section__eyebrow">Google Reviews</p>
          <h2 className="section__title" id="reviews-title">What Families Say About Us</h2>
          {!data && (
            <p className="section__desc">
              Trained with us? Your review helps other parents in Mannivakkam find the right class.
            </p>
          )}
        </div>

        <div className="reviews__summary card-3d">
          <div className="reviews__brand">
            <GoogleG />
            <span>Google</span>
          </div>
          {data ? (
            <div className="reviews__score">
              <strong>{data.rating.toFixed(1)}</strong>
              <div>
                <Stars rating={data.rating} size={22} />
                <p>Based on {data.total.toLocaleString("en-IN")} Google reviews</p>
              </div>
            </div>
          ) : (
            <p className="reviews__cta-text">Share your experience at Dragon Ryu Arts Academy on Google.</p>
          )}
          <div className="reviews__actions">
            <a href={writeUrl} target="_blank" rel="noopener" className="btn btn--primary">Write a review</a>
            {data && (
              <a href={data.mapsUrl} target="_blank" rel="noopener" className="btn btn--outline-dark">See all reviews</a>
            )}
          </div>
        </div>

        {data && data.reviews.length > 0 && (
          <>
            <ul className="reviews__grid">
              {data.reviews.map((r) => (
                <li key={`${r.author}-${r.publishTime ?? r.relativeTime}`} className="review-card card-3d">
                  <div className="review-card__head">
                    {r.photo ? (
                      <img src={r.photo} alt="" width={44} height={44} className="review-card__avatar" referrerPolicy="no-referrer" loading="lazy" />
                    ) : (
                      <span className="review-card__avatar review-card__avatar--initial" aria-hidden="true">{r.author.charAt(0)}</span>
                    )}
                    <div>
                      {r.authorUrl ? (
                        <a href={r.authorUrl} target="_blank" rel="noopener nofollow" className="review-card__author">{r.author}</a>
                      ) : (
                        <span className="review-card__author">{r.author}</span>
                      )}
                      <p className="review-card__time">{r.relativeTime}</p>
                    </div>
                  </div>
                  <Stars rating={r.rating} size={16} />
                  <ReviewText text={r.text} />
                </li>
              ))}
            </ul>
            <p className="reviews__attribution">Reviews from Google. Shown as provided by Google Maps, refreshed daily.</p>
          </>
        )}
      </div>
    </section>
  );
}

export function GoogleRatingBadge({ data }: { data: GoogleReviewsData }) {
  return (
    <a href={data.mapsUrl} target="_blank" rel="noopener" className="rating-badge">
      <GoogleG />
      <span className="rating-badge__score">{data.rating.toFixed(1)}</span>
      <Stars rating={data.rating} size={15} />
      <span className="rating-badge__count">{data.total.toLocaleString("en-IN")} Google reviews</span>
    </a>
  );
}
