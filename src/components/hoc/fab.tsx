'use client';

import { ArrowDown, ArrowUp, Moon, Share2, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { scrollTo } from '@/lib/scroll-to';
import { cn } from '@/lib/utils';

interface FABProps {
  className?: string;
  showThemeToggle?: boolean;
  showShare?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  enableEdgeSnap?: boolean;
  snapDelay?: number;
}

export function FAB({
  className,
  showThemeToggle = false,
  showShare = true,
  position = 'bottom-right',
  enableEdgeSnap = true,
  snapDelay = 500,
}: FABProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(true);
  const [isSnapped, setIsSnapped] = useState(enableEdgeSnap);
  const [isHovering, setIsHovering] = useState(false);

  // 检测当前主题
  useEffect(() => {
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // 检测滚动位置
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const OFFSET = 20;

      // 判断是否在顶部（允许一些误差，比如 20px）
      setShowScrollToTop(scrollTop > OFFSET);

      // 判断是否在底部（允许一些误差，比如 20px）
      setShowScrollToBottom(scrollTop + clientHeight < scrollHeight - OFFSET);
    };

    window.addEventListener('scroll', handleScroll);

    // 初始化时检查一次滚动位置
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 滚动到顶部
  const scrollToTop = async () => {
    setIsExpanded(false);
    await scrollTo({ y: 0, duration: 600 });
  };

  // 滚动到底部
  const scrollToBottom = async () => {
    setIsExpanded(false);
    const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
    await scrollTo({ y: targetPosition, duration: 600 });
  };

  // 分享当前页面
  const shareCurrentPage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log(t('Share cancelled'));
      }
    } else {
      // 降级处理：复制到剪贴板
      try {
        await navigator.clipboard.writeText(window.location.href);
        // 这里可以添加一个 toast 提示
        alert(t('Link copied'));
      } catch (error) {
        console.error(t('Copy failed'), error);
      }
    }
    setIsExpanded(false);
  };

  // 切换主题
  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsExpanded(false);
  };

  // 边缘吸附逻辑
  useEffect(() => {
    if (!enableEdgeSnap) return;

    let timeoutId: NodeJS.Timeout;

    const handleSnap = () => {
      if (!isHovering && !isExpanded) {
        timeoutId = setTimeout(() => {
          setIsSnapped(true);
        }, snapDelay);
      }
    };

    handleSnap();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [enableEdgeSnap, isHovering, isExpanded, snapDelay]);

  // 处理鼠标悬停
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (isSnapped) {
      setIsSnapped(false);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // 获取位置样式
  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4',
    };
    return positions[position];
  };

  // 获取吸附偏移量
  const getSnapTransform = () => {
    if (!enableEdgeSnap || !isSnapped) return '';

    const snapAmount = '75%';

    if (position.includes('right')) {
      return `translateX(${snapAmount})`;
    } else if (position.includes('left')) {
      return `-translateX(${snapAmount})`;
    }
    return '';
  };

  return (
    <div
      className={cn(
        'z-50 fixed flex flex-col items-center gap-3 transition-transform duration-300 ease-out',
        getPositionClasses(),
        className
      )}
      style={{
        transform: getSnapTransform(),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="toolbar"
      aria-label={t('FAB aria label')}
    >
      {/* 功能按钮组 */}
      <div
        className={cn(
          'bottom-16 absolute flex flex-col gap-2 transition-all duration-200 ease-in-out',
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        {/* 返回顶部 */}
        {showScrollToTop && (
          <Button
            variant="secondary"
            size="icon"
            onClick={scrollToTop}
            title={t('Scroll to top')}
            className="bg-background/80 shadow-lg hover:shadow-xl backdrop-blur-sm border rounded-full size-12 hover:scale-110 transition-all duration-200"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        )}

        {/* 返回底部 */}
        {showScrollToBottom && (
          <Button
            variant="secondary"
            size="icon"
            onClick={scrollToBottom}
            title={t('Scroll to bottom')}
            className="bg-background/80 shadow-lg hover:shadow-xl backdrop-blur-sm border rounded-full size-12 hover:scale-110 transition-all duration-200"
          >
            <ArrowDown className="w-5 h-5" />
          </Button>
        )}

        {/* 分享按钮 */}
        {showShare && (
          <Button
            variant="secondary"
            size="icon"
            onClick={shareCurrentPage}
            title={t('Share page')}
            className="bg-background/80 shadow-lg hover:shadow-xl backdrop-blur-sm border rounded-full size-12 hover:scale-110 transition-all duration-200"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        )}

        {/* 主题切换 */}
        {showThemeToggle && (
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleTheme}
            title={isDarkMode ? t('Switch to light mode') : t('Switch to dark mode')}
            className="bg-background/80 shadow-lg hover:shadow-xl backdrop-blur-sm border rounded-full size-12 hover:scale-110 transition-all duration-200"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        )}
      </div>

      {/* 主按钮 */}
      <Button
        variant="default"
        size="icon"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? t('Collapse menu') : t('Expand menu')}
        className="group shadow-lg hover:shadow-xl rounded-full size-14 hover:scale-110 transition-all duration-200"
        aria-pressed={isExpanded}
      >
        <svg
          className="fill-current size-5 pointer-events-none"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            className="group-[[aria-pressed=true]]:rotate-[315deg] origin-center transition-all -translate-y-[5px] translate-x-[7px] group-[[aria-pressed=true]]:translate-x-0 group-[[aria-pressed=true]]:translate-y-0 duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]"
            y="7"
            width="9"
            height="2"
            rx="1"
          />
          <rect
            className="group-[[aria-pressed=true]]:rotate-45 origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)]"
            y="7"
            width="16"
            height="2"
            rx="1"
          />
          <rect
            className="group-[[aria-pressed=true]]:rotate-[135deg] origin-center transition-all translate-y-[5px] group-[[aria-pressed=true]]:translate-y-0 duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)]"
            y="7"
            width="9"
            height="2"
            rx="1"
          />
        </svg>
      </Button>
    </div>
  );
}
