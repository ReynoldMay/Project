import { useState } from "react";
import styles from "./AddArtist.module.css";

const fields = [
  { name: "Name", label: "Artist name", maxLength: 120, required: true, placeholder: "Enter artist name" },
  { name: "Genre", label: "Genre", maxLength: 200, required: true, list: "artist-genres", placeholder: "e.g. Rock, heartland rock, folk rock" },
  { name: "Title", label: "Nickname or title", maxLength: 120, placeholder: "e.g. The King of Pop" },
  { name: "BirthDate", label: "Date of birth", maxLength: 120, placeholder: "e.g. April 1, 1980" },
  { name: "City", label: "Birth city", maxLength: 120 },
  { name: "State", label: "Birth state or region", maxLength: 120 },
  { name: "Country", label: "Birth country", maxLength: 120 },
  { name: "LivedIn", label: "Also lived in", maxLength: 200 },
  { name: "CurrentCity", label: "Current city", maxLength: 120 },
  { name: "CurrentState", label: "Current state or region", maxLength: 120 },
  { name: "CurrentCountry", label: "Current country", maxLength: 120 },
  { name: "Gotfamouswhen", label: "Got famous when", maxLength: 120 },
  { name: "Gotfamoushere", label: "Got famous here", maxLength: 200 },
  { name: "ImageUrl", label: "Portrait image URL", maxLength: 2000, type: "url", required: true, placeholder: "https://..." },
  { name: "DeathDate", label: "Date of death", maxLength: 120, placeholder: "Leave blank if living" },
  { name: "GifUrl", label: "Tribute GIF URL", maxLength: 2000, type: "url", placeholder: "https://...", deceasedOnly: true },
  { name: "Diedin", label: "Died in", maxLength: 300, deceasedOnly: true },
  { name: "DeathReason", label: "Cause of death", maxLength: 500, deceasedOnly: true },
];

const textareas = [
  { name: "Impact", label: "Impact", rows: 4, placeholder: "Describe the artist's influence and contributions" },
  { name: "Aftermath", label: "Aftermath", rows: 3, deceasedOnly: true },
  { name: "Legacy", label: "Legacy", rows: 3, deceasedOnly: true },
];

const emptyArtist = Object.fromEntries(
  [...fields, ...textareas].map(({ name }) => [name, ""])
);

function Field({ name, label, value, onChange, multiline, rows, type = "text", ...rest }) {
  const Control = multiline ? "textarea" : "input";
  return (
    <label className={styles.field}>
      {label}
      <Control
        name={name}
        value={value}
        onChange={onChange}
        {...(multiline ? { rows } : { type })}
        {...rest}
      />
    </label>
  );
}

function AddArtist({ onAddArtist, genreOptions }) {
  const [isOpen, setIsOpen] = useState(false);
  const [artist, setArtist] = useState(emptyArtist);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isDeceased = Boolean(artist.DeathDate.trim());

  const updateArtist = (event) => {
    const { name, value } = event.target;
    setArtist((currentArtist) => ({ ...currentArtist, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const newArtist = Object.fromEntries(
        Object.entries(artist)
          .map(([field, value]) => [field, value.trim()])
          .filter(([, value]) => value)
      );
      if (!isDeceased) {
        delete newArtist.GifUrl;
      }
      await onAddArtist(newArtist);
      setArtist(emptyArtist);
      setIsOpen(false);
    } catch (error) {
      setErrorMessage(error.message || "The artist could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFields = (list, extra = {}) =>
    list
      .filter((field) => !field.deceasedOnly || isDeceased)
      .map(({ deceasedOnly, ...field }) => (
        <Field
          key={field.name}
          {...field}
          {...extra}
          value={artist[field.name]}
          onChange={updateArtist}
        />
      ));

  return (
    <section className={styles.addArtist}>
      <button
        type="button"
        className={styles.toggleButton}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((open) => !open);
          setErrorMessage("");
        }}
      >
        {isOpen ? "Cancel" : "Add an artist"}
      </button>

      {isOpen && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <h2 className={styles.formTitle}>Add a new artist</h2>

          <div className={styles.fieldGrid}>{renderFields(fields)}</div>

          <datalist id="artist-genres">
            {genreOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>

          {renderFields(textareas, { multiline: true, maxLength: 2000 })}

          {errorMessage && (
            <p className={styles.errorMessage} role="alert">
              {errorMessage}
            </p>
          )}
          <button
            className={styles.submitButton}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving artist…" : "Submit artist"}
          </button>
        </form>
      )}
    </section>
  );
}

export default AddArtist;