import { useState, type Dispatch, type SetStateAction } from "react";
import { Outlet } from "react-router";

export type Review = {
  releaseGroupId: string;
  releaseGroupTitle: string;
  releaseGroupArtist: string;
  rating: number;
  remarks: string;
};

export type ReviewContextType = [reviews: Review[], setReviews: Dispatch<SetStateAction<Review[]>>];

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
      <Outlet context={[reviews, setReviews] satisfies ReviewContextType} />
    </>
  );
}

export default App;
