// src/engine/CollisionSystem.ts

import { Lander } from './Lander';
import type { TerrainManager } from './TerrainManager';

export type CollisionResult = 'NONE' | 'LANDED' | 'CRASHED';

/**
 * Handles collision detection between the lander, the terrain, and world bounds.
 */
export class CollisionSystem {
    /**
     * Checks if the lander has hit the ground, landed on a pad, or left the play area.
     */
    public static checkCollision(
        lander: Lander,
        terrain: TerrainManager,
        maxSafeVelocity: number,
        worldWidth: number
    ): CollisionResult {
        const { x, y } = lander.position;
        const footY = y + 4; // Pads are 4px below the center

        // 1. Horizontal Boundary Check (Taking the 24px width into account)
        if (x - 12 < 0 || x + 12 > worldWidth) {
            return 'CRASHED';
        }

        // 2. Terrain Collision Check for both feet
        const groundYLeft = terrain.getGroundHeight(x - 12);
        const groundYRight = terrain.getGroundHeight(x + 12);

        // If either foot Y is at or below ground altitude
        if (footY >= groundYLeft || footY >= groundYRight) {
            return this.evaluateTouchdown(lander, terrain, maxSafeVelocity);
        }

        return 'NONE';
    }

    private static evaluateTouchdown(
        lander: Lander,
        terrain: TerrainManager,
        maxSafeVelocity: number
    ): CollisionResult {
        const { x } = lander.position;
        const velocity = lander.velocity;

        // Success condition: BOTH feet must be within the same landing pad bounds
        const onPad = terrain.pads.find(pad =>
            (x - 12) >= pad.x1 && (x + 12) <= pad.x2
        );

        if (!onPad) {
            return 'CRASHED'; // One or both feet hit the mountains/terrain
        }

        // Check landing speed (Magnitude of the velocity vector)
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

        if (isNaN(speed) || speed > maxSafeVelocity) {
            return 'CRASHED';
        }

        return 'LANDED'; // Perfect landing with both feet on the pad!
    }
}