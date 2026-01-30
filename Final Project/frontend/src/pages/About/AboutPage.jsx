import About from '../../components/About'

export default function AboutPage() {
  return (
    <div>
      <About />
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold mb-4">Why Choose Us?</h2>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 border rounded-3">
                <h5 className="mb-3">Wide Fleet</h5>
                <p className="text-muted">Choose from over 50 vehicles including hatchbacks, sedans, and SUVs to match your needs.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 border rounded-3">
                <h5 className="mb-3">Best Prices</h5>
                <p className="text-muted">Our transparent pricing means no hidden charges. Get the best deals in town.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 border rounded-3">
                <h5 className="mb-3">24/7 Support</h5>
                <p className="text-muted">Round-the-clock customer support to assist you anytime, anywhere.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 border rounded-3">
                <h5 className="mb-3">Easy Booking</h5>
                <p className="text-muted">Book your car in minutes with our simple and user-friendly online platform.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
