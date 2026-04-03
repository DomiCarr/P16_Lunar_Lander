// src/display/FinalAnimationRenderer.ts

import { Lander } from '../../engine/Lander';
import type { CollisionResult } from '../../engine/CollisionSystem';
import { GAME_CONFIG } from '../../config';

export class FinalAnimationRenderer {
    /**
     * Renders the final animation (Explosion or Flag) based on collision result.
     */
    public static render(
        ctx: CanvasRenderingContext2D,
        state: CollisionResult,
        lander: Lander,
        frame: number,
        duration: number
    ): void {
        if (state === 'CRASHED') {
            this.drawExplosion(ctx, lander, frame, duration);
        } else if (state === 'LANDED') {
            this.drawFlag(ctx, lander, frame);
        }
    }

    private static drawExplosion(
        ctx: CanvasRenderingContext2D,
        lander: Lander,
        frame: number,
        duration: number
    ): void {
        const progress = frame / duration;
        const maxRadius = GAME_CONFIG.ANIMATION.EXPLOSION_MAX_RADIUS;
        const currentRadius = maxRadius * Math.sin(progress * Math.PI);

        ctx.beginPath();
        ctx.arc(lander.position.x, lander.position.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF'; // Strict Monochrome
        ctx.fill();

        // Add some "debris" pixels
        for (let i = 0; i < 10; i++) {
            const offset = (Math.random() - 0.5) * currentRadius * 2;
            ctx.fillRect(lander.position.x + offset, lander.position.y + offset, 2, 2);
        }
    }

    private static drawFlag(
        ctx: CanvasRenderingContext2D,
        lander: Lander,
        frame: number
    ): void {
        const x = lander.position.x + 15;
        const y = lander.position.y;

        // Simple flagpole
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y - 20);
        ctx.stroke();

        // Waving flag effect
        const wave = Math.sin(frame * 0.1) * 3;
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x + 15, y - 15 + wave);
        ctx.lineTo(x, y - 10);
        ctx.fill();
    }
}