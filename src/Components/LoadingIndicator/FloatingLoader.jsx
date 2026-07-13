import { FaShippingFast } from 'react-icons/fa'
import './DashboardLoader.css'

const FloatingLoader = ({ message = 'Loading your data...' }) => (
  <div className="zapshift-floating-loader" role="status" aria-live="polite" aria-busy="true" aria-label={message}>
    <span className="zapshift-floating-loader__icon" aria-hidden="true"><FaShippingFast /></span>
    <span className="zapshift-floating-loader__copy">
      <strong>{message}</strong>
      <span>Please wait a moment</span>
    </span>
    <span className="zapshift-floating-loader__dots" aria-hidden="true"><i /><i /><i /></span>
    <span className="zapshift-floating-loader__progress" aria-hidden="true" />
  </div>
)

export default FloatingLoader
