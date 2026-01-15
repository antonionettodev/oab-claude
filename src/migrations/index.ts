import * as migration_20260113_180642 from './20260113_180642';

export const migrations = [
  {
    up: migration_20260113_180642.up,
    down: migration_20260113_180642.down,
    name: '20260113_180642'
  },
];
