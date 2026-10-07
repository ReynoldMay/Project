function ArtistCard({ artist }) {
  let statusTemplate, timelineLabel, timelineText;

  const deathDate = artist.DeathDate ??artist.deathDate;
  const birthDate = artist.BirthDate ?? artist.birthDate;
  const imageUrl = artist.ImageUrl ?? artist.imageUrl ?? artist.image ?? artist.Image ?? artist.photo ?? artist.Photo ?? artist.img ?? artist.Img;
  const gifUrl = artist.GifUrl ?? artist.gifUrl;
  const name = artist.Name ?? artist.name;
  const genre = artist.Genre ?? artist.genre;

  if (deathDate) {
    statusTemplate = "Legacy"
    timelineLabel = "Died";
    timelineText = deathDate;
  } else if (artist.IsIncarcerated ?? artist.isIncarcerated) {
    statusTemplate = "Incarcerated";
    timelineLabel = "Status";
    timelineText = artist.statusText ?? "Incarcerated";
  } else {
    statusTemplate = "Active";
    timelineLabel = artist.statusText ? "Status" : "Today";
    timelineText = artist.statusText ?? "Still making music";
  }

  const locationParts = [artist.City, artist.State, artist.Country].filter(Boolean).join(", ");
  const currentLocationParts = [artist.CurrentCity, artist.CurrentState, artist.CurrentCountry].filter(Boolean).join(", ");

  return (
    <article className="artist-card">
      <div className={`artist-media ${gifUrl ? "has-gif" : ""}`}>
        {imageUrl && <img src={imageUrl} alt={`${name ?? "Artist"} portrait`} />}
        {gifUrl && <img className="artist-gif" src={gifUrl} alt={`${name ?? "Artist"} tribute GIF`} />}
        <span className={deathDate ? "status status-past" : "status"}>
          {statusTemplate}
        </span>
      </div>

      <div className="artist-content">
        {genre && <p className="genre">{genre}</p>}
        <h2>{name}</h2>
        {artist.Title && <p className="origin"><em>"{artist.Title}"</em></p>}
        {locationParts && <p className="origin">{locationParts}</p>}

        <dl className="timeline">
          <div><dt>Born</dt><dd>{birthDate || "N/A"}</dd></div>
          <div><dt>{timelineLabel}</dt><dd>{timelineText}</dd></div>
        </dl>

        {artist.Impact && (
          <div className="impact">
            <h3>Impact</h3>
            <p>{artist.Impact}</p>
          </div>
        )}

        {artist.LivedIn && (
          <div className="impact">
            <h3>Lived In</h3>
            <p>{artist.LivedIn}</p>
          </div>
        )}

        {currentLocationParts && (
          <div className="impact">
            <h3>Current Location</h3>
            <p>{currentLocationParts}</p>
          </div>
        )}

        {artist.BecameFamousIn && (
          <div className="impact">
            <h3>Became Famous In</h3>
            <p>{artist.BecameFamousIn}</p>
          </div>
        )}

        {artist.BecameFamousPlace && (
          <div className="impact">
            <h3>Became Famous Place</h3>
            <p>{artist.BecameFamousPlace}</p>
          </div>
        )}

        {artist.Diedin && (
          <div className="impact">
            <h3>Died In</h3>
            <p>{artist.Diedin}</p>
          </div>
        )}

        {artist.DeathReason && (
          <div className="impact">
            <h3>Cause</h3>
            <p>{artist.DeathReason}</p>
          </div>
        )}

        {artist.Aftermath && (
          <div className="impact">
            <h3>Aftermath</h3>
            <p>{artist.Aftermath}</p>
          </div>
        )}

        {artist.Legacy && (
          <div className="impact">
            <h3>Legacy</h3>
            <p>{artist.Legacy}</p>
          </div>
        )}
      </div>
    </article>
  );
}

export default ArtistCard;