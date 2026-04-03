// src/config.ts

/**
 * Mandatory structure for every difficulty level.
 */
interface DifficultySettings {
  label: string;
  padWidth: number;
  padCount: number;
  maxTerrainHeight: number;
  roughness: number;
  fuelCapacity: number;
}

export const GAME_CONFIG = {
  GAME_TITLE: 'LUNAR LANDER REBORN',
  GRAVITY: 0.005,
  THRUST_POWER: 0.015,
  MAX_LANDING_SPEED: 0.5,
  INITIAL_DIFFICULTY: 1,
  MAX_DIFFICULTY: 4,

  FUEL_CONSUMPTION_RATE: 0.5,

  // Camera Zoom Settings
  CAMERA: {
    TARGET_VIEW_HEIGHT: 400,      // Height of the zoomed window in logical pixels
    ZOOM_ALTITUDE_THRESHOLD: 150  // Altitude at which zoom starts
  },

  ANIMATION: {
    EXPLOSION_DURATION: 120,
    SUCCESS_DURATION: 120,
    EXPLOSION_MAX_RADIUS: 70
  },

  DIFFICULTY_SETTINGS: {
    1: {
      label: 'Easy',
      padWidth: 200,
      padCount: 3,
      maxTerrainHeight: 0.4,
      roughness: 2,
      fuelCapacity: 1000
    },
    2: {
      label: 'Medium',
      padWidth: 150,
      padCount: 2,
      maxTerrainHeight: 0.5,
      roughness: 3,
      fuelCapacity: 750
    },
    3: {
      label: 'Hard',
      padWidth: 100,
      padCount: 2,
      maxTerrainHeight: 0.6,
      roughness: 4,
      fuelCapacity: 500
    },
    4: {
      label: 'Horrible',
      padWidth: 50,
      padCount: 1,
      maxTerrainHeight: 0.7,
      roughness: 3,
      fuelCapacity: 300
    }
  } as Record<number, DifficultySettings>
};