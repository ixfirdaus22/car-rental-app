export default function Contact() {
  return (
    <section id="contact" className="py-5 bg-light text-dark">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <h5 className="mb-3">Get in Touch</h5>
            <form>
              <div className="mb-3">
                <input type="text" className="form-control" placeholder="Your Name" />
              </div>
              <div className="mb-3">
                <input type="email" className="form-control" placeholder="Your Email" />
              </div>
              <div className="mb-3">
                <textarea className="form-control" rows="4" placeholder="Your Message"></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">Send Message</button>
            </form>
          </div>
          <div className="col-lg-6">
            <h5 className="mb-3">Business Hours</h5>
            <p className="text-muted">Monday - Friday: 9:00 AM - 6:00 PM</p>
            <p className="text-muted">Saturday: 10:00 AM - 4:00 PM</p>
            <p className="text-muted">Sunday: Closed</p>
            <h5 className="mb-3 mt-4">Follow Us</h5>
            <div className="d-flex gap-2">
              <a href="#" className="btn btn-outline-light btn-sm">Facebook</a>
              <a href="#" className="btn btn-outline-light btn-sm">Instagram</a>
              <a href="#" className="btn btn-outline-light btn-sm">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
