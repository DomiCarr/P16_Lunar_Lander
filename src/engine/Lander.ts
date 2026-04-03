// src/engine/Lander.ts

import { Vector2D } from './Vector2D';

/**
 * Represents the Lunar Lander spacecraft.
 * Handles movement logic and fuel management.
 */
export class Lander {
    public position: Vector2D;
    public velocity: Vector2D;
    public fuel: number;
    public isEngineBottomActive: boolean = false;
    public isEngineLeftActive: boolean = false;
    public isEngineRightActive: boolean = false;

    constructor(startX: number, startY: number, initialFuel: number) {
        this.position = new Vector2D(startX, startY);
        this.velocity = new Vector2D(0, 0);
        this.fuel = initialFuel;
    }

    /**
     * Updates the lander's physical state based on gravity and thrust.
     * @param gravity The gravity vector to apply.
     * @param thrustPower The strength of the engines.
     * @param consumptionRate Global fuel consumption multiplier.
     */
    public update(gravity: Vector2D, thrustPower: number, consumptionRate: number = 1): void {
        // 1. Apply Gravity
        this.velocity.add(gravity);

        // 2. Apply Thrust if fuel is available
        if (this.fuel > 0) {
            // Main engine consumes more than RCS (side thrusters)
            if (this.isEngineBottomActive) {
                this.velocity.y -= thrustPower;
                this.fuel -= consumptionRate;
            }
            if (this.isEngineLeftActive) {
                this.velocity.x += thrustPower;
                this.fuel -= consumptionRate * 0.5;
            }
            if (this.isEngineRightActive) {
                this.velocity.x -= thrustPower;
                this.fuel -= consumptionRate * 0.5;
            }
        }

        // 3. Update Position based on Velocity
        this.position.add(this.velocity);
    }
}