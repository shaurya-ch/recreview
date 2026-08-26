import { type SubmitEvent, useState } from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "./components/ui/button";

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

function App() {
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

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchReleaseGroups();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedReleaseGroups, setFetchedReleaseGroups] = useState([]);
  const [selectedReleaseGroup, setSelectedReleaseGroup] = useState("");

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
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
                  setSelectedReleaseGroup(releaseGroup.id);
                  setFetchedReleaseGroups([]);
                }}
              >
                Review
              </Button>
            </div>
          );
        })}
      </div>
      {selectedReleaseGroup && <div>Selected Release Group ID: {selectedReleaseGroup}</div>}
    </>
  );
}

export default App;
