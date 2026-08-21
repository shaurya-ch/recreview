function App() {
  // SEARCH SUBMIT HANDLER
  // const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  // };

  const fetchPorter = async () => {
    try {
      const res = await fetch(
        "https://musicbrainz.org/ws/2/artist/4ae36ade-1798-48c4-b06b-cc68b7d3d83f?inc=genres&fmt=json",
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {/* SEARCH BAR */}
      {/* <form onSubmit={(e) => handleSubmit(e)}> */}
      {/*   <label htmlFor="searchbar">Search for a release: </label> */}
      {/*   <input type="text" id="searchbar" /> */}
      {/*   <button type="submit">Search</button> */}
      {/* </form> */}
      <div>{}</div>
    </>
  );
}

export default App;
