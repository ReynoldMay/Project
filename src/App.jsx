import { useState, useEffect } from "react";
import ArtistCard from "./ArtistCard.jsx";
function App() {
  const [artistData, setArtistData] = useState([]);
  const [application, setApplication] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchArtist = async function () {
      try {
        const binUrl = "https://api.jsonbin.io/v3/b/6abb1aebac6210605a004239";
        const binUrl_2 = "https://api.jsonbin.io/v3/b/6abb1afaffd5d1605339e0b8";

        const response = await fetch(binUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Key": "",
          },
        });
        const response_1 = await fetch(binUrl_2, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Key": "",
          },
        });

        if (!response.ok || !response_1.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.message || "This is Not yours");
        }

        const data = await response.json();
        const data_1 = await response_1.json();

        setArtistData([...data.record, ...data_1.record]);
        setApplication("success");
      } catch (error) {
        console.error("Error fetching artist data:", error);
        setErrorMessage("This is Not yours");
        setApplication("error");
      }
    };

    fetchArtist();
  }, []);

  const filteredArtists = artistData.filter((artist) => {
    const search = searchTerm.toLowerCase();
    return (
      (artist.Name ?? artist.Name)?.toLowerCase().includes(search) ||
      (artist.Genre ?? artist.Genre)?.toLowerCase().includes(search) ||
      artist.Title?.toLowerCase().includes(search) ||
      artist.City?.toLowerCase().includes(search) ||
      artist.State?.toLowerCase().includes(search) ||
      artist.Country?.toLowerCase().includes(search)||
      artist.CurrentCity?.toLowerCase().includes(search) ||
      artist.CurrentState?.toLowerCase().includes(search) ||
      artist.CurrentCountry?.toLowerCase().includes(search)||
      artist.Impact?.toLowerCase().includes(search) ||
      (artist.BirthDate ?? artist.BirthDate)?.toLowerCase().includes(search) ||
      (artist.DeathDate ?? artist.DeathDate)?.toLowerCase().includes(search)
      
    );
  });
  

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
        <div className="search-container">
          <input
            type="text"
            placeholder="Search artists, genres, or locations,Title,Name BirthDate, Impact, Current City, Current State, Current Country,State,City..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>
      <section className="artist-grid">
  {filteredArtists.map((artist, index) => (
    <ArtistCard 
      key={artist.id ?? artist.Id ?? `artist-${index}`} 
      artist={artist} 
    />
  ))}
</section>
    </main>
  );
}

export default App;