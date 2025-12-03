import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { serverStartTime, webrtcConnections, numberVisitors } from '$lib/server/runtimeState';
import { connections, oldConnections } from '$lib/server/webrtcRegistry';

function formatDuration(milliseconds: number): string {
	const totalSeconds = Math.floor(milliseconds / 1000);
	const days = Math.floor(totalSeconds / 86400);
	const hours = Math.floor((totalSeconds % 86400) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;

	return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function formatDateTime(date: Date): string {
	const pad = (value: number) => value.toString().padStart(2, '0');
	const year = date.getFullYear();
	const month = pad(date.getMonth() + 1);
	const day = pad(date.getDate());
	const hours = pad(date.getHours());
	const minutes = pad(date.getMinutes());
	const seconds = pad(date.getSeconds());
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const GET: RequestHandler = () => {
	const now = new Date();
	const elapsedMs = now.getTime() - serverStartTime.getTime();
	const connectionDetails = Array.from(connections.values()).map((connection) => {
		const durationMs = now.getTime() - connection.startedAt.getTime();
		return {
			connectionId: connection.id,
			startTime: formatDateTime(connection.startedAt),
			duration: formatDuration(durationMs)
		};
	});
	const recentConnectionDetails = oldConnections.map((connection) => ({
		connectionId: connection.id,
		startTime: formatDateTime(connection.startedAt),
		duration: formatDuration(connection.durationMs)
	}));

	return json({
		serverStartTime: formatDateTime(serverStartTime),
		currentTime: formatDateTime(now),
		runningTime: formatDuration(elapsedMs),
		totalVisitors: numberVisitors,
		currentConnections: connections.size,
		totalConnections: webrtcConnections,
		connectionIds: Array.from(connections.keys()),
		connections: connectionDetails,
		oldConnections: recentConnectionDetails
	});
};
