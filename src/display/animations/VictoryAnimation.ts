// src/display/animations/VictoryAnimation.ts

import { Vector2D } from '../../engine/Vector2D';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
}

export class VictoryAnimation {
    private static particles: Particle[] = [];

    /**
     * Draws a monochrome celebration animation with pixel particles.
     */
    public static draw(ctx: CanvasRenderingContext2D, pos: Vector2D, frame: number): void {
        // 1. Shimmer effect on the lander (using shadow for a white glow)
        const isBright = Math.floor(frame / 5) % 2 === 0;
        ctx.shadowBlur = isBright ? 15 : 0;
        ctx.shadowColor = '#FFFFFF';

        // 2. Periodically spawn pixel bursts
        if (frame % 15 === 0) {
            this.createBurst(pos);
        }

        // 3. Update and draw particles
        ctx.fillStyle = '#FFFFFF';
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.015; // Subtle gravity
            p.life -= 0.008;

            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            ctx.globalAlpha = p.life;
            // Draw square pixels for a retro look
            ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.size, p.size);
        }

        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    private static createBurst(pos: Vector2D): void {
        const x = pos.x + (Math.random() - 0.5) * 300;
        const y = pos.y - Math.random() * 150;

        const count = 15;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 1.5 + 0.5;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                size: Math.random() > 0.5 ? 2 : 1
            });
        }
    }
}