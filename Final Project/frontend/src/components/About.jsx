export default function About() {
  return (
    <section id="about" className="py-5 bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=500&q=60" 
              alt="about" 
              className="img-fluid rounded-3"
            />
          </div>
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">About RentYourCar</h2>
            <p className="text-muted">RentYourCar is your trusted partner for affordable and reliable car rentals. We offer a wide range of vehicles to suit every need, from budget-friendly hatchbacks to premium SUVs.</p>
            <p className="text-muted">Our mission is to make car rental simple, affordable, and accessible to everyone. With transparent pricing and easy booking, we ensure a hassle-free experience every time.</p>
            <ul className="list-unstyled">
              <li className="mb-2">✓ Wide selection of vehicles</li>
              <li className="mb-2">✓ Transparent pricing</li>
              <li className="mb-2">✓ 24/7 customer support</li>
              <li className="mb-2">✓ Easy online booking</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
