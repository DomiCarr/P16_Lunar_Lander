// src/input/Keyboard.ts

import { Lander } from '../engine/Lander';

/**
 * Manages keyboard inputs and updates the Lander's engine states.
 */
export class Keyboard {
    private lander: Lander;

    constructor(lander: Lander) {
        this.lander = lander;
        this.setupListeners();
    }

    private setupListeners(): void {
        window.addEventListener('keydown', (e) => this.handleKey(e, true));
        window.addEventListener('keyup', (e) => this.handleKey(e, false));
    }

    private handleKey(event: KeyboardEvent, isPressed: boolean): void {
        switch (event.key) {
            case 'ArrowLeft':
                this.lander.isEngineLeftActive = isPressed;
                break;
            case 'ArrowRight':
                this.lander.isEngineRightActive = isPressed;
                break;
            case 'ArrowDown':
                this.lander.isEngineBottomActive = isPressed;
                break;
        }
    }
}