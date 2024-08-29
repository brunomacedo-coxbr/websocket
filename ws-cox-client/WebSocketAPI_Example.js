/**
 * It is an example of what we should have in mind to implement
 */
export default class WebSocketClient {
  constructor(url, protocols = [], token = null) {
    this.url = url;
    this.protocols = protocols;
    this.token = token;
    this.socket = null;
    this.reconnectInterval = 1000; // Initial reconnect interval in ms
    this.maxReconnectInterval = 30000; // Maximum reconnect interval in ms
    this.eventListeners = {};
    this.messageQueue = [];
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10; // Maximum number of reconnection attempts
  }

  // Method to connect to the WebSocket server
  connect() {
    const headers = this.token ? { Authorization: `Bearer ${this.token}` } : {};
    const options = {
      headers: headers,
    };

    this.socket = new WebSocket(this.url, this.protocols, options);

    // Override the onopen method to set headers
    const originalOnOpen = this.socket.onopen;
    this.socket.onopen = (event) => {
      if (originalOnOpen) originalOnOpen.call(this.socket, event);
      this.socket.send(JSON.stringify({ type: 'auth', token: this.token }));
    };

    // Event listener for connection open
    this.socket.onopen = () => {
      console.log("Connected");
      this.isConnected = true;
      this.reconnectAttempts = 0; // Reset reconnect attempts on successful connection
      this.flushMessageQueue();
      this.dispatchEvent("open");
    };

    // Event listener for receiving messages
    this.socket.onmessage = (event) => {
      console.log("Message received:", event.data);
      this.dispatchEvent("message", event.data);
    };

    // Event listener for connection close
    this.socket.onclose = () => {
      console.log("Disconnected");
      this.isConnected = false;
      this.dispatchEvent("close");
      this.reconnect();
    };

    // Event listener for errors
    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.dispatchEvent("error", error);
    };
  }

  // Method to send a message
  send(message) {
    if (this.isConnected) {
      this.socket.send(message);
    } else {
      console.warn("WebSocket is not open. Queuing message.");
      this.messageQueue.push(message);
    }
  }

  // Method to disconnect from the WebSocket server
  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  // Method to handle reconnection logic
  reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts += 1;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);

      // Exponential backoff for reconnection attempts
      this.reconnectInterval = Math.min(
        this.reconnectInterval * 2,
        this.maxReconnectInterval
      );
    } else {
      console.error("Max reconnect attempts reached. Please check the server.");
    }
  }

  // Method to flush the message queue
  flushMessageQueue() {
    while (this.messageQueue.length > 0 && this.isConnected) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  // Method to add event listeners
  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  // Method to dispatch events
  dispatchEvent(event, data) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => callback(data));
    }
  }
}
