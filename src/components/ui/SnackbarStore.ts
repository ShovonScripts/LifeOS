import { create } from 'zustand';

export interface SnackbarState {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  duration?: number;
  show: (params: Omit<SnackbarState, 'visible' | 'show' | 'hide'>) => void;
  hide: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
  visible: false,
  message: '',
  show: ({ message, actionLabel, onAction, duration = 5000 }) =>
    set({ visible: true, message, actionLabel, onAction, duration }),
  hide: () => set({ visible: false }),
}));
