# WebSocket Project

## Overview

This project consists of a WebSocket server and a client application. The server is built with Node.js, Express, and the WebSocket API, while the client is a Next.js application using TypeScript.

## Project Structure

- **web-client**: Contains the client-side application.
- **web-server**: Contains the server-side application.
- **ws-cox-client**: Contains the WebSocket front-end abstraction.

```
websocket/
├── package.json
├── web-client/
│   └── package.json
├── web-server/
│   └── package.json
└── ws-cox-client/
    └── package.json
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18.x or higher)
- Yarn (v1.x)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the dependencies for the entire project:

   ```bash
   yarn install
   ```

### Building the Project

To build the project, follow these steps:

1. Navigate to the `ws-cox-client` directory:

   ```bash
   cd ws-cox-client
   ```

2. Run the build command to compile the TypeScript files and prepare the package for distribution:

   ```bash
   yarn build
   ```

3. After the build is complete, a `.tgz` file will be generated in the `ws-cox-client` directory. This file will be used to install the package locally in the `web-client`.

4. Navigate to the `web-client` directory:

   ```bash
   cd ../web-client
   ```

5. Install the local package:

   ```bash
   yarn add file:../../ws-cox-client/ws-cox-client-2.0.1.tgz
   ```

### Running the Project

To run both the server and client simultaneously, use the following command from the root directory:

```bash
yarn start
```

This command will start the WebSocket server and the Next.js client in parallel.

#### WebSocket Server

The server will be accessible at `http://localhost:4000`.

**Server Files:**
- `web-server/index.js`: Main server script.
- `web-server/index.html`: HTML file served by the server.
- `web-server/package.json`: Dependencies and scripts for the server.

**Starting the Server:**

To start the server individually, navigate to the `web-server` directory and run:

```bash
yarn server
```

#### WebSocket Client

The client will be accessible at `http://localhost:9000`.

**Client Files:**
- `web-client/src/app/page.tsx`: Main React component for the client.
- `web-client/src/utils/socket.ts`: Utility for initializing the WebSocket connection.
- `web-client/package.json`: Dependencies and scripts for the client.

**Starting the Client:**

To start the client individually, navigate to the `web-client` directory and run:

```bash
yarn dev
```

## Project Details

### WebSocket Server (`web-server`)

The server uses Express and WebSocket to handle WebSocket connections and serve an HTML file.

- **Port:** 4000
- **CORS Configuration:** Allows requests from `http://localhost:9000`
- **Authentication:** Requires a specific token (`ZXhhbXBsZS10b2tlbi0xMjM0NTY=`) = `example-token-123456`

```bash
 echo -n "example-token-123456" | base64
```

**Endpoints:**

- `GET /`: Serves the `index.html` file.

**WebSocket Events:**

- **`auth`**: Authenticates clients. Clients must send a message with `type: "auth"` and a valid `token`. If the authentication is successful, the server sends a response with `type: "auth"` and `success: true`. Otherwise, it sends `success: false` and closes the connection with code `4001`.
- **`message`**: Once authenticated, clients can send messages. The server broadcasts these messages to all connected clients. Each message is sent as an object with `message` (the text content) and `id` (a unique identifier).

### WebSocket Client (`web-client`)

The client is built with Next.js and uses the WebSocket API to connect to the WebSocket server.

- **Port:** 9000

**Features:**

- Displays a list of messages received from the server.
- Allows users to send messages to the server.

**Utilities:**

- `initializeSocket(token: string, onMessage: (data: IMessageData) => void)`: Initializes the WebSocket connection with the given token and message handler.
- `getSocket(onMessage: (data: IMessageData) => void)`: Retrieves a new WebSocket client instance with the provided message handler.

## Troubleshooting

- **Server not starting:** Ensure you have installed all dependencies and there are no port conflicts.
- **Client not connecting:** Verify that the server is running and the token is correct.
- **Authentication issues:** Confirm that the token being used is correct and matches the one expected by the server.
