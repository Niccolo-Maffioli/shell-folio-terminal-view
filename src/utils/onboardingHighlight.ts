export interface SpotlightHighlight {
  x: number;
  y: number;
  radius: number;
  width: number;
  height: number;
  shape: "circle" | "rounded";
}

interface SpotlightPadding {
  horizontal: number;
  vertical: number;
}

interface SpotlightFallbackRadius {
  circle: number;
  rounded: number;
}

interface SpotlightComputeOptions {
  step: number;
  toggleSelector: string;
  focusSelector: string;
  circlePadding: number;
  roundedPadding: SpotlightPadding;
  fallbackRadius: SpotlightFallbackRadius;
}

interface SpotlightCacheEntry {
  key: string;
  highlight: SpotlightHighlight;
}

const formatRectKey = (rect: DOMRect) =>
  [rect.left, rect.top, rect.width, rect.height]
    .map((value) => value.toFixed(2))
    .join("|");

const createCircleHighlight = (
  rect: DOMRect,
  padding: number
): SpotlightHighlight => {
  const radius = Math.max(rect.width, rect.height) / 2 + padding;
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    radius,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2,
    shape: "circle",
  };
};

const createRoundedHighlight = (
  rect: DOMRect,
  padding: SpotlightPadding
): SpotlightHighlight => {
  const width = rect.width + padding.horizontal * 2;
  const height = rect.height + padding.vertical * 2;
  const radius = Math.max(width, height) / 2;
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
    radius,
    width,
    height,
    shape: "rounded",
  };
};

const createFallbackHighlight = (
  step: number,
  fallbackRadius: SpotlightFallbackRadius,
  viewportWidth: number,
  viewportHeight: number
): SpotlightHighlight => {
  const radius = step === 1 ? fallbackRadius.circle : fallbackRadius.rounded;
  return {
    x: viewportWidth / 2,
    y: viewportHeight / 2,
    radius,
    width: radius * 2,
    height: radius * 2,
    shape: step === 1 ? "circle" : "rounded",
  };
};

export const createSpotlightCalculator = () => {
  let cache: SpotlightCacheEntry | null = null;

  const compute = ({
    step,
    toggleSelector,
    focusSelector,
    circlePadding,
    roundedPadding,
    fallbackRadius,
  }: SpotlightComputeOptions): SpotlightHighlight | null => {
    if (typeof window === "undefined") {
      return null;
    }

    const target = (step === 1
      ? document.querySelector(toggleSelector)
      : document.querySelector(focusSelector)) as HTMLElement | null;

    const viewportKey = `${window.innerWidth.toFixed(2)}|${window.innerHeight.toFixed(2)}`;

    if (target) {
      const rect = target.getBoundingClientRect();
      const key = `${step}|${formatRectKey(rect)}|${viewportKey}`;

      if (cache && cache.key === key) {
        return cache.highlight;
      }

      const highlight =
        step === 1
          ? createCircleHighlight(rect, circlePadding)
          : createRoundedHighlight(rect, roundedPadding);

      cache = { key, highlight };
      return highlight;
    }

    const fallbackKey = `fallback|${step}|${viewportKey}`;

    if (cache && cache.key === fallbackKey) {
      return cache.highlight;
    }

    const fallbackHighlight = createFallbackHighlight(
      step,
      fallbackRadius,
      window.innerWidth,
      window.innerHeight
    );

    cache = { key: fallbackKey, highlight: fallbackHighlight };
    return fallbackHighlight;
  };

  return { compute };
};
