// src/display/animations/LandingAnimation.ts

import { Vector2D } from '../../engine/Vector2D';

export class LandingAnimation {
    /**
     * Renders a flagpole and a deploying flag.
     */
    public static draw(ctx: CanvasRenderingContext2D, pos: Vector2D, frame: number, duration: number): void {
        const progress = Math.min(1, frame / duration);
        const flagX = pos.x + 12;
        const poleHeight = 18;

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;

        // 1. Draw Pole
        const currentHeight = poleHeight * Math.min(1, progress * 2);
        ctx.beginPath();
        ctx.moveTo(flagX, pos.y);
        ctx.lineTo(flagX, pos.y - currentHeight);
        ctx.stroke();

        // 2. Draw Flag (appears after pole is 50% up)
        if (progress > 0.5) {
            const flagProgress = (progress - 0.5) * 2;
            const flagWidth = 14 * flagProgress;
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.moveTo(flagX, pos.y - poleHeight);
            ctx.lineTo(flagX + flagWidth, pos.y - poleHeight + 4);
            ctx.lineTo(flagX, pos.y - poleHeight + 8);
            ctx.closePath();
            ctx.fill();
        }
    }
}