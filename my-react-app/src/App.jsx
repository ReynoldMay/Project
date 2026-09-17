import ArtistCard from "./Artistcard.jsx";
import artists from "./Artist.jsx";


function App() {
  return (
    <main className="artist-directory">
      <header className="artist-header">
        <h1>Artist Directory</h1>
          
      </header>
      <section className="artist-grid">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </section>
    </main>
  );

}

export default App;