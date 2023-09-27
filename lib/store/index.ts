import { fabric } from "fabric";
import { create } from "zustand";
import { StoreTypes } from "../types/store";
import { Element } from "../types/track";
import { tracks } from "../samples/tracks";
import {
  PANEL_SLIDER_MAX_VALUE,
  PANEL_SLIDER_MIN_VALUE,
} from "@/lib/constants/panel";

export const useStore = create<StoreTypes>()((set, get) => ({
  canvas: null,
  setCanvas: (canvas: fabric.Canvas | null) =>
    set((state) => ({ ...state, canvas })),

  // medias
  videos: [],
  images: [],

  // elements
  tracks,
  selectedElement: null,
  addElement: (trackId: string, element: Element) => {
    set((state) => ({
      ...state,
      tracks: get().tracks.map((t) =>
        t.id === trackId
          ? {
              id: t.id,
              name: t.name,
              elements: [...t.elements, element],
            }
          : t
      ),
    }));
  },
  setSelectedElement: (element: Element | null) =>
    set((state) => ({ ...state, selectedElement: element })),

  updateElement: (elementId: string, data: Element | any) =>
    set((state) => ({
      ...state,
      tracks: get().tracks.map((t) => ({
        ...t,
        elements: t.elements.map((element) =>
          element.id === elementId
            ? {
                ...element,
                ...data,
              }
            : element
        ),
      })),
    })),

  // panel properties
  panelScale: 50,
  addPanelScale: (n: number) => {
    if (n < 0) {
      set((state) => ({
        ...state,
        panelScale: Math.max(PANEL_SLIDER_MIN_VALUE, state.panelScale + n),
      }));
    } else {
      set((state) => ({
        ...state,
        panelScale: Math.min(PANEL_SLIDER_MAX_VALUE, state.panelScale + n),
      }));
    }
  },
  setPanelScale: (panelScale: number) =>
    set((state) => ({ ...state, panelScale })),

  playing: false,
  setPlaying: (playing: boolean) => {
    set((state) => ({ ...state, playing }));
  },

  fps: 60,
  maxTime: 30 * 1000,
  setMaxTime: (time: number) => set((state) => ({ ...state, maxTime: time })),

  currentKeyFrame: 0,
  getCurrentTimeInMs: () => (get().currentKeyFrame * 1000) / get().fps,
  setCurrentTimeInMs: (time: number) =>
    set((state) => ({
      ...state,
      currentKeyFrame: Math.floor((time / 1000) * get().fps) + time,
    })),
  rewindCurrentTimeInMs: (time: number, forward: boolean) => {
    const currentKeyFrame = get().currentKeyFrame;
    const fps = get().fps;
    const maxTime = get().maxTime;
    const offset = forward
      ? Math.floor((time / 1000) * fps)
      : -Math.floor((time / 1000) * fps);
    const newTime =
      currentKeyFrame + offset < 0
        ? 0
        : currentKeyFrame + offset >= (maxTime * fps) / 1000
        ? (maxTime * fps) / 1000
        : currentKeyFrame + offset;

    set((state) => ({
      ...state,
      currentKeyFrame: newTime,
    }));
  },
}));