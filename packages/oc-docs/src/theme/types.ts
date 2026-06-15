export type ThemeMode = 'light' | 'dark';

export interface Theme {
  mode: ThemeMode;
  brand: string;
  text: string;
  textLink: string;
  draftColor: string;
  bg: string;
  primary: Record<string, string>;
  background: Record<string, string>;
  status: Record<string, { background: string; text: string; border: string }>;
  font: { size: Record<string, string> };
  border: { radius: Record<string, string>; [k: string]: unknown };
  colors: { text: Record<string, string>; [k: string]: unknown };
  input: Record<string, unknown>;
  sidebar: Record<string, unknown>;
  request: { methods: Record<string, string>; [k: string]: unknown };
  codemirror: Record<string, unknown>;
  table: Record<string, unknown>;
  [section: string]: unknown;
}
