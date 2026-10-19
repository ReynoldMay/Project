function ArtistImage({ src, alt, className }) {
  const fallbackImage = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original";

  return (
    <div className="image-wrapper">
      <img
        src={src || fallbackImage}
        alt={alt || "Artist portrait"}
        className={className}
        onError={(e) => {
          e.target.src = fallbackImage;
        }}
      />
    </div>
  );
}

export default ArtistImage;