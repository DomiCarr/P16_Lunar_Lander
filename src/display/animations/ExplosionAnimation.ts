// src/display/animations/ExplosionAnimation.ts

import { Vector2D } from '../../engine/Vector2D';

export class ExplosionAnimation {
    /**
     * Renders a growing white circle.
     */
    public static draw(ctx: CanvasRenderingContext2D, pos: Vector2D, frame: number, duration: number): void {
        const progress = Math.min(1, frame / duration);
        const maxRadius = 50;
        // Ease-out effect for the growth
        const currentRadius = maxRadius * Math.sin((progress * Math.PI) / 2);

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle flicker
        if (frame % 4 === 0) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1;
            ctx.strokeRect(pos.x - currentRadius, pos.y - currentRadius, currentRadius * 2, currentRadius * 2);
        }
    }
}