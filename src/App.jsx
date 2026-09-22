import { useState, useEffect } from "react";
import ArtistCard from "./ArtistCard.jsx";


function App() {
  const [artistData, setArtistData] = useState([]);
  const [application, setApplication] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchArtist = async function () {
      try {
        const binUrl = "https://api.jsonbin.io/v3/b/6ab1d3f3ffd5d16053214899";

        const response = await fetch(binUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Key": "", 
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "This is Not yours");
        }

        const data = await response.json();
        setArtistData(data.record);
        setApplication("success");
      } catch (error) {
        console.error("Error fetching artist data:", error);
        setErrorMessage("This is Not yours");
        setApplication("error");
      }
    };

    fetchArtist();
  }, []);

  if (application === "loading") return <p>Fetching artists…</p>;

  if (application === "error") {
    return (
      <p style={{ color: "black", fontWeight: "bold" }}>
        {errorMessage}
      </p>
    );
  }

  return (
    <main className="artist-directory">
      <header className="artist-header">
        <h1>Artist Directory</h1>
      </header>
      <section className="artist-grid">
        {artistData.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </section>
    </main>
  );
}

export default App;