import { useEffect, useState, useCallback } from 'react';
import { WifiOff, RefreshCw, CheckCircle } from 'lucide-react';
import {
  registerConnectionHandler,
  checkBackendHealth,
} from '../services/api';
import './ConnectionStatus.css';

/**
 * ConnectionStatus
 * Listens to API connectivity signals and shows a sticky banner when the
 * backend becomes unreachable. Offers a manual retry and a brief
 * "reconnected" confirmation so users always know the live state.
 */
const ConnectionStatus = () => {
  const [online, setOnline] = useState(true);
  const [checking, setChecking] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  const handleChange = useCallback((isOnline) => {
    setOnline((prev) => {
      // Flash a "back online" message only on a real offline -> online flip.
      if (!prev && isOnline) {
        setJustReconnected(true);
        setTimeout(() => setJustReconnected(false), 2500);
      }
      return isOnline;
    });
  }, []);

  useEffect(() => {
    registerConnectionHandler(handleChange);
    // Initial probe + react to the browser's own connectivity events.
    checkBackendHealth();
    const onOffline = () => setOnline(false);
    const onOnline = () => checkBackendHealth();
    window.addEventListener('offline', onOffline);
    window.addEventListener('online', onOnline);
    return () => {
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('online', onOnline);
    };
  }, [handleChange]);

  const retry = async () => {
    setChecking(true);
    await checkBackendHealth();
    setChecking(false);
  };

  if (justReconnected) {
    return (
      <div className="conn-banner conn-online" role="status">
        <CheckCircle size={18} />
        <span>Back online — you're reconnected.</span>
      </div>
    );
  }

  if (online) return null;

  return (
    <div className="conn-banner conn-offline" role="alert">
      <WifiOff size={18} />
      <span>Connection lost. We can't reach the server right now.</span>
      <button className="conn-retry" onClick={retry} disabled={checking}>
        <RefreshCw size={15} className={checking ? 'spin' : ''} />
        {checking ? 'Checking…' : 'Retry'}
      </button>
    </div>
  );
};

export default ConnectionStatus;
