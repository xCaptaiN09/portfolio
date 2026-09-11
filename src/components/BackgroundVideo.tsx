export function BackgroundVideo() {
  return (
    <div className="bg-video" aria-hidden="true">
      <video autoPlay muted loop playsInline disablePictureInPicture preload="auto">
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4" type="video/mp4" />
      </video>
      <div className="bg-vignette" />
    </div>
  )
}