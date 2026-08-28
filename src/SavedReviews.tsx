import { type Dispatch, type SetStateAction, useState } from "react";
import { type Review } from "@/App.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Field, FieldGroup, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";

function SavedReviews({
  reviews,
  setReviews,
}: {
  reviews: Review[];
  setReviews: Dispatch<SetStateAction<Review[]>>;
}) {
  const handleDelete = (id: string) => {
    setReviews(reviews.filter((review) => review.releaseGroupId !== id));
  };

  const handleUpdateReview = (id: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.releaseGroupId === id) {
          return {
            releaseGroupId: review.releaseGroupId,
            releaseGroupTitle: review.releaseGroupTitle,
            releaseGroupArtist: review.releaseGroupArtist,
            rating: newRating,
            remarks: newRemarks,
          };
        } else {
          return review;
        }
      }),
    );
  };

  const [editingId, setEditingId] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [newRemarks, setNewRemarks] = useState("");

  return (
    <>
      {reviews && (
        <div>
          {reviews.map((review) => {
            return (
              <div key={review.releaseGroupId}>
                <div>{review.releaseGroupTitle}</div>
                <div>{review.releaseGroupArtist}</div>
                {editingId === review.releaseGroupId ? (
                  <form
                    onSubmit={() => {
                      handleUpdateReview(review.releaseGroupId);
                    }}
                  >
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="rating">Rating (1-5)</FieldLabel>
                        <Input
                          id="rating"
                          placeholder="Enter Rating"
                          type="number"
                          max={5}
                          min={1}
                          step={1}
                          onChange={(e) => setNewRating(+e.target.value)}
                          value={newRating}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                        <Textarea
                          id="remarks"
                          placeholder="Enter Remarks"
                          onChange={(e) => setNewRemarks(e.target.value)}
                          value={newRemarks}
                        />
                        <FieldDescription>What did you think of the release?</FieldDescription>
                      </Field>
                      <Field orientation="horizontal">
                        <Button type="submit">Submit</Button>
                        <Button
                          type="button"
                          onClick={() => {
                            setEditingId("");
                          }}
                        >
                          Cancel
                        </Button>
                      </Field>
                    </FieldGroup>
                  </form>
                ) : (
                  <div>
                    <div>{review.rating}</div>
                    <div>{review.remarks}</div>
                  </div>
                )}
                <Button
                  variant={"outline"}
                  onClick={() => {
                    handleDelete(review.releaseGroupId);
                  }}
                >
                  Delete Review
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() => {
                    setEditingId(review.releaseGroupId);
                    setNewRating(review.rating);
                    setNewRemarks(review.remarks);
                  }}
                >
                  Edit Review
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default SavedReviews;
