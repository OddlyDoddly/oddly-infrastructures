/**
 * Main entry point for the Oddly DDD TypeScript application.
 * 
 * This module starts the Express server and handles graceful shutdown.
 */

import { startServer } from './server';

// Get port from environment variable or use default
const PORT = parseInt(process.env.PORT || '3000', 10);

// Start the server
const app = startServer(PORT);

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('\nSIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT signal received: closing HTTP server');
    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (p_error: Error) => {
    console.error('Uncaught Exception:', p_error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (p_reason: any, p_promise: Promise<any>) => {
    console.error('Unhandled Rejection at:', p_promise, 'reason:', p_reason);
    process.exit(1);
});

export default app;
