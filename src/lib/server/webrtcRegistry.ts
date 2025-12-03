import type { RTCPeerConnection } from '@roamhq/wrtc';

export type ManagedConnection = {
	id: string;
	pc: RTCPeerConnection;
	startedAt: Date;
};

export type ClosedConnection = {
	id: string;
	startedAt: Date;
	endedAt: Date;
	durationMs: number;
};

// Tracks active WebRTC connections keyed by connection id.
export const connections = new Map<string, ManagedConnection>();
export const oldConnections: ClosedConnection[] = [];

export function finalizeConnection(connectionId: string, endedAt: Date = new Date()): void {
	const managed = connections.get(connectionId);
	if (!managed) {
		return;
	}

	connections.delete(connectionId);

	const durationMs = Math.max(0, endedAt.getTime() - managed.startedAt.getTime());
	oldConnections.unshift({
		id: managed.id,
		startedAt: managed.startedAt,
		endedAt,
		durationMs
	});

	if (oldConnections.length > 10) {
		oldConnections.pop();
	}
}
