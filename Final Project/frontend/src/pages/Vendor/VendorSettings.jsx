import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context'
import { updateProfile as apiUpdateProfile, deleteProfile as apiDeleteProfile } from '../../services/api'

export default function VendorSettings() {
  const { user, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  
  const [vendorInfo, setVendorInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: 'RentYourCar Express',
    businessAddress: '123 Car Street, Mumbai, MH 400001',
    businessPhone: '+91 98765 43200',
    taxId: 'TIN123456789'
  })

  // Update vendorInfo when user data is available
  useEffect(() => {
    if (user) {
      setVendorInfo(prev => ({
        ...prev,
        fullName: user.name || user.fullName || '',
        email: user.email || '',
        phone: user.phoneNo || user.phone || ''
      }))
    }
  }, [user])

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: false,
    autoApproveBookings: false,
    maintenanceReminders: true,
    documentExpiry: true
  })

  const [saveSuccess, setSaveSuccess] = useState(false)
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleVendorInfoChange = (e) => {
    const { name, value } = e.target
    setVendorInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      // Prepare update data matching the backend API format
      const updateData = {
        name: vendorInfo.fullName,
        phoneNo: vendorInfo.phone,
        // Add other fields that can be updated
      }
      
      const response = await apiUpdateProfile(updateData)
      
      // Update local user context
      if (user) {
        const updatedUser = { ...user, ...updateData }
        updateUser(updatedUser)
      }
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert(error.response?.data?.message || 'Failed to save settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordError('')
    
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('All fields are required')
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New password and confirm password do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long')
      return
    }

    try {
      setIsLoading(true)
      const updateData = {
        currentPassword: passwordData.currentPassword,
        password: passwordData.newPassword
      }
      
      await apiUpdateProfile(updateData)
      alert('Password changed successfully!')
      setShowChangePasswordModal(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordError('')
    } catch (error) {
      console.error('Failed to change password:', error)
      setPasswordError(error.response?.data?.message || 'Failed to change password. Please check your current password.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.')) {
      return
    }

    try {
      setIsLoading(true)
      await apiDeleteProfile()
      alert('Account deleted successfully')
      logout()
      navigate('/login')
    } catch (error) {
      console.error('Failed to delete account:', error)
      alert(error.response?.data?.message || 'Failed to delete account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h4 className="mb-4">Settings</h4>

      {saveSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          ✓ Settings saved successfully!
          <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
        </div>
      )}

      {/* Personal Information */}
      <div className="vendor-card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Personal Information</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control"
                name="fullName"
                value={vendorInfo.fullName}
                onChange={handleVendorInfoChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control"
                name="email"
                value={vendorInfo.email}
                onChange={handleVendorInfoChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Phone Number</label>
              <input 
                type="tel" 
                className="form-control"
                name="phone"
                value={vendorInfo.phone}
                onChange={handleVendorInfoChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="vendor-card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Business Information</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Business Name</label>
              <input 
                type="text" 
                className="form-control"
                name="businessName"
                value={vendorInfo.businessName}
                onChange={handleVendorInfoChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Business Phone</label>
              <input 
                type="tel" 
                className="form-control"
                name="businessPhone"
                value={vendorInfo.businessPhone}
                onChange={handleVendorInfoChange}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Business Address</label>
              <textarea 
                className="form-control"
                rows="2"
                name="businessAddress"
                value={vendorInfo.businessAddress}
                onChange={handleVendorInfoChange}
              ></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label">Tax ID (TIN)</label>
              <input 
                type="text" 
                className="form-control"
                name="taxId"
                value={vendorInfo.taxId}
                onChange={handleVendorInfoChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="vendor-card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Notification Preferences</h5>
        </div>
        <div className="card-body">
          <div className="settings-group">
            <h6 className="settings-group-title">Communication Channels</h6>
            <div className="settings-item">
              <div className="settings-label">
                <label className="form-check-label">Email Notifications</label>
                <small className="text-muted">Get booking and system updates via email</small>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.emailNotifications}
                  onChange={() => handlePreferenceChange('emailNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-label">
                <label className="form-check-label">SMS Notifications</label>
                <small className="text-muted">Get instant alerts via SMS</small>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.smsNotifications}
                  onChange={() => handlePreferenceChange('smsNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-label">
                <label className="form-check-label">Push Notifications</label>
                <small className="text-muted">Browser notifications on your device</small>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.pushNotifications}
                  onChange={() => handlePreferenceChange('pushNotifications')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <hr />

          <div className="settings-group">
            <h6 className="settings-group-title">Reports & Analytics</h6>
            <div className="settings-item">
              <div className="settings-label">
                <label className="form-check-label">Weekly Reports</label>
                <small className="text-muted">Receive weekly performance summaries</small>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.weeklyReports}
                  onChange={() => handlePreferenceChange('weeklyReports')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-label">
                <label className="form-check-label">Monthly Reports</label>
                <small className="text-muted">Detailed monthly analytics and insights</small>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.monthlyReports}
                  onChange={() => handlePreferenceChange('monthlyReports')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>

          <hr />

          <div className="settings-group">
            <h6 className="settings-group-title">Booking Management</h6>
            <div className="settings-item">
              <div className="settings-label">
                <label className="form-check-label">Auto-Approve Bookings</label>
                <small className="text-muted">Automatically approve all new bookings</small>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.autoApproveBookings}
                  onChange={() => handlePreferenceChange('autoApproveBookings')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-label">
                <label className="form-check-label">Maintenance Reminders</label>
                <small className="text-muted">Alerts for scheduled maintenance</small>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.maintenanceReminders}
                  onChange={() => handlePreferenceChange('maintenanceReminders')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="settings-item">
              <div className="settings-label">
                <label className="form-check-label">Document Expiry Alerts</label>
                <small className="text-muted">Reminders for insurance and license renewal</small>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={preferences.documentExpiry}
                  onChange={() => handlePreferenceChange('documentExpiry')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="vendor-card danger-zone">
        <div className="card-header bg-danger-light">
          <h5 className="mb-0">Account Actions</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <h6>Change Password</h6>
              <p className="text-muted small">Update your account password</p>
              <button 
                className="btn btn-outline-primary"
                onClick={() => setShowChangePasswordModal(true)}
                disabled={isLoading}
              >
                Change Password
              </button>
            </div>
            <div className="col-md-6">
              <h6 className="text-danger">Delete Account</h6>
              <p className="text-muted small">Permanently delete your vendor account</p>
              <button 
                className="btn btn-outline-danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={isLoading}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-4 d-flex gap-2 justify-content-end">
        <button className="btn btn-secondary" onClick={() => navigate('/vendor/dashboard')}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="vendor-modal-overlay" onClick={() => {
          setShowChangePasswordModal(false)
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
          setPasswordError('')
        }}>
          <div className="vendor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Change Password</h5>
              <button 
                className="btn-close"
                onClick={() => {
                  setShowChangePasswordModal(false)
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordError('')
                }}
              ></button>
            </div>
            <div className="modal-body">
              {passwordError && (
                <div className="alert alert-danger">{passwordError}</div>
              )}
              <div className="mb-3">
                <label className="form-label">Current Password *</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Enter current password"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">New Password *</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Enter new password"
                />
                <small className="form-text text-muted">Password must be at least 6 characters</small>
              </div>
              <div className="mb-3">
                <label className="form-label">Confirm New Password *</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowChangePasswordModal(false)
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                  setPasswordError('')
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleChangePassword}
                disabled={isLoading}
              >
                {isLoading ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="vendor-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="vendor-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header bg-danger text-white">
              <h5>Delete Account</h5>
              <button 
                className="btn-close btn-close-white"
                onClick={() => setShowDeleteModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-danger">
                <strong>Warning!</strong> This action cannot be undone.
              </div>
              <p>Are you sure you want to permanently delete your vendor account?</p>
              <p className="text-muted small">
                This will delete:
                <ul>
                  <li>Your account and profile information</li>
                  <li>All your vehicles</li>
                  <li>All booking history</li>
                  <li>All revenue data</li>
                </ul>
              </p>
              <p className="text-danger fw-bold">This action is permanent and irreversible!</p>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Yes, Delete My Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
