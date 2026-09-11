export function BackgroundVideo() {
  return (
    <div className="bg-video" aria-hidden="true">
      <video autoPlay muted loop playsInline disablePictureInPicture preload="metadata">
        <source src={`${import.meta.env.BASE_URL}bg.mp4`} type="video/mp4" />
      </video>
      <img className="bg-still" src={`${import.meta.env.BASE_URL}bg-poster.webp`} alt="" />
      <div className="bg-vignette" />
    </div>
  )
}
