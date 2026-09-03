import { buttonVariants } from "@/components/ui/button.tsx";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Field, FieldGroup, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useReviewContext } from "@/reviews-context";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function SavedReviews() {
  const [reviews, setReviews] = useReviewContext();

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((review) => review.releaseGroupId !== id));
  };

  const handleUpdateReview = (id: string) => {
    setReviews(
      reviews.map((review) => {
        if (review.releaseGroupId === id) {
          return {
            ...review,
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
  const [coverUrls, setCoverUrls] = useState<Record<string, string>>({});
  const reviewIds = [reviews.map((review) => review.releaseGroupId).join(",")];

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    reviews.forEach(async (review) => {
      if (coverUrls[review.releaseGroupId]) return;
      try {
        const res = await fetch(
          `https://coverartarchive.org/release-group/${review.releaseGroupId}`,
        );
        if (!res.ok) {
          throw new Error("Unable to fetch cover art");
        }
        const data = await res.json();
        const url = data.images?.[0]?.thumbnails?.["250"];
        setCoverUrls((prev) => ({ ...prev, [review.releaseGroupId]: url }));
      } catch (e) {
        console.error("oopsie", e);
      }
    });
  }, [reviewIds]);

  return (
    <>
      <a href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
        Go Home
      </a>
      {reviews && (
        <div className="flex flex-col gap-2">
          {reviews.map((review) => {
            fetchCover(review.releaseGroupId);
            return (
              <Card key={review.releaseGroupId}>
                <CardHeader>
                  <CardTitle>{review.releaseGroupTitle}</CardTitle>
                  <CardDescription>{review.releaseGroupArtist}</CardDescription>
                  <CardAction>
                    <div className="flex flex-col">
                      <div className="flex flex-row">
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
                      {coverUrl && <img src={coverUrl} alt="Cover Art" />}
                    </div>
                  </CardAction>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

export default SavedReviews;
