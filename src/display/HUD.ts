// src/display/HUD.ts

import { Lander } from '../engine/Lander';
import { GAME_CONFIG } from '../config';

export class HUD {
    /**
     * Draws the Head-Up Display with real-time flight data.
     * @param altitude The vertical distance to the terrain below the lander.
     */
    public static draw(ctx: CanvasRenderingContext2D, lander: Lander, difficulty: number, altitude: number): void {
        const width = 220;
        const height = 150;
        const padding = 20;

        // Calculate position based on logical canvas size
        const dpr = window.devicePixelRatio || 1;
        const x = Math.floor(ctx.canvas.width / dpr - width - padding);
        const y = Math.floor(padding);

        // Background Box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);

        // Text Styles
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '500 13px "Courier New", monospace';
        ctx.textAlign = 'left';

        const startX = x + 15;
        const startY = y + 25;
        const lineHeight = 20;

        const diffSettings = GAME_CONFIG.DIFFICULTY_SETTINGS[difficulty as keyof typeof GAME_CONFIG.DIFFICULTY_SETTINGS];
        const hSpeedRaw = lander.velocity.x;
        const vSpeedRaw = lander.velocity.y;

        const hSpeedDisp = (hSpeedRaw * 100).toFixed(1);
        const vSpeedDisp = (vSpeedRaw * 100).toFixed(1);
        const fuel = Math.max(0, Math.floor(lander.fuel));

        // Content
        ctx.fillText(`DIFFICULTY : ${difficulty} - ${diffSettings?.label.toUpperCase()}`, startX, startY);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(startX, startY + 8);
        ctx.lineTo(x + width - 15, startY + 8);
        ctx.stroke();

        ctx.fillText(`ALTITUDE   : ${Math.max(0, Math.floor(altitude))} M`, startX, startY + lineHeight * 2);
        ctx.fillText(`H-SPEED    : ${hSpeedDisp} KM/H`, startX, startY + lineHeight * 3);

        // --- V-SPEED Blinking Logic ---
        const isSpeedTooHigh = vSpeedRaw > GAME_CONFIG.MAX_LANDING_SPEED;
        // Blink every 500ms (visible for 250ms, invisible for 250ms)
        const isBlinkVisible = Math.floor(Date.now() / 250) % 2 === 0;

        if (!(isSpeedTooHigh && !isBlinkVisible)) {
            ctx.fillText(`V-SPEED    : ${vSpeedDisp} KM/H`, startX, startY + lineHeight * 4);
        }

        ctx.fillText(`FUEL       : ${fuel} L`, startX, startY + lineHeight * 5);
    }
}