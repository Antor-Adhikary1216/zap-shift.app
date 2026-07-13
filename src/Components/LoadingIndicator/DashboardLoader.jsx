import { FaBoxOpen, FaShippingFast } from 'react-icons/fa'
import './DashboardLoader.css'

const DashboardLoader = ({ message = 'Loading your data...', fullScreen = false, compact = false }) => (
  <div
    className={`zapshift-loader ${fullScreen ? 'zapshift-loader--screen' : ''} ${compact ? 'zapshift-loader--compact' : ''}`}
    role="status"
    aria-live="polite"
    aria-label={message}
  >
    <div className="zapshift-loader__card">
      <div className="zapshift-loader__orbit" aria-hidden="true">
        <span className="zapshift-loader__ring zapshift-loader__ring--one" />
        <span className="zapshift-loader__ring zapshift-loader__ring--two" />
        <span className="zapshift-loader__parcel"><FaBoxOpen /></span>
      </div>

      <div className="zapshift-loader__route" aria-hidden="true">
        <span className="zapshift-loader__route-line" />
        <span className="zapshift-loader__truck"><FaShippingFast /></span>
        <span className="zapshift-loader__point zapshift-loader__point--start" />
        <span className="zapshift-loader__point zapshift-loader__point--end" />
      </div>

      <p className="zapshift-loader__message">{message}</p>
      <div className="zapshift-loader__dots" aria-hidden="true"><span /><span /><span /></div>
    </div>
  </div>
)

export default DashboardLoader
