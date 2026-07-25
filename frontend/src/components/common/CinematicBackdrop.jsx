import adwaHero from '../../assets/images/heroes/adwa_hero.png';
import './CinematicBackdrop.css';

/**
 * Shared cinematic background: the Adwa scene, a drifting timelapse sky and
 * the warm dark overlay stack. Keeps inner pages visually continuous with the hero.
 */
export default function CinematicBackdrop() {
  return (
    <div className="cbg" aria-hidden="true">
      <img src={adwaHero} alt="" className="cbg__img" decoding="async" />

      <div className="cbg__sky">
        <div className="cbg__clouds cbg__clouds--back" />
        <div className="cbg__clouds cbg__clouds--front" />
        <div className="cbg__light" />
      </div>

      <div className="cbg__overlay" />
      <div className="cbg__overlay-top" />
      <div className="cbg__overlay-bottom" />
    </div>
  );
}
