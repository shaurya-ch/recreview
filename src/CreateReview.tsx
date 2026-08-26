import { type SubmitEvent, useState } from "react";
import { Field, FieldGroup, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";

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
  const fetchReleaseGroups = async () => {
    try {
      const res = await fetch(
        `https://musicbrainz.org/ws/2/release-group/?query=release:${searchQuery}&fmt=json&limit=100`,
      );
      const data = await res.json();
      setFetchedReleaseGroups(data["release-groups"]);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  const handleSearchSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchReleaseGroups();
  };

  const handleReviewSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setreview(rating, remarks)
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedReleaseGroups, setFetchedReleaseGroups] = useState([]);
  const [selectedReleaseGroup, setSelectedReleaseGroup] = useState<ReleaseGroup>();
  const [rating, setRating] = useState(0);
  const [remarks, setRemarks] = useState("");

  return (
    <>
      <form onSubmit={(e) => handleSearchSubmit(e)}>
        <Field>
          <FieldLabel htmlFor="searchbar">Search</FieldLabel>
          <Input
            id="searchbar"
            type="text"
            placeholder="Enter query"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FieldDescription>Search for a MusicBrainz release group</FieldDescription>
        </Field>
        <Button type="submit" variant={"outline"}>
          Search
        </Button>
      </form>
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
                  setSelectedReleaseGroup(releaseGroup);
                  setFetchedReleaseGroups([]);
                }}
              >
                Review
              </Button>
            </div>
          );
        })}
      </div>
      {selectedReleaseGroup && (
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
