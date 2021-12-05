import { FC, MouseEventHandler, useEffect, useRef } from 'react';
import { Coordinate, CoordinateSet } from '../utils/getNextGeneration';

const GRID_COLOR = '#999999';
const CELL_COLOR = '#0bf58e';
const GRID_THICKNESS = 1;

export type Props = {
  readonly generation: CoordinateSet;
  readonly configWidth: number;
  readonly configHeight: number;
  readonly canvasWidth: number;
  readonly canvasHeight?: number;
  readonly showGrid?: boolean;
  readonly onCellClick?: (coord: Coordinate) => void;
};

const Canvas: FC<Props> = (props) => {
  const {
    generation,
    configWidth,
    configHeight,
    canvasWidth,
    canvasHeight = (canvasWidth * configHeight) / configWidth,
    showGrid = false,
    onCellClick,
  } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gameRatio = configWidth / configHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  const scale = canvasRatio > gameRatio ? canvasHeight / configHeight : canvasWidth / configWidth;
  const transX = canvasRatio > gameRatio ? (canvasWidth - scale * configWidth) / 2 : 0;
  const transY = canvasRatio > gameRatio ? 0 : (canvasHeight - scale * configHeight) / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }

    const ctx = canvas.getContext('2d');
    assertNonNull(ctx, 'Could not get 2D rendering context');
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = CELL_COLOR;

    if (showGrid) {
      ctx.strokeStyle = GRID_COLOR;
      ctx.lineWidth = GRID_THICKNESS;
      ctx.beginPath();

      for (let i = 1; i < configWidth; i++) {
        ctx.moveTo(i * scale + transX, transY);
        ctx.lineTo(i * scale + transX, canvasHeight - transY);
      }

      for (let i = 1; i < configHeight; i++) {
        ctx.moveTo(transX, i * scale + transY);
        ctx.lineTo(canvasWidth - transX, i * scale + transY);
      }

      ctx.stroke();
    }

    for (const [x, y] of generation) {
      ctx.fillRect(x * scale + transX, y * scale + transY, scale, scale);
    }
  }, [generation, canvasWidth, canvasHeight, showGrid, canvasRef.current]);

  const handleClick: MouseEventHandler = ({ nativeEvent }) => {
    const cellX = Math.floor((nativeEvent.offsetX - transX) / scale);
    const cellY = Math.floor((nativeEvent.offsetY - transY) / scale);
    onCellClick?.([cellX, cellY]);
  };

  return <canvas width={canvasWidth} height={canvasHeight} ref={canvasRef} onClick={handleClick} />;
};

function assertNonNull<T>(value: T | null, message: string): asserts value is T {
  if (value == null) {
    throw new Error(message);
  }
}

export default Canvas;
