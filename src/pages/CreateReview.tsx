import { buttonVariants } from "@/components/ui/button";
import { type SubmitEvent, useState, useEffect } from "react";
import { Field, FieldGroup, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReviewContext } from "@/reviews-context";
import { toast } from "@/components/ui/toast";
import { useNavigate } from "react-router";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

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
  const navigate = useNavigate();

  const fetchReleaseGroups = async () => {
    try {
      setLoading(true);
      setReleaseGroupsError(null);
      const res = await fetch(
        `https://musicbrainz.org/ws/2/release-group/?query=release:${encodeURIComponent(searchQuery)}&fmt=json&limit=100`,
      );
      if (!res.ok) {
        throw new Error(`Musicbrainz returned ${res.status}`);
      }
      const data = await res.json();
      if (data["release-groups"]) {
        setFetchedReleaseGroups(data["release-groups"]);
      } else {
        throw new Error("Response does not contain any release groups");
      }
    } catch (e) {
      console.error(e);
      setReleaseGroupsError(
        e instanceof Error
          ? e.message
          : "Something went wrong when fetching release groups. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setReleaseGroupsError(null);
    setFetchedReleaseGroups([]);
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
    setRating(1);
    setRemarks("");
    toast.add({
      type: "success",
      title: "Review Created",
    });
    navigate("/");
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedReleaseGroups, setFetchedReleaseGroups] = useState<ReleaseGroup[]>([]);
  const [selectedReleaseGroup, setSelectedReleaseGroup] = useState<ReleaseGroup>();
  const [rating, setRating] = useState(1);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [isDupe, setIsDupe] = useState(false);
  const [selectedReleaseGroupImgUrl, setSelectedReleaseGroupImgUrl] = useState("");
  const [releaseGroupsError, setReleaseGroupsError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    const fetchCover = async () => {
      if (selectedReleaseGroup) {
        setSelectedReleaseGroupImgUrl("");
        setCoverError(null);
        try {
          setCoverLoading(true);
          const res = await fetch(
            `https://coverartarchive.org/release-group/${selectedReleaseGroup.id}`,
          );
          if (!res.ok) {
            throw new Error("Response does not contain cover art");
          }
          const data = await res.json();
          setSelectedReleaseGroupImgUrl(data.images[0].thumbnails["250"]);
        } catch (e) {
          console.error("Error: ", e);
          setCoverError(e instanceof Error ? e.message : "Something went wrong fetching cover art");
        } finally {
          setCoverLoading(false);
        }
      }
    };
    fetchCover();
  }, [selectedReleaseGroup]);

  return (
    <div className="m-2 flex flex-col gap-2">
      <div className="relative flex flex-row items-center w-full">
        <a href="/" className={`${buttonVariants({ variant: "outline", size: "lg" })} w-20`}>
          ← Home
        </a>
        <div className="font-mono absolute left-1/2 -translate-x-1/2 text-md">recreview</div>
      </div>
      <form onSubmit={(e) => handleSearchSubmit(e)}>
        <Field className="flex flex-col">
          <div className="flex flex-row gap-2 justify-center">
            <Input
              id="searchbar"
              type="text"
              placeholder="Search for an album"
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-xl"
            />
            <Button type="submit" variant={"outline"}>
              Search
            </Button>
          </div>
          <FieldDescription className="text-center">
            Supports Lucene search syntax, for example, try searching "red AND taylor swift"
          </FieldDescription>
        </Field>
      </form>
      {loading && <div className="text-center">Please wait. Loading release groups...</div>}
      {releaseGroupsError && <div className="text-red-500">{releaseGroupsError}</div>}
      {coverError && <div className="text-red-500">{coverError}</div>}
      <div className="flex flex-col gap-2 w-full justify-center items-center content-center">
        {fetchedReleaseGroups.map((releaseGroup: ReleaseGroup) => {
          return (
            <Card key={releaseGroup.id} className="w-96">
              <CardHeader>
                <CardTitle>{releaseGroup.title}</CardTitle>
                <CardDescription>{releaseGroup["artist-credit"][0].name}</CardDescription>
                <CardAction>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setIsDupe(false);
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
                </CardAction>
              </CardHeader>
            </Card>
          );
        })}
        {selectedReleaseGroup && !isDupe && (
          <Card className="w-96">
            <CardHeader className="flex flex-row gap-2">
              {selectedReleaseGroupImgUrl && !coverError && !coverLoading ? (
                <img
                  src={selectedReleaseGroupImgUrl}
                  alt="cover art"
                  className="w-28 h-28 rounded-xl"
                />
              ) : (
                <div className="w-28 h-28 bg-gray-800 rounded-xl"></div>
              )}
              <div className="flex flex-col justify-center h-28">
                <CardTitle>{selectedReleaseGroup.title}</CardTitle>
                <CardDescription>{selectedReleaseGroup["artist-credit"][0].name}</CardDescription>
              </div>
            </CardHeader>
            <form onSubmit={handleReviewSubmit}>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="rating">Rating (1-5)</FieldLabel>
                    {/* <Input */}
                    {/*   id="rating" */}
                    {/*   placeholder="Enter Rating" */}
                    {/*   type="number" */}
                    {/*   max={5} */}
                    {/*   min={1} */}
                    {/*   step={1} */}
                    {/*   onChange={(e) => setRating(+e.target.value)} */}
                    {/*   value={rating} */}
                    {/* /> */}
                    <ToggleGroup
                      value={[String(rating)]}
                      defaultValue={["1"]}
                      onValueChange={(groupValue) => {
                        if (groupValue.length === 0) return;
                        setRating(+groupValue);
                      }}
                    >
                      <ToggleGroupItem value="1">{rating >= 1 ? <>★</> : <>☆</>}</ToggleGroupItem>
                      <ToggleGroupItem value="2">{rating >= 2 ? <>★</> : <>☆</>}</ToggleGroupItem>
                      <ToggleGroupItem value="3">{rating >= 3 ? <>★</> : <>☆</>}</ToggleGroupItem>
                      <ToggleGroupItem value="4">{rating >= 4 ? <>★</> : <>☆</>}</ToggleGroupItem>
                      <ToggleGroupItem value="5">{rating >= 5 ? <>★</> : <>☆</>}</ToggleGroupItem>
                    </ToggleGroup>
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
                  <Field orientation="horizontal"></Field>
                </FieldGroup>
              </CardContent>
              <CardFooter>
                <Button type="submit">Submit</Button>
              </CardFooter>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}

export default CreateReview;
