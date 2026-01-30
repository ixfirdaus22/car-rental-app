import CarsSection from '../../components/CarsSection'

export default function CarsPage() {
  return (
    <div className="py-5">
      <div className="container mb-4">
        <h1 className="mb-2">Browse Our Cars</h1>
        <p className="text-muted">Explore our wide selection of vehicles available for rent</p>
      </div>
      <CarsSection />
    </div>
  )
}
