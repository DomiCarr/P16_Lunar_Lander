// src/display/TerrainRenderer.ts

import { TerrainManager } from '../engine/TerrainManager';

export class TerrainRenderer {
    /**
     * Draws the terrain with a thin line for mountains and a thick line for pads.
     * Line widths are adjusted by the zoom factor to maintain constant visual thickness.
     */
    public static draw(ctx: CanvasRenderingContext2D, terrain: TerrainManager, zoom: number): void {
        const points = terrain.points;
        if (points.length < 2) return;

        // --- 1. Draw the Main Terrain Line (Visual target: 1px) ---
        ctx.beginPath();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1 / zoom;
        ctx.lineJoin = 'round';

        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();

        // --- 2. Draw Landing Pads (Visual target: 3px) ---
        ctx.lineWidth = 3 / zoom;
        terrain.pads.forEach(pad => {
            ctx.beginPath();
            ctx.moveTo(pad.x1, pad.y);
            ctx.lineTo(pad.x2, pad.y);
            ctx.stroke();
        });
    }
}