// src/main.ts

import './style.css';
import { Vector2D } from './engine/Vector2D';
import { Lander } from './engine/Lander';
import { TerrainManager } from './engine/TerrainManager';
import { LanderRenderer } from './display/LanderRenderer';
import { TerrainRenderer } from './display/TerrainRenderer';
import { HUD } from './display/HUD';
import { FinalAnimationRenderer } from './display/animations/FinalAnimationRenderer';
import { VictoryAnimation } from './display/animations/VictoryAnimation';
import { Keyboard } from './input/Keyboard';
import { CollisionSystem } from './engine/CollisionSystem';
import type { CollisionResult } from './engine/CollisionSystem';
import { GAME_CONFIG } from './config';

type AppState = 'START_MENU' | 'PLAYING' | 'GAME_OVER';

const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;

function resizeCanvas(): void {
  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let currentDifficulty = GAME_CONFIG.INITIAL_DIFFICULTY;
let appState: AppState = 'START_MENU';
let lander: Lander;
let terrain: TerrainManager;
let collisionResult: CollisionResult = 'NONE';
let animationFrameCounter = 0;
let isAnimationFinished = false;

function initLevel(difficulty: number): void {
  const settings = GAME_CONFIG.DIFFICULTY_SETTINGS[difficulty as keyof typeof GAME_CONFIG.DIFFICULTY_SETTINGS];
  const dpr = window.devicePixelRatio || 1;
  const logicalWidth = canvas.width / dpr;
  const logicalHeight = canvas.height / dpr;

  lander = new Lander(logicalWidth / 2, 50, settings.fuelCapacity);
  terrain = new TerrainManager(logicalWidth, logicalHeight, difficulty);
  new Keyboard(lander);

  collisionResult = 'NONE';
  animationFrameCounter = 0;
  isAnimationFinished = false;
  appState = 'PLAYING';
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    if (appState === 'START_MENU') {
      initLevel(currentDifficulty);
    } else if (appState === 'GAME_OVER' && isAnimationFinished) {
      if (collisionResult === 'LANDED') {
        currentDifficulty = currentDifficulty < GAME_CONFIG.MAX_DIFFICULTY ? currentDifficulty + 1 : 1;
      } else {
        currentDifficulty = 1;
      }
      appState = 'START_MENU';
    }
  }
});

function gameLoop(): void {
  const dpr = window.devicePixelRatio || 1;
  ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

  if (appState === 'START_MENU') {
    renderStartMenu();
  } else {
    updateAndRenderGame();
  }
  requestAnimationFrame(gameLoop);
}

function updateAndRenderGame(): void {
  const dpr = window.devicePixelRatio || 1;
  const viewWidth = canvas.width / dpr;
  const viewHeight = canvas.height / dpr;

  // 1. Apollo Physics: Distance from lowest foot (x +/- 12, y + 4)
  const footY = lander.position.y + 4;
  const groundLeft = terrain.getGroundHeight(lander.position.x - 12);
  const groundRight = terrain.getGroundHeight(lander.position.x + 12);
  const currentAltitude = Math.min(groundLeft - footY, groundRight - footY);

  // 2. Physics & Collisions
  if (collisionResult === 'NONE') {
    const gravityVec = new Vector2D(0, GAME_CONFIG.GRAVITY);
    lander.update(gravityVec, GAME_CONFIG.THRUST_POWER, GAME_CONFIG.FUEL_CONSUMPTION_RATE);
    collisionResult = CollisionSystem.checkCollision(lander, terrain, GAME_CONFIG.MAX_LANDING_SPEED, viewWidth);
    if (collisionResult !== 'NONE') stopEngines(lander);
  }

  // 3. Camera Logic (Binary Zoom based on currentAltitude)
  const zoomFactor = viewHeight / GAME_CONFIG.CAMERA.TARGET_VIEW_HEIGHT;
  const currentZoom = (currentAltitude < GAME_CONFIG.CAMERA.ZOOM_ALTITUDE_THRESHOLD) ? zoomFactor : 1;

  ctx.save();
  if (currentZoom > 1) {
    ctx.translate(viewWidth / 2, viewHeight / 2);
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(-lander.position.x, -lander.position.y);
  }

  // Draw terrain and handle process with current zoom factor
  TerrainRenderer.draw(ctx, terrain, currentZoom);
  handleGameProcess(ctx, lander, collisionResult, currentZoom);
  ctx.restore();

  // 4. Overlays (Static)
  HUD.draw(ctx, lander, currentDifficulty, currentAltitude);
  if (appState === 'GAME_OVER') {
    renderGameOverOverlay(collisionResult);
  }
}

function handleGameProcess(ctx: CanvasRenderingContext2D, lander: Lander, state: CollisionResult, zoom: number): void {
  if (state === 'NONE') {
    LanderRenderer.draw(ctx, lander, zoom);
    return;
  }

  const isFinalVictory = currentDifficulty === GAME_CONFIG.MAX_DIFFICULTY && state === 'LANDED';
  const duration = isFinalVictory ? 400 : (state === 'CRASHED' ? GAME_CONFIG.ANIMATION.EXPLOSION_DURATION : GAME_CONFIG.ANIMATION.SUCCESS_DURATION);

  if (!isAnimationFinished) {
    animationFrameCounter++;
    LanderRenderer.draw(ctx, lander, zoom);
    FinalAnimationRenderer.render(ctx, state, lander, animationFrameCounter, duration);

    if (isFinalVictory && animationFrameCounter > 30) {
      VictoryAnimation.draw(ctx, lander.position, animationFrameCounter);
    }

    if (animationFrameCounter >= duration) {
      isAnimationFinished = true;
      appState = 'GAME_OVER';
    }
  } else {
    LanderRenderer.draw(ctx, lander, zoom);
    FinalAnimationRenderer.render(ctx, state, lander, duration, duration);
  }
}

function renderStartMenu(): void {
  const dpr = window.devicePixelRatio || 1;
  const centerX = canvas.width / (2 * dpr);
  const centerY = canvas.height / (2 * dpr);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 48px monospace';
  ctx.fillText(GAME_CONFIG.GAME_TITLE, centerX, centerY - 60);
  ctx.font = '20px monospace';
  ctx.fillText(`Difficulty ${currentDifficulty} - ${GAME_CONFIG.DIFFICULTY_SETTINGS[currentDifficulty as keyof typeof GAME_CONFIG.DIFFICULTY_SETTINGS].label}`, centerX, centerY);
  ctx.font = '16px monospace';
  ctx.fillStyle = '#AAAAAA';
  ctx.fillText('PRESS [ENTER] TO START MISSION', centerX, centerY + 60);
}

function renderGameOverOverlay(result: CollisionResult): void {
  const dpr = window.devicePixelRatio || 1;
  const viewWidth = canvas.width / dpr;
  const viewHeight = canvas.height / dpr;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(0, 0, viewWidth, viewHeight);
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 42px monospace';
  const message = result === 'LANDED' ? 'MISSION ACCOMPLISHED' : 'GAME OVER';
  ctx.fillText(message, viewWidth / 2, viewHeight / 2 - 20);
  ctx.font = '16px monospace';
  ctx.fillText('PRESS [ENTER] TO CONTINUE', viewWidth / 2, viewHeight / 2 + 40);
}

function stopEngines(l: Lander): void {
  l.isEngineBottomActive = l.isEngineLeftActive = l.isEngineRightActive = false;
}

gameLoop();