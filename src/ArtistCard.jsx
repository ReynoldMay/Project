import ArtistImage from "./ArtistImage.jsx";
import { FaHeart } from "react-icons/fa";
import { SlHeart } from "react-icons/sl";

function ArtistCard({ artist, saved, onToggleSaved }) {
  const {
    Name: name,
    Genre: genre,
    BirthDate: birthDate,
    DeathDate: deathDate,
    ImageUrl: imageUrl,
    GifUrl: gifUrl,
    IsIncarcerated: isIncarcerated,
    StatusText: statusText,
  } = artist;
  let statusTemplate, timelineLabel, timelineText;


  if (deathDate) {
    statusTemplate = "Legacy";
    timelineLabel = "Died";
    timelineText = deathDate;
  } else if (isIncarcerated) {
    statusTemplate = "Incarcerated";
    timelineLabel = "Status";
    timelineText = statusText ?? "Incarcerated";
  } else {
    statusTemplate = "Active";
    timelineLabel = statusText ? "Status" : "Today";
    timelineText = statusText ?? "Still making music";
  }

  const locationParts = [artist.City, artist.State, artist.Country].filter(Boolean).join(", ");
 const currentLocationParts = [
  artist.CurrentCity,
  artist.CurrentState,
  artist.CurrentCountry,
]
  .filter(Boolean)
  .join(", ");
  
    
  return (
    <article className="artist-card">
      <div className={`artist-media ${gifUrl ? "has-gif" : ""}`}>
        {imageUrl && (
          <ArtistImage
            src={imageUrl}
            alt={`${name ?? "Artist"} portrait`}
          />
        )}

        {gifUrl && (
          <ArtistImage
            src={gifUrl}
            alt={`${name ?? "Artist"} tribute GIF`}
            className="artist-gif"
          />
        )}

        <span className={deathDate ? "status status-past" : "status"}>
          {statusTemplate}
        </span>

        <button
          type="button"
          className="heart-btn"
          onClick={onToggleSaved}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${name} from saved` : `Save ${name}`}
        >
          {saved ? <FaHeart color="red" size={20} /> : <SlHeart size={20} />}
        </button>
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

        {artist.Gotfamouswhen && (
          <div className="impact">
            <h3>Got Famous When</h3>
            <p>{artist.Gotfamouswhen}</p>
          </div>
        )}

        {artist.Gotfamoushere && (
          <div className="impact">
            <h3>Got Famous Here</h3>
            <p>{artist.Gotfamoushere}</p>
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