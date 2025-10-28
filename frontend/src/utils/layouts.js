import { Maximize2, Grid2x2, Grid3x3 } from 'lucide-react';

export const LAYOUTS = {
  BLANK: { id: 'blank', name: 'Blank Page', icon: Maximize2, slots: 0, positions: [] },
  FULL_BLEED: { id: 'full_bleed', name: 'Full Bleed', icon: Maximize2, slots: 1, positions: [{x: 0, y: 0, w: 1, h: 1}] },
  CENTERED: { id: 'centered', name: 'Centered', icon: Maximize2, slots: 1, positions: [{x: 0.1, y: 0.1, w: 0.8, h: 0.8}] },
  TWO_HORIZONTAL: { id: 'two_horizontal', name: '2 Horizontal', icon: Grid2x2, slots: 2, positions: [{x: 0, y: 0, w: 0.5, h: 1}, {x: 0.5, y: 0, w: 0.5, h: 1}] },
  TWO_VERTICAL: { id: 'two_vertical', name: '2 Vertical', icon: Grid2x2, slots: 2, positions: [{x: 0, y: 0, w: 1, h: 0.5}, {x: 0, y: 0.5, w: 1, h: 0.5}] },
  THREE_VERTICAL: { id: 'three_vertical', name: '3 Vertical', icon: Grid3x3, slots: 3, positions: [{x: 0, y: 0, w: 1, h: 0.33}, {x: 0, y: 0.33, w: 1, h: 0.34}, {x: 0, y: 0.67, w: 1, h: 0.33}] },
  THREE_GRID: { id: 'three_grid', name: '3 Grid', icon: Grid3x3, slots: 3, positions: [{x: 0, y: 0, w: 1, h: 0.5}, {x: 0, y: 0.5, w: 0.5, h: 0.5}, {x: 0.5, y: 0.5, w: 0.5, h: 0.5}] },
  FOUR_GRID: { id: 'four_grid', name: '4 Grid', icon: Grid3x3, slots: 4, positions: [{x: 0, y: 0, w: 0.5, h: 0.5}, {x: 0.5, y: 0, w: 0.5, h: 0.5}, {x: 0, y: 0.5, w: 0.5, h: 0.5}, {x: 0.5, y: 0.5, w: 0.5, h: 0.5}] },
  SIX_GRID: { id: 'six_grid', name: '6 Grid', icon: Grid3x3, slots: 6, positions: [{x: 0, y: 0, w: 0.33, h: 0.5}, {x: 0.33, y: 0, w: 0.34, h: 0.5}, {x: 0.67, y: 0, w: 0.33, h: 0.5}, {x: 0, y: 0.5, w: 0.33, h: 0.5}, {x: 0.33, y: 0.5, w: 0.34, h: 0.5}, {x: 0.67, y: 0.5, w: 0.33, h: 0.5}] }
};