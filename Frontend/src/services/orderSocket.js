import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * orderSocket
 * Thin wrapper around a STOMP-over-SockJS client for live order tracking.
 *
 * The backend pushes order updates to:
 *   - /topic/orders/{orderId}                      (single order feed)
 *   - /topic/restaurants/{restaurantId}/orders     (owner dashboard feed)
 *
 * A single shared client is reused across subscriptions so we only open one
 * socket per session. Each `subscribe*` call returns an unsubscribe function.
 */

// Derive the ws handshake URL from the API base (strip the /api/v1 suffix).
const API_BASE =
  import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const WS_URL =
  import.meta.env?.VITE_WS_URL || API_BASE.replace(/\/api\/v1\/?$/, '') + '/ws';

let client = null;
let connected = false;
let connecting = false;
const pending = []; // subscription callbacks queued until we connect

const flushPending = () => {
  while (pending.length) {
    const fn = pending.shift();
    try {
      fn();
    } catch (err) {
      console.error('Failed to apply queued subscription', err);
    }
  }
};

const ensureClient = () => {
  if (client) return client;

  client = new Client({
    // Use a factory so SockJS reconnects cleanly.
    webSocketFactory: () => new SockJS(WS_URL),
    reconnectDelay: 4000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect: () => {
      connected = true;
      connecting = false;
      flushPending();
    },
    onWebSocketClose: () => {
      connected = false;
    },
    onStompError: (frame) => {
      console.error('STOMP error', frame?.headers?.message);
    },
  });

  return client;
};

const connect = () => {
  const c = ensureClient();
  if (!connected && !connecting) {
    connecting = true;
    c.activate();
  }
};

// Subscribe to a STOMP destination; returns an unsubscribe function.
const subscribe = (destination, onMessage) => {
  connect();
  let sub = null;

  const doSubscribe = () => {
    sub = client.subscribe(destination, (frame) => {
      try {
        onMessage(JSON.parse(frame.body));
      } catch {
        onMessage(frame.body);
      }
    });
  };

  if (connected) doSubscribe();
  else pending.push(doSubscribe);

  return () => {
    if (sub) sub.unsubscribe();
    // Remove from the pending queue if we never connected.
    const idx = pending.indexOf(doSubscribe);
    if (idx !== -1) pending.splice(idx, 1);
  };
};

const orderSocket = {
  subscribeToOrder: (orderId, onUpdate) =>
    subscribe(`/topic/orders/${orderId}`, onUpdate),

  subscribeToRestaurant: (restaurantId, onUpdate) =>
    subscribe(`/topic/restaurants/${restaurantId}/orders`, onUpdate),

  // Optional explicit teardown (e.g. on logout).
  disconnect: () => {
    if (client) {
      client.deactivate();
      client = null;
      connected = false;
      connecting = false;
      pending.length = 0;
    }
  },
};

export default orderSocket;
