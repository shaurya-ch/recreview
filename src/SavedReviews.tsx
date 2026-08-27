import { type Review } from "./App.tsx";

function SavedReviews({ reviews }: { reviews: Review[] }) {
  return (
    <>
      {reviews && (
        <div>
          {reviews.map((review) => {
            return (
              <div key={review.releaseGroupId}>
                <div>{review.releaseGroupTitle}</div>
                <div>{review.releaseGroupArtist}</div>
                <div>{review.rating}</div>
                <div>{review.remarks}</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default SavedReviews;
