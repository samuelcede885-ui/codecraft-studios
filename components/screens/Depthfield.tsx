export default function DepthfieldScreen() {
  return (
    <div className="scr scr-depth">
      <span className="df-sun" data-float />
      <svg viewBox="0 0 400 250" preserveAspectRatio="none" className="df-hills" aria-hidden="true">
        <path d="M0 150l60-40 50 30 70-70 60 50 50-35 110 70v95H0z" fill="#262626" />
        <path d="M0 190l80-35 70 25 60-30 80 40 50-20 60 25v55H0z" fill="#161616" />
      </svg>
      <svg viewBox="0 0 40 90" className="df-figure" aria-hidden="true">
        <circle cx="20" cy="9" r="8" fill="#050505" />
        <path d="M8 22c0-3 3-5 6-5h12c3 0 6 2 6 5l4 68H4z" fill="#050505" />
      </svg>
      <header className="scr-nav">
        <b>
          DEPTHFIELD
          <br />
          STUDIO
        </b>
        <nav>
          <span>About</span>
          <span>Services</span>
          <span>Projects</span>
          <span>Contact</span>
        </nav>
        <span className="df-time">New York 2:40 AM</span>
      </header>
      <p className="df-claim" data-float>
        Beyond
        <br />
        The Screen.
      </p>
      <span className="df-link">See all projects →</span>
      <div className="df-form">FORM</div>
    </div>
  );
}
