type Maybe<T> = T | null | undefined;
interface Flavoring<FlavorT> {
  _type?: FlavorT;
}
type Flavor<T, FlavorT> = T & Flavoring<FlavorT>;

declare module "code-surfer-types" {
  export interface InputStep {
    code: string;
    focus?: string;
    title?: string;
    subtitle?: string;
    lang?: string;
    showNumbers?: boolean;
  }

  type LineKey = Flavor<number, "LineKey">;
  type LineIndex = Flavor<number, "LineIndex">;
  type StepIndex = Flavor<number, "StepIndex">;

  export interface Step {
    lines: LineKey[];
    longestLineIndex: LineIndex;
    focus: Record<LineIndex, true | StepIndex[]>;
    focusCenter: number;
    focusCount: number;
    title?: string;
    subtitle?: string;
    dimensions?: {
      paddingTop: number;
      paddingBottom: number;
    };
  }

  export interface Dimensions {
    lineHeight: number;
    containerHeight: number;
    containerWidth: number;
    contentHeight?: number;
    contentWidth: number;
  }

  type Partial<T> = {
    [P in keyof T]?: T[P];
  };
}

declare module "shell-quote" {
  export function parse(s: string): string[];
}
