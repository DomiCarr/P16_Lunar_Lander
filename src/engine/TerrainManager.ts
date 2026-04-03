// src/engine/TerrainManager.ts

import { Vector2D } from './Vector2D';
import { GAME_CONFIG } from '../config';

export interface LandingPad {
    x1: number;
    x2: number;
    y: number;
}

/**
 * Handles smooth procedural terrain generation with anchored landing zones.
 */
export class TerrainManager {
    public points: Vector2D[] = [];
    public pads: LandingPad[] = [];

    constructor(width: number, height: number, difficulty: number) {
        this.generate(width, height, difficulty);
    }

    /**
     * Returns the terrain Y altitude at a given X coordinate.
     * Essential for the camera zoom logic and collision.
     */
    public getGroundHeight(x: number): number {
        // Find the two points surrounding x
        for (let i = 0; i < this.points.length - 1; i++) {
            const p1 = this.points[i];
            const p2 = this.points[i + 1];

            if (x >= p1.x && x <= p2.x) {
                // Linear interpolation between the two closest points
                const t = (x - p1.x) / (p2.x - p1.x);
                return p1.y + t * (p2.y - p1.y);
            }
        }

        // Fallback: If X is outside generated points, return a value
        // that will trigger a collision if below the view.
        return 9999;
    }

    private interpolate(y1: number, y2: number, t: number): number {
        const mu = (1 - Math.cos(t * Math.PI)) / 2;
        return y1 * (1 - mu) + y2 * mu;
    }

    private generate(width: number, height: number, difficulty: number): void {
        const settings = GAME_CONFIG.DIFFICULTY_SETTINGS[difficulty];
        const numPads = settings.padCount;
        const padWidth = settings.padWidth;
        const minHeight = height * (1 - settings.maxTerrainHeight);
        const maxHeight = height * 0.95;

        const bucketWidth = width / numPads;
        for (let i = 0; i < numPads; i++) {
            const bucketStartX = i * bucketWidth;
            const maxRelativeX = bucketWidth - padWidth;
            const padX1 = bucketStartX + Math.random() * maxRelativeX;
            const padY = minHeight + Math.random() * (maxHeight - minHeight);
            this.pads.push({ x1: padX1, x2: padX1 + padWidth, y: padY });
        }
        this.pads.sort((a, b) => a.x1 - b.x1);

        const sections: { startX: number, endX: number, startY: number, endY: number }[] = [];
        let currentX = 0;
        let lastY = minHeight + Math.random() * (maxHeight - minHeight);

        for (const pad of this.pads) {
            sections.push({ startX: currentX, endX: pad.x1, startY: lastY, endY: pad.y });
            currentX = pad.x2;
            lastY = pad.y;
        }
        const finalY = minHeight + Math.random() * (maxHeight - minHeight);
        sections.push({ startX: currentX, endX: width, startY: lastY, endY: finalY });

        const step = 10;
        const wavelength = 150 / settings.roughness;

        for (const section of sections) {
            const sectionWidth = section.endX - section.startX;
            if (sectionWidth <= 0) continue;

            const numNodes = Math.max(2, Math.ceil(sectionWidth / wavelength) + 1);
            const sectionNodes: number[] = [];

            sectionNodes.push(section.startY);
            for (let i = 1; i < numNodes - 1; i++) {
                sectionNodes.push(minHeight + Math.random() * (maxHeight - minHeight));
            }
            sectionNodes.push(section.endY);

            const nodeDist = sectionWidth / (numNodes - 1);
            for (let x = section.startX; x < section.endX; x += step) {
                const localX = x - section.startX;
                const nodeIndex = Math.floor(localX / nodeDist);
                const t = (localX % nodeDist) / nodeDist;
                const y1 = sectionNodes[nodeIndex];
                const y2 = sectionNodes[nodeIndex + 1] ?? sectionNodes[nodeIndex];
                this.points.push(new Vector2D(x, this.interpolate(y1, y2, t)));
            }
        }

        for (const pad of this.pads) {
            this.points.push(new Vector2D(pad.x1, pad.y));
            this.points.push(new Vector2D(pad.x2, pad.y));
        }
        this.points.sort((a, b) => a.x - b.x);
    }
}