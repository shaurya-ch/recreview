import { buttonVariants } from "@/components/ui/button.tsx";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Field, FieldGroup, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea.tsx";
import { useReviewContext } from "@/reviews-context";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function SavedReviews() {
  const starRatings = ["★☆☆☆☆", "★★☆☆☆", "★★★☆☆", "★★★★☆", "★★★★★"];

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
  const [coversLoading, setCoversLoading] = useState(false);
  const reviewIds = reviews.map((review) => review.releaseGroupId).join(",");

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    const ids = reviewIds.split(",").filter(Boolean);

    ids.forEach(async (id: string) => {
      try {
        setCoversLoading(true);
        const res = await fetch(`https://coverartarchive.org/release-group/${id}`);
        if (!res.ok) {
          throw new Error("Unable to fetch cover art");
        }
        const data = await res.json();
        const url = data.images?.[0]?.thumbnails?.["small"];
        setCoverUrls((prev) => (prev[id] ? prev : { ...prev, [id]: url }));
      } catch (e) {
        console.error("oopsie", e);
      } finally {
        setCoversLoading(false);
      }
    });
  }, [reviewIds]);

  return (
    <div className="m-2 flex flex-col gap-2">
      <div className="relative flex flex-row items-center w-full">
        <a href="/" className={`${buttonVariants({ variant: "outline", size: "lg" })} w-20`}>
          ← Home
        </a>
        <div className="font-mono absolute left-1/2 -translate-x-1/2 text-md">recreview</div>
      </div>
      {reviews && (
        <div className="flex flex-col gap-2">
          {reviews.map((review) => {
            return (
              <div key={review.releaseGroupId} className="flex flex-row items-center gap-2">
                {coversLoading ? (
                  <div className="min-w-56 min-h-56 rounded-xl bg-[#1c1c1c]"></div>
                ) : (
                  <img
                    src={coverUrls[review.releaseGroupId]}
                    alt="Album cover"
                    className="w-56 h-56 rounded-xl"
                  />
                )}
                <Card className="w-full min-h-56 flex flex-col">
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
                              <ToggleGroup
                                value={[String(newRating)]}
                                defaultValue={["1"]}
                                onValueChange={(groupValue) => {
                                  if (groupValue.length === 0) return;
                                  setNewRating(+groupValue);
                                }}
                                id="rating"
                              >
                                <ToggleGroupItem value="1">
                                  {newRating >= 1 ? <>★</> : <>☆</>}
                                </ToggleGroupItem>
                                <ToggleGroupItem value="2">
                                  {newRating >= 2 ? <>★</> : <>☆</>}
                                </ToggleGroupItem>
                                <ToggleGroupItem value="3">
                                  {newRating >= 3 ? <>★</> : <>☆</>}
                                </ToggleGroupItem>
                                <ToggleGroupItem value="4">
                                  {newRating >= 4 ? <>★</> : <>☆</>}
                                </ToggleGroupItem>
                                <ToggleGroupItem value="5">
                                  {newRating >= 5 ? <>★</> : <>☆</>}
                                </ToggleGroupItem>
                              </ToggleGroup>
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
                          <div>{starRatings[review.rating - 1]}</div>
                          <div>{review.remarks}</div>
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1"></CardContent>
                  <CardFooter className="flex flex-row gap-2">
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
