import { type SubmitEvent, useState } from "react";

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

  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <label htmlFor="searchbar">Search for a MusicBrainz release group: </label>
        <input
          type="text"
          id="searchbar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <div>
        {fetchedReleaseGroups.map((releaseGroup: ReleaseGroup) => {
          return (
            <div key={releaseGroup.id}>
              <span>{releaseGroup.title}</span>
              <span>{releaseGroup["artist-credit"][0].name}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
