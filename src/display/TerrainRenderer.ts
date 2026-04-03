// src/display/TerrainRenderer.ts

import { TerrainManager } from '../engine/TerrainManager';

export class TerrainRenderer {
    public static draw(ctx: CanvasRenderingContext2D, terrain: TerrainManager): void {
        if (terrain.points.length < 2) return;

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.5;
        ctx.beginPath();

        // 1. Draw the global mountain line
        ctx.moveTo(terrain.points[0].x, terrain.points[0].y);
        for (let i = 1; i < terrain.points.length; i++) {
            ctx.lineTo(terrain.points[i].x, terrain.points[i].y);
        }
        ctx.stroke();

        // 2. Highlight Landing Pads (Pure White)
        ctx.lineWidth = 4; // Slightly thicker for B&W contrast
        terrain.pads.forEach(pad => {
            ctx.beginPath();
            ctx.moveTo(pad.x1, pad.y);
            ctx.lineTo(pad.x2, pad.y);
            ctx.stroke();
        });
    }
}