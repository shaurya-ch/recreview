import CreateReview from "@/CreateReview";
import { useState } from "react";
import SavedReviews from "@/SavedReviews";

export type Review = {
  releaseGroupId: string;
  releaseGroupTitle: string;
  releaseGroupArtist: string;
  rating: number;
  remarks: string;
};

function App() {
  const getInitialReviews = () => {
    const storedReviews = localStorage.getItem("reviews");
    if (storedReviews) {
      return JSON.parse(storedReviews);
    } else {
      return [];
    }
  };
  const [reviews, setReviews] = useState<Review[]>(getInitialReviews);

  return (
    <>
      <CreateReview reviews={reviews} setReviews={setReviews} />
      <SavedReviews reviews={reviews} setReviews={setReviews} />
    </>
  );
}

export default App;
