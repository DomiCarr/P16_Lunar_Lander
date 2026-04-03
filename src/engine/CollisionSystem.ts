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

        // 1. Horizontal Boundary Check (Sides of the screen)
        if (x < 0 || x > worldWidth) {
            return 'CRASHED';
        }

        // 2. Terrain Collision Check
        const groundY = terrain.getGroundHeight(x);

        // If lander Y is at or below ground altitude
        if (y >= groundY) {
            return this.evaluateTouchdown(lander, terrain, maxSafeVelocity);
        }

        return 'NONE';
    }

    private static evaluateTouchdown(
        lander: Lander,
        terrain: TerrainManager,
        maxSafeVelocity: number
    ): CollisionResult {
        const x = lander.position.x;
        const velocity = lander.velocity;

        // Check if we are within the horizontal bounds of a landing pad
        const onPad = terrain.pads.find(pad => x >= pad.x1 && x <= pad.x2);

        if (!onPad) {
            return 'CRASHED'; // Hit the mountains
        }

        // Check landing speed (Magnitude of the velocity vector)
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);

        if (isNaN(speed) || speed > maxSafeVelocity) {
            return 'CRASHED';
        }

        return 'LANDED'; // Perfect landing!
    }
}