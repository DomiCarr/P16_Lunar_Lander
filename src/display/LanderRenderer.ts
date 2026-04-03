// src/display/LanderRenderer.ts

import { Lander } from '../engine/Lander';

export class LanderRenderer {
    public static draw(ctx: CanvasRenderingContext2D, lander: Lander): void {
        const { x, y } = lander.position;

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();

        // Body of the lander
        ctx.moveTo(x - 8, y);
        ctx.lineTo(x + 8, y);
        ctx.lineTo(x + 5, y - 12);
        ctx.lineTo(x - 5, y - 12);
        ctx.closePath();
        ctx.stroke();

        // Draw thruster flames in White
        if (lander.isEngineBottomActive) this.drawFlame(ctx, x, y, 'down');
        if (lander.isEngineLeftActive) this.drawFlame(ctx, x - 8, y - 6, 'left');
        if (lander.isEngineRightActive) this.drawFlame(ctx, x + 8, y - 6, 'right');
    }

    private static drawFlame(ctx: CanvasRenderingContext2D, x: number, y: number, dir: string): void {
        ctx.beginPath();
        ctx.moveTo(x, y);
        if (dir === 'down') ctx.lineTo(x, y + 8);
        if (dir === 'left') ctx.lineTo(x - 5, y);
        if (dir === 'right') ctx.lineTo(x + 5, y);
        ctx.stroke();
    }
}