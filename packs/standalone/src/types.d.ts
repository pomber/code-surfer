type Maybe<T> = T | null | undefined;

declare module "code-surfer-types" {
  export interface InputStep {
    code: string;
    focus?: string;
    title?: { value: string };
    subtitle?: { value: string };
    lang?: string;
  }

  export interface Token {
    type: string;
    content: string;
    focus?: boolean;
    key?: number;
  }

  export interface Line {
    tokens: Token[];
    key: Number;
    focus?: boolean;
    focusPerToken?: boolean;
  }

  export interface Step {
    lines: Line[];
    title?: { value: string };
    subtitle?: { value: string };
    focusCenter: number;
    dimensions?: any;
    longestLineIndex: number;
  }

  type StyleItem = {
    types: string[];
    style: React.CSSProperties;
  };

  type Partial<T> = {
    [P in keyof T]?: T[P];
  };
}

declare module "playhead-types" {
  type Animation<T, R> = (prev: Maybe<T>, next: Maybe<T>, t: number) => R;
  type AnimationConfig<T> = {
    when?: (prev: Maybe<T>, next: Maybe<T>) => boolean;
    stagger?: number;
  };
  type AnimationAndConfig<T, R> = {
    animation: Animation<T, R>;
  } & AnimationConfig<T>;
}

declare module "shell-quote" {
  export function parse(s: string): string[];
}
