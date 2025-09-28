interface ScrollToOptions {
  x?: number;
  y?: number;
  duration?: number;
  easing?: (t: number) => number;
}

/**
 * 自定义滚动到指定位置的函数
 * @param options 滚动选项
 * @param options.x 目标 x 坐标，不传则保持当前位置
 * @param options.y 目标 y 坐标，不传则保持当前位置
 * @param options.duration 滚动持续时间 (毫秒)，默认 500ms
 * @param options.easing 缓动函数，默认 easeInOutQuad
 */
export function scrollTo(options: ScrollToOptions): Promise<void>;
/**
 * 自定义滚动到指定位置的函数 (兼容旧版本)
 * @param target 目标 y 位置 (number) 或目标元素 (Element)
 * @param duration 滚动持续时间 (毫秒)，默认 500ms
 * @param easing 缓动函数，默认 easeInOutQuad
 */
export function scrollTo(
  target: number | Element,
  duration?: number,
  easing?: (t: number) => number
): Promise<void>;
export function scrollTo(
  optionsOrTarget: ScrollToOptions | number | Element,
  duration: number = 500,
  easing: (t: number) => number = easeInOutQuad
): Promise<void> {
  return new Promise((resolve) => {
    const startX = window.pageXOffset;
    const startY = window.pageYOffset;

    let targetX: number;
    let targetY: number;
    let actualDuration: number;
    let actualEasing: (t: number) => number;

    // 处理不同的参数格式
    if (typeof optionsOrTarget === 'object' && !('getBoundingClientRect' in optionsOrTarget)) {
      // 新的 options 格式
      const options = optionsOrTarget as ScrollToOptions;
      targetX = options.x ?? startX;
      targetY = options.y ?? startY;
      actualDuration = options.duration ?? 500;
      actualEasing = options.easing ?? easeInOutQuad;
    } else {
      // 兼容旧版本格式
      targetX = startX; // 保持当前 x 位置
      actualDuration = duration;
      actualEasing = easing;

      if (typeof optionsOrTarget === 'number') {
        targetY = optionsOrTarget;
      } else {
        const rect = optionsOrTarget.getBoundingClientRect();
        targetY = rect.top + window.pageYOffset;
      }
    }

    const distanceX = targetX - startX;
    const distanceY = targetY - startY;
    let startTime: number | null = null;

    function animation(currentTime: number) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / actualDuration, 1);

      const easedProgress = actualEasing(progress);
      const currentX = startX + distanceX * easedProgress;
      const currentY = startY + distanceY * easedProgress;

      window.scrollTo(currentX, currentY);

      if (progress < 1) {
        requestAnimationFrame(animation);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(animation);
  });
}

/**
 * 滚动到顶部
 * @param duration 滚动持续时间 (毫秒)，默认 500ms
 */
export function scrollToTop(duration: number = 500): Promise<void> {
  return scrollTo({ y: 0, duration });
}

/**
 * 滚动到底部
 * @param duration 滚动持续时间 (毫秒)，默认 500ms
 */
export function scrollToBottom(duration: number = 500): Promise<void> {
  const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
  return scrollTo({ y: targetPosition, duration });
}

/**
 * 滚动到指定元素
 * @param element 目标元素
 * @param duration 滚动持续时间 (毫秒)，默认 500ms
 * @param offsetX x 轴偏移量，默认 0
 * @param offsetY y 轴偏移量，默认 0
 */
export function scrollToElement(
  element: Element,
  duration: number = 500,
  offsetX: number = 0,
  offsetY: number = 0
): Promise<void> {
  const rect = element.getBoundingClientRect();
  const targetX = rect.left + window.pageXOffset + offsetX;
  const targetY = rect.top + window.pageYOffset + offsetY;
  return scrollTo({ x: targetX, y: targetY, duration });
}

/**
 * 滚动到指定坐标
 * @param x 目标 x 坐标
 * @param y 目标 y 坐标
 * @param duration 滚动持续时间 (毫秒)，默认 500ms
 * @param easing 缓动函数，默认 easeInOutQuad
 */
export function scrollToPosition(
  x: number,
  y: number,
  duration: number = 500,
  easing: (t: number) => number = easeInOutQuad
): Promise<void> {
  return scrollTo({ x, y, duration, easing });
}

// 缓动函数
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

export function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4;
}
