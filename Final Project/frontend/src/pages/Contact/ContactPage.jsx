import Contact from '../../components/Contact'

export default function ContactPage() {
  return (
    <div>
      <div className="py-5 bg-light">
        <div className="container text-center">
          <h1 className="mb-2">Get in Touch</h1>
          <p className="text-muted lead">We'd love to hear from you. Contact us anytime.</p>
        </div>
      </div>
      <Contact />
    </div>
  )
}
