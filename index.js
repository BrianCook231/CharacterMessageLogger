import { eventSource, event_types } from '../../../script.js';
import { getContext } from '../../extensions.js';
import fs from 'fs';
import path from 'path';

// Configuration for the extension
const config = {
    logDirectory: path.join(process.cwd(), 'character-messages'),
};

// Ensure log directory exists
function ensureLogDirectoryExists() {
    if (!fs.existsSync(config.logDirectory)) {
        fs.mkdirSync(config.logDirectory, { recursive: true });
    }
}

// Sanitize filename to remove invalid characters
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
}

// Log message to a file
function logMessageToFile(character, message) {
    ensureLogDirectoryExists();
    
    const sanitizedCharName = sanitizeFilename(character);
    const logFilePath = path.join(
        config.logDirectory, 
        `${sanitizedCharName}_messages.txt`
    );

    // Append message with timestamp
    const logEntry = `[${new Date().toISOString()}] ${message}\n`;
    
    try {
        fs.appendFileSync(logFilePath, logEntry);
        console.log(`Message logged for ${character}`);
    } catch (error) {
        console.error('Error logging message:', error);
    }
}

// Handle incoming messages
function handleIncomingMessage(data) {
    const context = getContext();
    
    // Get the current character name
    const currentCharacter = context.characters.find(
        char => char.avatar === context.characterAvatar
    )?.name || 'unknown_character';

    // Log the incoming message
    logMessageToFile(currentCharacter, data.message);
}

// Initialize the extension
function initMessageLogger() {
    // Listen for incoming messages
    eventSource.on(event_types.MESSAGE_RECEIVED, handleIncomingMessage);
    
    console.log('Character Message Logger Extension Initialized');
}

// Run initialization
initMessageLogger();

export { initMessageLogger };