export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="container1">
        <div className="row align-items-center gy-4">
          <div className="col-lg-6">
            <h1 className="display-5 fw-bold mb-4">Reliable Cars. Fair Prices. Anytime, Anywhere.</h1>
            <p className="lead text-muted mb-4">Pick from hatchbacks, sedans, or SUVs. Quick booking, secure pickup, and flexible returns.</p>
            <div className="d-flex gap-3">
              <a href="#cars" className="btn btn-primary btn-lg">Browse Cars</a>
              <a href="contact" className="btn btn-outline-secondary btn-lg">Contact Us</a>
            </div>
          </div>
          <div className="col-lg-6">
            <img 
              src="/hero-car.jpg" 
              alt="car hero" 
              className="img-fluid rounded-3"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
