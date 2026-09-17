function ArtistCard({ artist }) {
  let status, timelineLabel, timelineText;

  if (artist.deathDate) {
    status = "Legacy";
    timelineLabel = "Died";
    timelineText = artist.deathDate;
  } else if (artist.isIncarcerated) {
    status= "Incarcerated";
    timelineLabel = "Status";
    timelineText = artist.statusText ?? "Incarcerated";
  } else {
    status= "Active";
    timelineLabel = artist.statusText ? "Status" : "Today";
    timelineText = artist.statusText ?? "Still making music";
  }

  return (
    <article className="artist-card">
      <div className={`artist-media ${artist.gifUrl ? "has-gif" : ""}`}>
        <img src={artist.imageUrl} alt={`${artist.name} portrait`} />
        {artist.gifUrl && <img className="artist-gif" src={artist.gifUrl} alt={`${artist.name} tribute GIF`} />}
        <span className={artist.deathDate ? "status status-past" : "status"}>
          {status}
        </span>
      </div>
      <div className="artist-content">
        <p className="genre">{artist.genre}</p>
        <h2>{artist.name}</h2>
        <p className="origin">{artist.city}, {artist.state}, {artist.country}</p>
        <dl className="timeline">
          <div><dt>Born</dt><dd>{artist.birthDate}</dd></div>
          <div><dt>{timelineLabel}</dt><dd>{timelineText}</dd></div>
        </dl>
        <div className="impact">
          <h3>Impact</h3>
          <p>{artist.impact}</p>
        </div>
      </div>
      {artist.currentCity && (
        <div className="current-location">
          <h3>Current Location</h3>
          <p>{artist.currentCity}, {artist.currentState}, {artist.currentCountry}</p>
        </div>
      )}
      {artist.becameFamousIn && (
        <div className="became-famous-in">
          <h3>Became Famous In</h3>
          <p>{artist.becameFamousIn}</p>
        </div>
      )}
      {artist.diedin && (
        <div className="died-in">
          <h3>Died In</h3>
          <p>{artist.diedin}</p>
        </div>
      )}
      {artist.deathReason && (
        <p className="death-reason">Cause: {artist.deathReason}</p>
      )}
      {artist.livedIn && (
        <div className="lived-in">
          <h3>Lived In</h3>
          <p>{artist.livedIn}</p>
        </div>
      )}
    </article>
  );
}

export default ArtistCard;