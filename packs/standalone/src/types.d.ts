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
    xFocus: true | number[];
    xTokens: string[];
    xTypes: string[];
  }

  export interface Step {
    lines: Line[];
    title?: { value: string };
    subtitle?: { value: string };
    focusCenter: number;
    focusCount: number;
    dimensions?: any;
    longestLineIndex: number;
    xLines: number[];
    xFocus: Record<number, true | number[]>;
    xTypes: string[][];
    xTokens: string[][];
  }

  type StyleItem = {
    types: string[];
    style: React.CSSProperties;
  };

  type Partial<T> = {
    [P in keyof T]?: T[P];
  };
}

declare module "shell-quote" {
  export function parse(s: string): string[];
}
