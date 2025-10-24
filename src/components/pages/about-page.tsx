/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  type AboutConfig,
  type AboutSection,
  type HeroSection as HeroSectionType,
  type ListSection as ListSectionType,
  type SkillsSection as SkillsSectionType,
  type SocialLinksSection as SocialsSectionType,
  type TextSection as TextSectionType,
  type TimelineSection as TimelineSectionType,
} from '@/config';

const renderMarkdown = (props: { content: string | string[] }) => {
  const paragraphs = (Array.isArray(props.content) ? props.content : [props.content]).join('\n\n');
  return <Markdown>{paragraphs}</Markdown>;
};

const HeroSection = ({ section }: { section: HeroSectionType }) => (
  <div className="mb-12">
    <h1 className="mb-4 font-bold text-foreground text-4xl text-balance">{section.title}</h1>
    <div className="text-muted-foreground text-lg text-pretty leading-relaxed">
      {renderMarkdown({ content: section.content })}
    </div>
  </div>
);

const TextSection = ({ section }: { section: TextSectionType }) => (
  <section className="mb-12">
    <h2 className="mb-4 font-semibold text-foreground text-2xl">{section.title}</h2>
    <div className="space-y-4 text-foreground leading-relaxed">
      {renderMarkdown({ content: section.content })}
    </div>
  </section>
);

const SkillsSection = ({ section }: { section: SkillsSectionType }) => {
  const skillCategories = section.content;

  return (
    <section className="mb-12">
      <h2 className="mb-6 font-semibold text-foreground text-2xl">{section.title}</h2>
      <div className="gap-6 grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))]">
        {skillCategories.map((item, index) => {
          const categoryIcon = renderIcon(item.icon || item.category);

          return (
            <Card key={index} className="bg-background shadow-none p-6">
              <div className="flex items-center gap-3">
                {categoryIcon && (
                  <div className="flex flex-shrink-0 justify-center items-center bg-primary/10 rounded-lg w-10 h-10">
                    {categoryIcon}
                  </div>
                )}
                <h3 className="font-semibold text-foreground break-all">{item.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, idx) => {
                  const isSkillObject = typeof skill === 'object' && skill !== null;
                  const skillName = isSkillObject ? skill.name : skill;
                  const skillIcon = isSkillObject ? skill.icon : undefined;

                  return (
                    <Badge key={idx} variant="secondary" className="gap-1.5">
                      {skillIcon && (
                        <span className="inline-flex flex-shrink-0 w-3.5 h-3.5">
                          {renderIcon(skillIcon, 'w-3.5 h-3.5')}
                        </span>
                      )}
                      {skillName}
                    </Badge>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

const ListSection = ({ section }: { section: ListSectionType }) => {
  const items = section.content;

  return (
    <section className="mb-12">
      <h2 className="mb-4 font-semibold text-foreground text-2xl">{section.title}</h2>
      <ul className="space-y-2 list-disc list-inside">
        {items.map((item, index) => (
          <li key={index}>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

const TimelineSection = ({ section }: { section: TimelineSectionType }) => {
  return (
    <section className="mb-12">
      <h2 className="mb-6 font-semibold text-foreground text-2xl">{section.title}</h2>
      <div className="space-y-8">
        {section.content.map((item, index) => (
          <div key={index} className="pl-6 border-border border-l-2">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground text-sm">
              <span>{item.period}</span>
            </div>
            <h3 className="mb-2 font-semibold text-foreground text-lg">{item.title}</h3>
            <div className="mb-3 text-muted-foreground">
              {typeof item.company === 'string' ? (
                <p>{item.company}</p>
              ) : (
                <div className="flex items-center gap-2">
                  {item.company.icon && (
                    <span className="inline-flex flex-shrink-0 w-4 h-4">
                      {renderIcon(item.company.icon, 'w-4 h-4')}
                    </span>
                  )}
                  <p>{item.company.name}</p>
                </div>
              )}
            </div>
            <div className="space-y-2 text-foreground leading-relaxed">
              {renderMarkdown({
                content: item.description,
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const SocialsSection = ({ section }: { section: SocialsSectionType }) => {
  return (
    <section className="mb-12">
      <div className="bg-gradient-to-br from-primary/5 to-accent/10 p-8 md:p-12 rounded-2xl text-center">
        <h2 className="mb-4 font-semibold text-foreground text-2xl">{section.title}</h2>
        {section.description && (
          <div className="space-y-2 mx-auto mb-12 max-w-2xl text-muted-foreground">
            {renderMarkdown({
              content: section.description,
            })}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {section.content.map((link, index) => {
            const iconClass = getIconForSocial(link.icon);
            return (
              <Button key={index} variant="outline" size="sm" className="gap-2" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <span className={`${iconClass}`} />
                  {link.name}
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const SectionComponent = ({ section }: { section: AboutSection }) => {
  return (
    <>
      {section.type === 'hero' && <HeroSection section={section} />}
      {section.type === 'text' && <TextSection section={section} />}
      {section.type === 'skills' && <SkillsSection section={section} />}
      {section.type === 'list' && <ListSection section={section} />}
      {section.type === 'timeline' && <TimelineSection section={section} />}
      {section.type === 'social' && <SocialsSection section={section} />}
      {section.type === 'separator' && <Separator className="my-12" />}
    </>
  );
};

// 辅助函数：渲染图标（支持 Iconify 图标和自定义 URL）
const renderIcon = (icon: string, className: string = 'w-5 h-5 text-primary') => {
  // 检查是否为 Iconify 图标（icon-[...] 格式）
  if (icon.startsWith('icon-[')) {
    return <span className={`${icon} ${className}`} />;
  }

  // 检查是否为自定义图片 URL（包括 data: URL 和 http(s): URL）
  if (icon.startsWith('url(') || icon.startsWith('data:') || icon.startsWith('http')) {
    const imageUrl = icon.startsWith('url(') ? icon : `url("${icon}")`;

    // 检查是否为 SVG（data:image/svg 或 .svg 结尾）
    const isSvg = icon.includes('data:image/svg');

    if (isSvg) {
      // SVG 使用 mask-image 跟随字体颜色
      return (
        <span
          className={`inline-flex bg-current [mask-size:contain] [mask-repeat:no-repeat] [mask-position:center] [-webkit-mask-size:contain] [-webkit-mask-repeat:no-repeat] [-webkit-mask-position:center] ${className}`}
          style={{
            maskImage: imageUrl,
            WebkitMaskImage: imageUrl,
          }}
        />
      );
    }

    // 其他格式使用 background-image 保持原色
    return (
      <span
        className={`inline-flex bg-contain bg-no-repeat bg-center ${className}`}
        style={{
          backgroundImage: imageUrl,
        }}
      />
    );
  }

  // 默认返回 null（不显示图标）
  return null;
};

// 辅助函数：根据图标名称返回对应的 Iconify 图标类名
const getIconForSocial = (iconName: string) => {
  const iconMap: Record<string, string> = {
    Github: 'icon-[tabler--brand-github]',
    Linkedin: 'icon-[tabler--brand-linkedin]',
    Twitter: 'icon-[tabler--brand-twitter]',
    Instagram: 'icon-[tabler--brand-instagram]',
    Facebook: 'icon-[tabler--brand-facebook]',
    Youtube: 'icon-[tabler--brand-youtube]',
    Mail: 'icon-[tabler--mail]',
    Globe: 'icon-[tabler--world]',
  };

  return iconMap[iconName] || 'icon-[tabler--world]';
};

export const AboutPage = ({ about }: { about: AboutConfig }) => {
  const { t } = useTranslation();
  const renderContent = () => {
    if (!about || about.length === 0) {
      return (
        <div className="mb-12">
          <h1 className="mb-4 font-bold text-foreground text-4xl text-balance">{t('About')}</h1>
          <p className="text-muted-foreground text-lg text-pretty leading-relaxed">
            {t('Welcome to my about page.')}
          </p>
        </div>
      );
    }

    return about.map((section, index) => (
      <SectionComponent key={`${section.type}-${index}`} section={section} />
    ));
  };

  return <div className="mx-auto p-6 max-w-4xl">{renderContent()}</div>;
};
