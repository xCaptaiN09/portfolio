export function Preloader() {
  return (
    <div className="preloader">
      <div className="preloader__inner">
        <div className="preloader__line">[ 0.000000 ] Booting Linux on physical CPU 0x0</div>
        <div className="preloader__line">[ 0.014209 ] Linux version 4.19.282-xcaptain09</div>
        <div className="preloader__line">[ 0.118400 ] MT6893 platform detected: RMX3031 / cupida</div>
        <div className="preloader__line">[ 0.420901 ] KernelSU-Next initialized</div>
        <div className="preloader__line">[ 0.703022 ] SuSFS backports loaded</div>
        <div className="preloader__line">[ 1.000000 ] userspace handoff: portfolio.service</div>
        <div className="preloader__bar" />
      </div>
    </div>
  )
}