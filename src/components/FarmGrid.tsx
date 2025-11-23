import React, { useEffect, useRef } from 'react';
import { useFarmStore } from '../store/farmStore';
import { CROP_DATA, ANIMAL_DATA, BUILDING_DATA } from '../types/farming';

export const FarmGrid: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    tiles,
    crops,
    animals,
    buildings,
    workers,
    selectedTool,
    clickTile
  } = useFarmStore();

  const TILE_SIZE = 48;
  const CANVAS_WIDTH = 20 * TILE_SIZE;
  const CANVAS_HEIGHT = 15 * TILE_SIZE;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#90EE90');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw tiles
    tiles.forEach((row, y) => {
      row.forEach((tile, x) => {
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        // Tile background
        switch (tile.type) {
          case 'empty':
            ctx.fillStyle = '#7cb342';
            break;
          case 'soil':
            ctx.fillStyle = '#6d4c41';
            break;
          case 'watered':
            ctx.fillStyle = '#5d4037';
            break;
          case 'planted':
          case 'growing':
          case 'harvestable':
            ctx.fillStyle = '#5d4037';
            break;
          case 'building':
            ctx.fillStyle = '#9e9e9e';
            break;
          case 'pasture':
            ctx.fillStyle = '#aed581';
            break;
          case 'path':
            ctx.fillStyle = '#bcaaa4';
            break;
        }

        ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

        // Tile border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

        // Watered effect
        if (tile.type === 'watered') {
          ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
          ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
        }
      });
    });

    // Draw buildings
    buildings.forEach(building => {
      const buildingData = BUILDING_DATA[building.type];
      const px = building.position.x * TILE_SIZE;
      const py = building.position.y * TILE_SIZE;
      const width = buildingData.size.width * TILE_SIZE;
      const height = buildingData.size.height * TILE_SIZE;

      // Building base
      ctx.fillStyle = building.isConstructed ? '#8d6e63' : '#bcaaa4';
      ctx.fillRect(px, py, width, height);

      // Border
      ctx.strokeStyle = '#5d4037';
      ctx.lineWidth = 2;
      ctx.strokeRect(px, py, width, height);

      // Construction progress
      if (!building.isConstructed) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(px, py, width, height);

        ctx.fillStyle = '#4caf50';
        const progressHeight = (height * building.constructionProgress) / 100;
        ctx.fillRect(px, py + height - progressHeight, width, progressHeight);

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          `${Math.floor(building.constructionProgress)}%`,
          px + width / 2,
          py + height / 2
        );
      } else {
        // Building icon
        ctx.font = `${Math.min(width, height) * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(buildingData.icon, px + width / 2, py + height / 2);

        // Level badge
        if (building.level > 1) {
          ctx.fillStyle = '#ff9800';
          ctx.beginPath();
          ctx.arc(px + width - 12, py + 12, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fff';
          ctx.font = 'bold 12px Arial';
          ctx.fillText(`${building.level}`, px + width - 12, py + 12);
        }
      }
    });

    // Draw crops
    crops.forEach(crop => {
      const cropData = CROP_DATA[crop.type];
      const px = crop.position.x * TILE_SIZE;
      const py = crop.position.y * TILE_SIZE;

      // Determine stage icon
      const stageIndex = Math.min(
        4,
        Math.floor((crop.growthProgress / 100) * cropData.stages.length)
      );
      const stageIcon = cropData.stages[stageIndex]?.icon || cropData.icon;

      // Draw crop
      ctx.font = `${TILE_SIZE * 0.7}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stageIcon, px + TILE_SIZE / 2, py + TILE_SIZE / 2);

      // Needs water indicator
      if (crop.needsWater) {
        ctx.fillStyle = '#2196f3';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('💧', px + TILE_SIZE - 12, py + 12);
      }

      // Growth progress bar
      if (crop.growthProgress < 100) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(px + 4, py + TILE_SIZE - 8, TILE_SIZE - 8, 4);

        ctx.fillStyle = '#4caf50';
        const progressWidth = ((TILE_SIZE - 8) * crop.growthProgress) / 100;
        ctx.fillRect(px + 4, py + TILE_SIZE - 8, progressWidth, 4);
      }

      // Harvestable indicator
      if (crop.growthStage === 'harvestable') {
        ctx.strokeStyle = '#ffeb3b';
        ctx.lineWidth = 3;
        ctx.strokeRect(px + 2, py + 2, TILE_SIZE - 4, TILE_SIZE - 4);
      }
    });

    // Draw animals
    animals.forEach(animal => {
      const animalData = ANIMAL_DATA[animal.type];
      const px = animal.position.x * TILE_SIZE;
      const py = animal.position.y * TILE_SIZE;

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.ellipse(
        px + TILE_SIZE / 2,
        py + TILE_SIZE - 8,
        TILE_SIZE / 3,
        TILE_SIZE / 6,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Animal icon with bounce animation
      const bounce = Math.sin(Date.now() / 500) * 2;
      ctx.font = `${TILE_SIZE * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        animalData.icon,
        px + TILE_SIZE / 2,
        py + TILE_SIZE / 2 - bounce
      );

      // Hunger indicator
      if (animal.hunger > 70) {
        ctx.fillStyle = '#ff5252';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('😋', px + TILE_SIZE - 10, py + 10);
      }

      // Production ready indicator
      if (animal.productionProgress >= 100) {
        ctx.fillStyle = '#ffeb3b';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('⭐', px + 10, py + 10);
      }

      // Pregnancy indicator
      if (animal.isPregnant) {
        ctx.fillStyle = '#e91e63';
        ctx.font = 'bold 14px Arial';
        ctx.fillText('💗', px + TILE_SIZE / 2, py + 10);
      }

      // Happiness bar
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(px + 4, py + 4, TILE_SIZE - 8, 3);

      const happinessColor = animal.happiness > 70 ? '#4caf50' : animal.happiness > 40 ? '#ff9800' : '#f44336';
      ctx.fillStyle = happinessColor;
      const happinessWidth = ((TILE_SIZE - 8) * animal.happiness) / 100;
      ctx.fillRect(px + 4, py + 4, happinessWidth, 3);
    });

    // Draw workers
    workers.forEach(worker => {
      const px = worker.position.x * TILE_SIZE;
      const py = worker.position.y * TILE_SIZE;

      // Worker icon
      const workerIcon = worker.type === 'farmer' ? '👨‍🌾' : worker.type === 'rancher' ? '👨‍🍳' : worker.type === 'builder' ? '👷' : '🧙‍♂️';

      ctx.font = `${TILE_SIZE * 0.5}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(workerIcon, px + TILE_SIZE / 2, py + TILE_SIZE / 2);

      // Working indicator
      if (worker.isWorking && worker.currentTask) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(px, py + TILE_SIZE - 6, TILE_SIZE, 6);

        ctx.fillStyle = '#2196f3';
        const taskProgress = (TILE_SIZE * worker.currentTask.progress) / 100;
        ctx.fillRect(px, py + TILE_SIZE - 6, taskProgress, 6);
      }
    });

    // Draw selected tool cursor
    if (selectedTool) {
      ctx.save();
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = '#2196f3';
      // This would need mouse position tracking
      ctx.restore();
    }
  }, [tiles, crops, animals, buildings, workers, selectedTool]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    clickTile(x, y);
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-400 to-green-400 rounded-xl overflow-hidden shadow-2xl">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleCanvasClick}
        className="cursor-pointer"
        style={{
          imageRendering: 'pixelated',
          width: '100%',
          height: 'auto',
          maxWidth: '100%'
        }}
      />
    </div>
  );
};
