export class Toast {
  type?: "success" | "error";
  duration = 3000;
  text: string;
  properties?: Record<string, string | number>;
  styleInfo?: Record<string, string | number>;
}
