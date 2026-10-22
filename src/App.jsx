import { useState, useEffect } from "react";
import ArtistCard from "./ArtistCard.jsx";
import AddArtist from "./AddArtist.jsx";
import localArtists from "./Artist.js";
import styles from "./ArtistDirectory.module.css";

function App() {
  const [artistData, setArtistData] = useState([]);
  const [application, setApplication] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [actionErrorMessage, setActionErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllArtists, setShowAllArtists] = useState(false);
  const [showSavedArtists, setShowSavedArtists] = useState(false);
  const [backendLoaded, setBackendLoaded] = useState(false);
  const [removingArtistId, setRemovingArtistId] = useState(null);
  const [savedArtistId, setSavedArtistId] = useState(
    JSON.parse(localStorage.getItem("ArtistId")) || []
  );

  useEffect(() => {
    const loadArtists = async () => {
      try {
        const binUrl= 'https://api.jsonbin.io/v3/b/6ad699d4ffd5d160537a41d1';
        const response = await fetch(binUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Key": ''
          },
        });
        const binUrl_1= 'https://api.jsonbin.io/v3/b/6abb1afaffd5d1605339e0b8';
        const response_1 = await fetch(binUrl_1, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Access-Key": ''
          },
        });

        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        if (!response_1.ok) throw new Error(`Request failed (${response_1.status})`);

        const data = await response.json();
        const data_1 = await response_1.json();
        setArtistData([...data.record, ...data_1.record]);
        setBackendLoaded(true);
      } catch (error) {
        setErrorMessage(`${error.message}. Showing saved local data instead.`);
        setArtistData(localArtists);
        setBackendLoaded(false);
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

  const addArtist = async (artistDetails) => {
    const { Name } = artistDetails;
    const binUrl = "https://api.jsonbin.io/v3/b/6ad699d4ffd5d160537a41d1";
    const headers = {
      "Content-Type": "application/json",
      "X-Access-Key": "",
    };
    const readResponse = await fetch(binUrl, { method: "GET", headers });

    if (!readResponse.ok) {
      throw new Error(`Could not load artists for saving (${readResponse.status})`);
    }

    const responseData = await readResponse.json();
    if (!Array.isArray(responseData.record)) {
      throw new Error("The artist backend returned an invalid artist list.");
    }

    const isDuplicate = [...artistData, ...responseData.record].some(
      (artist) => artist.Name?.trim().toLowerCase() === Name.toLowerCase()
    );
    if (isDuplicate) {
      throw new Error("An artist with that name already exists in the directory.");
    }

    const slug = Name.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const existingIds = new Set(
      [...artistData, ...responseData.record].map((artist) => artist.Id)
    );
    let id = slug || `artist-${Date.now()}`;
    let suffix = 2;
    while (existingIds.has(id)) {
      id = `${slug}-${suffix}`;
      suffix += 1;
    }

    const newArtist = { ...artistDetails, Id: id };
    const writeResponse = await fetch(binUrl, {
      method: "PUT",
      headers,
      body: JSON.stringify([...responseData.record, newArtist]),
    });

    if (!writeResponse.ok) {
      throw new Error(`Could not save the artist (${writeResponse.status})`);
    }

    setArtistData((currentArtists) => [...currentArtists, newArtist]);
  };

  const removeArtist = async (artistToRemove) => {
    const artistId = artistToRemove.Id ?? artistToRemove.Name;
    setActionErrorMessage("");
    setRemovingArtistId(artistId);

    try {
      const binUrls = [
        "https://api.jsonbin.io/v3/b/6ad699d4ffd5d160537a41d1",
        "https://api.jsonbin.io/v3/b/6abb1afaffd5d1605339e0b8",
      ];
      const headers = {
        "Content-Type": "application/json",
        "X-Access-Key": "$2a$10$mlPP20HC0JSy7hPSU4lo7uBqRPlIAAXRr3rwfiss1VocEePgVAo2W",
      };
      const readResponses = await Promise.all(
        binUrls.map((url) => fetch(url, { method: "GET", headers }))
      );
      const recordsByBin = await Promise.all(
        readResponses.map(async (response) => {
          if (!response.ok) {
            throw new Error(`Could not load artists for removal (${response.status})`);
          }
          const data = await response.json();
          if (!Array.isArray(data.record)) {
            throw new Error("The artist backend returned an invalid artist list.");
          }
          return data.record;
        })
      );

      const matchesArtist = (candidate) =>
        artistToRemove.Id != null
          ? candidate.Id === artistToRemove.Id
          : candidate.Name?.trim().toLowerCase() ===
            artistToRemove.Name?.trim().toLowerCase();
      const updatedRecords = recordsByBin.map((records) =>
        records.filter((candidate) => !matchesArtist(candidate))
      );

      if (
        updatedRecords.every(
          (records, index) => records.length === recordsByBin[index].length
        )
      ) {
        throw new Error("That artist was not found in the backend records.");
      }

      const writeResponses = await Promise.all(
        updatedRecords.map((records, index) =>
          records.length === recordsByBin[index].length
            ? Promise.resolve(null)
            : fetch(binUrls[index], {
                method: "PUT",
                headers,
                body: JSON.stringify(records),
              })
        )
      );
      const failedWrite = writeResponses.find(
        (response) => response && !response.ok
      );
      if (failedWrite) {
        throw new Error(`Could not remove the artist (${failedWrite.status})`);
      }

      setArtistData((currentArtists) =>
        currentArtists.filter((candidate) => !matchesArtist(candidate))
      );
      setSavedArtistId((currentIds) =>
        currentIds.filter((id) => id !== artistId)
      );
    } catch (error) {
      setActionErrorMessage(error.message || "Could not remove the artist.");
    } finally {
      setRemovingArtistId(null);
    }
  };

  const genreOptions = [
    ...new Set(artistData.flatMap((artist) => artist.Genre?.split(",") ?? [])),
  ]
    .map((genre) => genre.trim())
    .filter(Boolean);

  const search = searchTerm.trim().toLowerCase();
  const shouldShowArtists =
    search.length > 0 || showAllArtists || showSavedArtists;
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
      artist.Aftermath,
      artist.Legacy,
      artist.BirthDate,
      artist.DeathDate,
    ];
    const matchesSearch =
      !search ||
      fields.some((field) =>
        String(field ?? "").toLowerCase().includes(search)
      );
    const matchesSaved = !showSavedArtists || savedArtistId.includes(id);
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
        <AddArtist onAddArtist={addArtist} genreOptions={genreOptions} />
        <button
          type="button"
          className={styles.showAllButton}
          aria-pressed={showAllArtists}
          onClick={() => setShowAllArtists((shown) => !shown)}
        >
          {showAllArtists ? "Hide all artists" : "Show all artists"}
        </button>
        <button
          type="button"
          className={styles.showAllButton}
          aria-pressed={showSavedArtists}
          onClick={() => setShowSavedArtists((shown) => !shown)}
        >
          {showSavedArtists
            ? "Show all artists"
            : `Saved artists (${savedArtistId.length})`}
        </button>
      </header>

      {errorMessage && <p className={styles.statusMessage}>{errorMessage}</p>}
      {actionErrorMessage && (
        <p className={styles.statusMessage} role="alert">
          {actionErrorMessage}
        </p>
      )}

      {shouldShowArtists && filteredArtists.length > 0 ? (
        <section className="artist-grid" aria-label="Artists">
          {filteredArtists.map((artist) => {
            const id = artist.Id ?? artist.Name;
            return (
              <ArtistCard
                key={id}
                artist={artist}
                saved={savedArtistId.includes(id)}
                onToggleSaved={() => toggleSaved(id)}
                onRemove={backendLoaded ? () => removeArtist(artist) : undefined}
                removing={removingArtistId === id}
              />
            );
          })}
        </section>
      ) : shouldShowArtists ? (
        <p className={styles.emptyState}>
          {showSavedArtists && savedArtistId.length === 0
            ? "You have no saved artists yet. Save artists with the heart button."
            : "No artists match your search. Try another name, genre, or location."}
        </p>
      ) : null}
    </main>
  );
}

export default App;