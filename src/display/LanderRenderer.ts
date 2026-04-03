// src/display/LanderRenderer.ts

import { Lander } from '../engine/Lander';

export class LanderRenderer {
    /**
     * Draws the lunar lander with line thickness compensation based on zoom.
     */
    public static draw(ctx: CanvasRenderingContext2D, lander: Lander, zoom: number): void {
        const { x, y } = lander.position;

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5 / zoom; // Maintain thin lines during zoom

        // --- Body (Octagonal Capsule) ---
        ctx.beginPath();
        ctx.moveTo(x - 6, y);
        ctx.lineTo(x - 9, y - 4);
        ctx.lineTo(x - 9, y - 10);
        ctx.lineTo(x - 5, y - 14);
        ctx.lineTo(x + 5, y - 14);
        ctx.lineTo(x + 9, y - 10);
        ctx.lineTo(x + 9, y - 4);
        ctx.lineTo(x + 6, y);
        ctx.closePath();
        ctx.stroke();

        // --- Landing Gear (Legs and Pads at x +/- 12, y + 4) ---
        ctx.beginPath();
        // Left Leg & Pad
        ctx.moveTo(x - 7, y - 2);
        ctx.lineTo(x - 12, y + 4);
        ctx.moveTo(x - 15, y + 4);
        ctx.lineTo(x - 9, y + 4);

        // Right Leg & Pad
        ctx.moveTo(x + 7, y - 2);
        ctx.lineTo(x + 12, y + 4);
        ctx.moveTo(x + 9, y + 4);
        ctx.lineTo(x + 15, y + 4);
        ctx.stroke();

        // --- Thruster Radial Flames ---
        if (lander.isEngineBottomActive) {
            this.drawRadialFlame(ctx, x, y, 'down', zoom);
        }
        if (lander.isEngineLeftActive) {
            this.drawRadialFlame(ctx, x - 9, y - 7, 'left', zoom);
        }
        if (lander.isEngineRightActive) {
            this.drawRadialFlame(ctx, x + 9, y - 7, 'right', zoom);
        }
    }

    private static drawRadialFlame(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        dir: string,
        zoom: number
    ): void {
        ctx.beginPath();
        // Maintain consistent flame line thickness
        ctx.lineWidth = 1 / zoom;

        if (dir === 'down') {
            // Main thruster nozzle plate
            ctx.moveTo(x - 3, y);
            ctx.lineTo(x + 3, y);
            // 5 Radial lines
            for (let i = -2; i <= 2; i++) {
                ctx.moveTo(x + i * 1.5, y);
                ctx.lineTo(x + i * 4, y + 10);
            }
        } else if (dir === 'left') {
            for (let i = -1; i <= 1; i++) {
                ctx.moveTo(x, y + i * 2);
                ctx.lineTo(x - 8, y + i * 4);
            }
        } else if (dir === 'right') {
            for (let i = -1; i <= 1; i++) {
                ctx.moveTo(x, y + i * 2);
                ctx.lineTo(x + 8, y + i * 4);
            }
        }
        ctx.stroke();
    }
}