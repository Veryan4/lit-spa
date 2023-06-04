import { LitElement, html } from "lit";
import {
  customElement,
  property,
  query,
  queryAsync,
  state,
} from "lit/decorators.js";
import { classMap } from "lit-html/directives/class-map.js";
import { styleMap } from "lit-html/directives/style-map.js";
import { styles } from "./tooltip.styles";

export type TooltipPosition = "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | string;
export type TooltipStrategy = "absolute" | "fixed";
export type TooltipMode = "hover" | "click";

@customElement("lit-spa-tooltip")
export class ToolTipComponent extends LitElement {
  static styles = [styles];

  @query("#reference")
  referenceElement: HTMLElement;

  @queryAsync("#floating")
  floatingElement: Promise<HTMLElement>;

  @property({ type: String })
  text: string;

  @property({ type: String })
  position: TooltipPosition;

  @property({ type: String })
  strategy: TooltipStrategy = "absolute";

  @property({ type: String })
  mode: TooltipMode = "hover";

  @property({ type: Number })
  offsetX = 0;

  @property({ type: Number })
  offsetY = 0;

  @property({ type: Number })
  positionX?: number;

  @property({ type: Number })
  positionY?: number;

  @state()
  isOpen = false;

  constructor() {
    super();
  }

  render() {
    return html` 
    <div
        id="reference"
        class="${classMap({ default: this.text })}"
        @click=${this.openFloating}
      >
        ${this.text
          ? html`<slot></slot>`
          : html`<slot name="reference"></slot>`}
      </div>
      <div
        id="floating"
        class="${classMap({ default: this.text, open: this.isOpen })}"
        style="${styleMap({ position: this.strategy })}"
      >
        ${this.text
          ? html`<span class="tooltip-text">${this.text}</span>`
          : html`<slot name="floating"></slot>`}
      </div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.mode == "click") {
      window.addEventListener("click", (e) => this._clickEventHandler(e));
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.mode == "click") {
      window.removeEventListener("click", (e) => this._clickEventHandler(e));
    }
  }

  async _clickEventHandler(e: any) {
    const floating = await this.floatingElement;
    const targets = e.composedPath();
    if (
      !targets.some((target: any) => {
        if (target instanceof Node) {
          return floating.contains(target);
        }
        return false;
      }) &&
      this.isOpen
    ) {
      this.isOpen = false;
    }
  }

  openFloating() {
    setTimeout(() => {
      if (this.mode == "click") {
        this.isOpen = true;
        this.assignFloatingPosition();
      }
    });
  }

  async assignFloatingPosition() {
    const floating = await this.floatingElement;
    const placements = this.position.split(" ");
    for (const placement of placements) {
      const position = this.computePosition(
        this.referenceElement,
        floating,
        placement,
        this.strategy
      );
      const x = this.positionX ?? position.x + this.offsetX;
      const y = this.positionY ?? position.y + this.offsetY;
      Object.assign(floating.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
      if (!this.isOutOfBounds(floating)) {
        this.requestUpdate();
        break;
      }
    }
  }

  computePosition(
    reference: HTMLElement,
    floating: HTMLElement,
    placement = "bottom",
    strategy = "absolute"
  ) {
    const isRTL = getComputedStyle(floating).direction === "rtl";
    const rects = this.getElementRects(reference, floating, strategy);
    const { x, y } = this.computeCoordsFromPlacement(rects, placement, isRTL);

    return {
      x,
      y,
    };
  }

  computeCoordsFromPlacement(
    rects: {
      [key: string]: { width: number; height: number; x: number; y: number };
    },
    placement: string,
    rtl?: boolean
  ): { x: number; y: number } {
    const { reference, floating } = rects;
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const side = placement.split("-")[0];
    const alignment = placement.split("-")[1];
    const mainAxis = ["top", "bottom"].includes(side) ? "x" : "y";
    const length = mainAxis === "y" ? "height" : "width";
    const commonAlign = reference[length] / 2 - floating[length] / 2;
    const isVertical = mainAxis === "x";

    let coords;
    switch (side) {
      case "top":
        coords = { x: commonX, y: reference.y - floating.height };
        break;
      case "bottom":
        coords = { x: commonX, y: reference.y + reference.height };
        break;
      case "right":
        coords = { x: reference.x + reference.width, y: commonY };
        break;
      case "left":
        coords = { x: reference.x - floating.width, y: commonY };
        break;
      default:
        coords = { x: reference.x, y: reference.y };
    }

    switch (alignment) {
      case "start":
        coords[mainAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[mainAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      default:
    }

    return coords;
  }

  getElementRects(
    reference: HTMLElement,
    floating: HTMLElement,
    strategy: string
  ) {
    return {
      reference: this.getRectRelativeToOffsetParent(
        reference,
        floating.offsetParent as HTMLElement,
        strategy
      ),
      floating: {
        width: floating.offsetWidth,
        height: floating.offsetHeight,
        x: 0,
        y: 0,
      },
    };
  }

  getRectRelativeToOffsetParent(
    element: HTMLElement,
    offsetParent: HTMLElement,
    strategy: string
  ) {
    const rect = this.getElementsBoundingClientRect(
      element,
      this.isScaled(offsetParent),
      strategy === "fixed"
    );

    const offsets = { x: 0, y: 0 };
    const offsetRect = this.getElementsBoundingClientRect(offsetParent, true);
    offsets.x = offsetRect.x + offsetParent.clientLeft;
    offsets.y = offsetRect.y + offsetParent.clientTop;

    return {
      x: rect.left + offsetParent.scrollLeft - offsets.x,
      y: rect.top + offsetParent.scrollTop - offsets.y,
      width: rect.width,
      height: rect.height,
    };
  }

  getElementsBoundingClientRect(
    element: HTMLElement,
    includeScale = false,
    isFixedStrategy = false
  ) {
    const clientRect = element.getBoundingClientRect();

    let scaleX = 1;
    let scaleY = 1;

    if (includeScale) {
      scaleX =
        element.offsetWidth > 0
          ? Math.round(clientRect.width) / element.offsetWidth || 1
          : 1;
      scaleY =
        element.offsetHeight > 0
          ? Math.round(clientRect.height) / element.offsetHeight || 1
          : 1;
    }

    const addVisualOffsets = !this.isLayoutViewport() && isFixedStrategy;
    const x =
      (clientRect.left +
        (addVisualOffsets ? window.visualViewport?.offsetLeft ?? 0 : 0)) /
      scaleX;
    const y =
      (clientRect.top +
        (addVisualOffsets ? window.visualViewport?.offsetTop ?? 0 : 0)) /
      scaleY;
    const width = clientRect.width / scaleX;
    const height = clientRect.height / scaleY;

    return {
      width,
      height,
      top: y,
      right: x + width,
      bottom: y + height,
      left: x,
      x,
      y,
    };
  }

  isScaled(element: HTMLElement): boolean {
    const rect = this.getElementsBoundingClientRect(element);
    return (
      Math.round(rect.width) !== element.offsetWidth ||
      Math.round(rect.height) !== element.offsetHeight
    );
  }

  isLayoutViewport(): boolean {
    // Not Safari
    return !/^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  isOverflowElement(element: HTMLElement): boolean {
    // Firefox wants us to check `-x` and `-y` variations as well
    const { overflow, overflowX, overflowY, display } =
      getComputedStyle(element);
    return (
      /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX) &&
      !["inline", "contents"].includes(display)
    );
  }

  isOverflown(element: HTMLElement): boolean {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
  }

  isOutOfBounds(element: HTMLElement): boolean {
    const rects = element.getBoundingClientRect();
    return (
      rects.x < 0 || rects.y < 0 ||
      rects.x + rects.width > window.innerWidth ||
      rects.y + rects.height > window.innerHeight 
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "lit-spa-tooltip": ToolTipComponent;
  }
}
