import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import driverService from '../services/driverService';
import { MapPin, CheckCircle, Navigation, AlertCircle, ShoppingBag } from 'lucide-react';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [myDeliveries, setMyDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const driverId = user?.id;

  const fetchData = async () => {
    if (!driverId) return;
    setLoading(true);
    setError('');
    try {
      const availRes = await driverService.getAvailableDeliveries();
      if (availRes.success) {
        setAvailableDeliveries(availRes.data || []);
      }
      const myRes = await driverService.getMyDeliveries(driverId);
      if (myRes.success) {
        setMyDeliveries(myRes.data || []);
      }
    } catch (err) {
      setError('Failed to fetch logistics data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [driverId]);

  const handleAcceptJob = async (deliveryId) => {
    setError('');
    setSuccess('');
    try {
      const res = await driverService.acceptDelivery(deliveryId, driverId);
      if (res.success) {
        setSuccess('Delivery claimed successfully!');
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to claim delivery job.');
    }
  };

  const handleUpdateStatus = async (deliveryId, status) => {
    setError('');
    setSuccess('');
    try {
      const res = await driverService.updateDeliveryStatus(deliveryId, status, driverId);
      if (res.success) {
        setSuccess(`Delivery updated to ${status}!`);
        fetchData();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  if (!isAuthenticated || user?.userRole !== 'DRIVER') {
    return (
      <div className="container empty-state mt-5">
        <h2>Access Denied</h2>
        <p>You must be logged in as a Driver to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container driver-dashboard-page fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Driver Logistics Portal</h1>
        <p className="page-subtitle">Claim orders, coordinate pickups, and navigate deliveries.</p>
      </div>

      {success && <div className="success-message mb-4">{success}</div>}
      {error && <div className="error-message mb-4">{error}</div>}

      {loading ? (
        <div className="loading-state"><div className="spinner"></div></div>
      ) : (
        <div className="dashboard-grid">
          {/* Section 1: Active Deliveries */}
          <div className="dashboard-section">
            <h2 className="section-title">
              <Navigation className="section-icon text-gradient" />
              <span>Active Assignments ({myDeliveries.filter(d => d.status !== 'DELIVERED' && d.status !== 'CANCELLED').length})</span>
            </h2>

            <div className="deliveries-list">
              {myDeliveries.filter(d => d.status !== 'DELIVERED' && d.status !== 'CANCELLED').length === 0 ? (
                <div className="empty-card glass">
                  <AlertCircle size={40} className="mb-2 text-secondary" />
                  <p>No active delivery tasks. Claim a job below!</p>
                </div>
              ) : (
                myDeliveries.filter(d => d.status !== 'DELIVERED' && d.status !== 'CANCELLED').map((delivery) => (
                  <div key={delivery.id} className="delivery-card glass active-card">
                    <div className="card-header">
                      <h3>Delivery #{delivery.id}</h3>
                      <span className={`status-badge badge-${delivery.status.toLowerCase()}`}>{delivery.status}</span>
                    </div>

                    <div className="card-body">
                      <div className="address-block">
                        <MapPin size={16} className="text-primary" />
                        <div>
                          <span className="address-label">Pickup From:</span>
                          <p>{delivery.pickupAddress}</p>
                        </div>
                      </div>
                      <div className="address-block mt-3">
                        <MapPin size={16} className="text-secondary" />
                        <div>
                          <span className="address-label">Deliver To:</span>
                          <p>{delivery.dropoffAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions d-flex gap-2 mt-4">
                      {delivery.status === 'ACCEPTED' && (
                        <button 
                          onClick={() => handleUpdateStatus(delivery.id, 'PICKED_UP')} 
                          className="btn btn-primary btn-sm btn-block"
                        >
                          Mark Picked Up
                        </button>
                      )}
                      {delivery.status === 'PICKED_UP' && (
                        <button 
                          onClick={() => handleUpdateStatus(delivery.id, 'IN_TRANSIT')} 
                          className="btn btn-primary btn-sm btn-block"
                        >
                          Start Transit
                        </button>
                      )}
                      {delivery.status === 'IN_TRANSIT' && (
                        <button 
                          onClick={() => handleUpdateStatus(delivery.id, 'DELIVERED')} 
                          className="btn btn-success btn-sm btn-block"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section 2: Available Jobs */}
          <div className="dashboard-section">
            <h2 className="section-title">
              <ShoppingBag className="section-icon text-gradient" />
              <span>Available Jobs Queue ({availableDeliveries.length})</span>
            </h2>

            <div className="deliveries-list">
              {availableDeliveries.length === 0 ? (
                <div className="empty-card glass">
                  <CheckCircle size={40} className="mb-2 text-success" />
                  <p>All clear! There are no pending delivery jobs.</p>
                </div>
              ) : (
                availableDeliveries.map((delivery) => (
                  <div key={delivery.id} className="delivery-card glass available-card">
                    <div className="card-header">
                      <h3>Order #{delivery.orderId}</h3>
                      <span className="status-badge badge-pending">PENDING</span>
                    </div>

                    <div className="card-body">
                      <div className="address-block">
                        <MapPin size={16} className="text-primary" />
                        <div>
                          <span className="address-label">Pickup:</span>
                          <p>{delivery.pickupAddress}</p>
                        </div>
                      </div>
                      <div className="address-block mt-3">
                        <MapPin size={16} className="text-secondary" />
                        <div>
                          <span className="address-label">Dropoff:</span>
                          <p>{delivery.dropoffAddress}</p>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions mt-4">
                      <button 
                        onClick={() => handleAcceptJob(delivery.id)} 
                        className="btn btn-secondary btn-sm btn-block"
                      >
                        Claim Assignment
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDashboard;
