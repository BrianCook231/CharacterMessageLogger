import { getContext } from "../../../extensions.js";
import { eventSource, event_types } from "../../../../script.js";
import WebSocket from 'ws';

// WebSocket connection
let socket = null;

// Function to establish WebSocket connection
function connectWebSocket() {
    // Replace with the Windows machine's IP address
    socket = new WebSocket('ws://WINDOWS_IP_ADDRESS:8080');

    socket.on('open', () => {
        console.log('Connected to WebSocket server');
    });

    socket.on('message', (message) => {
        try {
            const response = JSON.parse(message);
            console.log('Received response from Windows PC:', response);
        } catch (error) {
            console.error('Error parsing response:', error);
        }
    });

    socket.on('close', () => {
        console.log('WebSocket connection closed');
        // Attempt to reconnect after a delay
        setTimeout(connectWebSocket, 5000);
    });

    socket.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
}

// Connect to WebSocket on startup
connectWebSocket();

// Retrieve application context, including chat logs and participant info.
const context = getContext();

function processMessageOnRemotePC(name, messageData) {
    // Check if socket is open and ready
    if (socket && socket.readyState === WebSocket.OPEN) {
        try {
            // Prepare message to send
            const messageToSend = {
                name: name,
                message: messageData,
                timestamp: new Date().toISOString()
            };

            // Send message via WebSocket
            socket.send(JSON.stringify(messageToSend));
            console.log('Message sent to Windows PC:', messageToSend);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    } else {
        console.error('WebSocket is not connected');
        // Attempt to reconnect
        connectWebSocket();
    }
}


eventSource.on(event_types.MESSAGE_RECEIVED, handleIncomingMessage);

function handleIncomingMessage(data) {
    // Access the most recent message from the chat log.
    let mostRecentMessage = context.chat[context.chat.length - 1];
    let name = mostRecentMessage.name;
}