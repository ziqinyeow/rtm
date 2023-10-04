export type ElementType = "video" | "image" | "text" | "shape" | "pose";
export type Shape = fabric.Rect | fabric.Polyline | fabric.Triangle;
export type ShapeType = "square" | "triangle" | "polygon";
export type Placement = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
};
export type Timeframe = { start: number; duration: number };

export type ElementBase<Type extends ElementType, Properties> = {
  id: string;
  type: Type;
  name: string;
  fabricObject?: fabric.Object;
  placement: Placement;
  timeframe: Timeframe;
  properties: Properties;
};

export type VideoElement = ElementBase<
  "video",
  { src: string; elementId: string; imageObject?: fabric.Image }
>;

export type ImageElement = ElementBase<
  "image",
  { src: string; elementId: string; imageObject?: fabric.Object }
>;

export type TextElement = ElementBase<
  "text",
  {
    text: string;
    fontSize: number;
    fontWeight: number;
    splittedTexts: fabric.Text[];
  }
>;

export type ShapeElement = ElementBase<
  "shape",
  {
    type: ShapeType;
    coords?: [];
  }
>;

export type PoseElement = ElementBase<
  "pose",
  {
    shape?: string;
    coords?: [];
  }
>;

export type Element =
  | VideoElement
  | ImageElement
  | TextElement
  | ShapeElement
  | PoseElement;

export type Tracks = {
  id: string;
  name: string;
  elements: Element[];
};
