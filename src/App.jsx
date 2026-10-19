import { useState, useEffect } from "react";
import ArtistCard from "./ArtistCard.jsx";
import localArtists from "./Artist.js";
import styles from "./ArtistDirectory.module.css";

function App() {
  const [artistData, setArtistData] = useState([]);
  const [application, setApplication] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [savedArtistId, setSavedArtistId] = useState(
    JSON.parse(localStorage.getItem("ArtistId")) || []
  );
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const binUrl= 'https://api.jsonbin.io/v3/b/6ad699d4ffd5d160537a41d1';
        const response = await fetch(binUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Key":'$2a$10$mlPP20HC0JSy7hPSU4lo7uBqRPlIAAXRr3rwfiss1VocEePgVAo2W'
          },
        });
        const binUrl_1= 'https://api.jsonbin.io/v3/b/6abb1afaffd5d1605339e0b8';
        const response_1 = await fetch(binUrl_1, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Key": '$2a$10$mlPP20HC0JSy7hPSU4lo7uBqRPlIAAXRr3rwfiss1VocEePgVAo2W'
          },
        });

        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        if (!response_1.ok) throw new Error(`Request failed (${response_1.status})`);

        const data = await response.json();
        const data_1 = await response_1.json();
        setArtistData([...data.record, ...data_1.record]);
      } catch (error) {
        setErrorMessage(`${error.message}. Showing saved local data instead.`);
        setArtistData(localArtists);
      } finally {
        setApplication("success");
      }
    };

    loadArtists();
  }, []);

  useEffect(() => {
    localStorage.setItem("ArtistId", JSON.stringify(savedArtistId));
  }, [savedArtistId]);

  const toggleSaved = (id) => {
    setSavedArtistId((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const search = searchTerm.toLowerCase();
  const filteredArtists = artistData.filter((artist) => {
    const id = artist.Id ?? artist.Name;
    const fields = [
      artist.Name,
      artist.Genre,
      artist.Title,
      artist.City,
      artist.State,
      artist.Country,
      artist.CurrentCity,
      artist.CurrentState,
      artist.CurrentCountry,
      artist.Impact,
      artist.BirthDate,
      artist.DeathDate,
    ];
    const matchesSearch = fields.some((field) =>
      String(field ?? "").toLowerCase().includes(search)
    );
    const matchesSaved = !showSaved || savedArtistId.includes(id);
    return matchesSearch && matchesSaved;
  });

  if (application === "loading") {
    return <p className={styles.statusMessage}>Loading artists…</p>;
  }

  return (
    <main className="artist-directory">
      <header className="artist-header">
        <h1>Artist Directory</h1>
        <div className="search-container">
          <label className={styles.searchLabel} htmlFor="artist-search">
            Search the directory
          </label>
          <input
            id="artist-search"
            className={styles.searchInput}
            type="text"
            placeholder="Name, genre, or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.directoryControls}>
          <p className={styles.resultCount} aria-live="polite">
            {filteredArtists.length}{" "}
            {filteredArtists.length === 1 ? "artist" : "artists"}
          </p>
          <button
            type="button"
            className={`${styles.savedToggle} ${showSaved ? styles.savedToggleActive : ""}`}
            onClick={() => setShowSaved((prev) => !prev)}
            aria-pressed={showSaved}
          >
            {showSaved
              ? "Show all artists"
              : `Saved artists (${savedArtistId.length})`}
          </button>
        </div>
      </header>

      {errorMessage && <p className={styles.statusMessage}>{errorMessage}</p>}

      {filteredArtists.length > 0 ? (
        <section className="artist-grid" aria-label="Artists">
          {filteredArtists.map((artist) => {
            const id = artist.Id ?? artist.Name;
            return (
              <ArtistCard
                key={id}
                artist={artist}
                saved={savedArtistId.includes(id)}
                onToggleSaved={() => toggleSaved(id)}
              />
            );
          })}
        </section>
      ) : (
        <p className={styles.emptyState}>
          {showSaved && savedArtistId.length === 0
            ? "No saved artists, click a heart to show who you like."
            : "No artists match your search. Try another name, genre, or location."}
        </p>
      )}
    </main>
  );
}

export default App;