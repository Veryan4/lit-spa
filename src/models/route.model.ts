import { TemplateResult } from "lit";

export class Route {
  name: string;
  pattern: string | string[];
  component: () => Promise<TemplateResult>;
  guard?: () => Promise<string | boolean | undefined>;
  params?: Record<string, string>;
  data?: any;
}
