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
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const reviewIds = reviews.map((review) => review.releaseGroupId).join(",");

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    const ids = reviewIds.split(",").filter(Boolean);

    ids.forEach(async (id: string) => {
      try {
        const res = await fetch(`https://coverartarchive.org/release-group/${id}`);
        if (!res.ok) {
          throw new Error("Unable to fetch cover art");
        }
        const data = await res.json();
        const url = data.images?.[0]?.thumbnails?.["small"];
        setCoverUrls((prev) => (prev[id] ? prev : { ...prev, [id]: url }));
      } catch (e) {
        console.error("oopsie", e);
      }
    });
  }, [reviewIds]);

  return (
    <div className="m-2">
      <a href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
        Go Home
      </a>
      {reviews && (
        <div className="flex flex-col gap-2">
          {reviews.map((review) => {
            return (
              <div key={review.releaseGroupId} className="flex flex-row items-center gap-2">
                <img
                  src={coverUrls[review.releaseGroupId]}
                  alt="Album cover"
                  className="w-56 h-56 rounded-xl"
                />
                <Card className="w-full">
                  <CardHeader>
                    <CardAction>
                      <Badge variant="secondary">{review.releaseGroupArtist}</Badge>
                    </CardAction>
                    <CardTitle>{review.releaseGroupTitle}</CardTitle>
                    <CardDescription>
                      {editingId === review.releaseGroupId ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleUpdateReview(review.releaseGroupId);
                            setEditingId("");
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
                              <FieldDescription>
                                What did you think of the release?
                              </FieldDescription>
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
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
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
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SavedReviews;
