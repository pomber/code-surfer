declare module "code-surfer-types" {
  export interface InputStep {
    code: string;
    focus?: string;
    title?: string;
    subtitle?: string;
    lang?: string;
  }

  export interface Token {
    type: string;
    content: string;
    focus: boolean;
  }

  export interface Line {
    tokens: Token[];
    key: Number;
    focus: boolean;
  }

  export interface Step {
    lines: Line[];
    title?: string;
    subtitle?: string;
  }
}

declare module "shell-quote" {
  export function parse(s: string): string[];
}
