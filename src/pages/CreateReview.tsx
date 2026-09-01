import { buttonVariants } from "@/components/ui/button";
import { type SubmitEvent, useState, useEffect } from "react";
import { Field, FieldGroup, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviewContext } from "@/reviews-context";

type ReleaseGroup = {
  id: string;
  title: string;
  "artist-credit": {
    name: string;
    artist: {
      id: string;
      name: string;
    };
  }[];
};

function CreateReview() {
  const [reviews, setReviews] = useReviewContext();

  const fetchReleaseGroups = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://musicbrainz.org/ws/2/release-group/?query=release:${searchQuery}&fmt=json&limit=100`,
      );
      const data = await res.json();
      setFetchedReleaseGroups(data["release-groups"]);
    } catch (e) {
      console.error("Error: ", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchReleaseGroups();
  };

  const handleReviewSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedReleaseGroup) {
      console.error("Can't submit review, no release group selected!");
      return;
    }
    setReviews((prev) => [
      ...prev,
      {
        releaseGroupId: selectedReleaseGroup.id,
        releaseGroupTitle: selectedReleaseGroup.title,
        releaseGroupArtist: selectedReleaseGroup["artist-credit"][0].name,
        rating: rating,
        remarks: remarks,
      },
    ]);
    setSelectedReleaseGroup(undefined);
    setRating(0);
    setRemarks("");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedReleaseGroups, setFetchedReleaseGroups] = useState([]);
  const [selectedReleaseGroup, setSelectedReleaseGroup] = useState<ReleaseGroup>();
  const [rating, setRating] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDupe, setIsDupe] = useState(false);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  return (
    <>
      <a href="/" className={buttonVariants({ variant: "outline", size: "sm" })}>
        Go Home
      </a>
      <form onSubmit={(e) => handleSearchSubmit(e)}>
        <Field>
          <FieldLabel htmlFor="searchbar">Search</FieldLabel>
          <Input
            id="searchbar"
            type="text"
            placeholder="Enter query"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FieldDescription>
            Supports Lucene search syntax, for example, try searching "red AND taylor swift"
          </FieldDescription>
        </Field>
        <Button type="submit" variant={"outline"}>
          Search
        </Button>
      </form>
      {loading && <div>Please wait. Loading release groups...</div>}
      <div>
        {fetchedReleaseGroups.map((releaseGroup: ReleaseGroup) => {
          return (
            <div key={releaseGroup.id} className="flex flex-row gap-2 items-center">
              <span>{releaseGroup.title}</span>
              <span>-</span>
              <span>{releaseGroup["artist-credit"][0].name}</span>
              <Button
                variant={"outline"}
                onClick={() => {
                  if (reviews.some((review) => review.releaseGroupId === releaseGroup.id)) {
                    setIsDupe(true);
                    alert("You've already reviewed that one!");
                  } else {
                    setSelectedReleaseGroup(releaseGroup);
                    setFetchedReleaseGroups([]);
                  }
                }}
              >
                Review
              </Button>
            </div>
          );
        })}
      </div>
      {selectedReleaseGroup && !isDupe && (
        <div>
          <div>Selected Release Group ID: {selectedReleaseGroup.id}</div>
          <div>
            Create Review for {selectedReleaseGroup.title} by{" "}
            {selectedReleaseGroup["artist-credit"][0].name}
          </div>
          <form onSubmit={handleReviewSubmit}>
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
                  onChange={(e) => setRating(+e.target.value)}
                  value={rating}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="remarks">Remarks</FieldLabel>
                <Textarea
                  id="remarks"
                  placeholder="Enter Remarks"
                  onChange={(e) => setRemarks(e.target.value)}
                  value={remarks}
                />
                <FieldDescription>What did you think of the release?</FieldDescription>
              </Field>
              <Field orientation="horizontal">
                <Button type="submit">Submit</Button>
              </Field>
            </FieldGroup>
          </form>
        </div>
      )}
    </>
  );
}

export default CreateReview;
