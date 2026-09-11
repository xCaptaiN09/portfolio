export function BackgroundVideo() {
  return (
    <div className="bg-video" aria-hidden="true">
      <video autoPlay muted loop playsInline disablePictureInPicture preload="auto">
        <source src={`${import.meta.env.BASE_URL}bg.mp4`} type="video/mp4" />
      </video>
      <div className="bg-vignette" />
    </div>
  )
}
