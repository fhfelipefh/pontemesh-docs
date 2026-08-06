import logoIcon from '../assets/logo-icon.png'

export function BrandMark() {
  return (
    <span className="brand" aria-label="Ponte Mesh">
      <img className="brand__mark" src={logoIcon} alt="" aria-hidden="true" />
      <span className="brand__name"><span>Ponte</span><span>Mesh</span></span>
    </span>
  )
}
