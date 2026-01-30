import { useState } from 'react';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    siteName: 'RentYourCar',
    contactEmail: 'admin@rentyourcar.com',
    emailNotifications: true,
    smsNotifications: false,
    maintenanceMode: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="container-fluid p-0">
      <h1 className="fw-bold mb-4">⚙️ Settings</h1>

      <div className="row g-4">
        {/* General Settings */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">General Settings</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Site Name</label>
                  <input
                    type="text"
                    name="siteName"
                    className="form-control"
                    value={formData.siteName}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    className="form-control"
                    value={formData.contactEmail}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Notifications & Alerts</h5>
            </div>
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="emailNotifications"
                  id="emailNotif"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="emailNotif">
                  Enable Email Notifications
                </label>
                <div className="form-text">Receive emails for new bookings and cancellations.</div>
              </div>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="smsNotifications"
                  id="smsNotif"
                  checked={formData.smsNotifications}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="smsNotif">
                  Enable SMS Alerts
                </label>
                <div className="form-text">Receive SMS for urgent system alerts.</div>
              </div>

              <hr />

              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="maintenanceMode"
                  id="maintenance"
                  checked={formData.maintenanceMode}
                  onChange={handleChange}
                />
                <label className="form-check-label text-danger fw-bold" htmlFor="maintenance">
                  Maintenance Mode
                </label>
                <div className="form-text">Take the site offline for visitors. Admin access remains.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0 fw-bold">Security</h5>
            </div>
            <div className="card-body">
              <form className="row g-3 align-items-end">
                <div className="col-md-4">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="col-md-4">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="col-md-4">
                  <button type="button" className="btn btn-warning">Update Password</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
