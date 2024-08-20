flowchart LR
  User((User)) -->|Fill Form| FrontEnd((Front-End))
  FrontEnd -->|POST Data to API| RestAPI((REST API))
  RestAPI -->|Return Proposal ID| FrontEnd
  FrontEnd -->|Connect using Proposal ID, Proposal ID, Auth Token| WebSocketClient((WebSocket Client))
  WebSocketClient -->|wss:// Connection| WebSocketServer((WebSocket Server))
  WebSocketServer -->|Send Approval Status| WebSocketClient
  WebSocketClient -->|Update UI| UserInterface[User Interface]

  %% Lifecycle management
  WebSocketClient -.->|Handling Open, Close, and Errors| Lifecycle[Lifecycle Management]

  %% Security and Scaling
  WebSocketClient -.->|Securing wss:// Connections| Security[Security Measures]
  WebSocketServer -.->|Optimizing and Scaling| Scaling[Optimizing & Scaling]

  %% Interface Contract
  FrontEnd -->|Validate| InterfaceContract[Interface Contract]
  RestAPI -->|Validate| InterfaceContract

  %% Additional Features
  WebSocketServer -.->|Heartbeats| Heartbeats[Implement WebSocket Heartbeats]
  WebSocketServer -.->|Connection Limits| ConnectionLimits[Limit WebSocket Connections]
  WebSocketServer -.->|Logs and Monitor| Logging[Logs & Monitor WebSocket Traffic]
