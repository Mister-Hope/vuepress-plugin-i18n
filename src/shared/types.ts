import type { Page as _Page, PageData as _PageData } from "vuepress/core";
import type { GitData } from "@vuepress/plugin-git";

/**
 * Link rendering helper
 * @param text link text
 * @param href target URL
 * @returns html string
 */
type LinkRenderer = (text: string, href: string) => string;

interface I18nPluginLocaleData {
  /**
   * @description RFC5646 Language code
   * @example "en-US", "zh-CN"
   */
  lang: string;
  untranslated: {
    /**
     * @description Title of untranslated page tip
     */
    title: string;
    /**
     * Content of the container
     * @param linkRenderer link rendering helper
     * @param translationGuide links to translation guides (ignore the relevant section when empty)
     * @returns localized text
     */
    content: (linkRenderer: LinkRenderer, translationGuide?: string) => string;
  };
  outdated: {
    /**
     * @description Title of obsolete page tip
     */
    title: string;
    /**
     * Content of the container
     * @param linkRenderer link rendering helper
     * @param sourceUpdateTime unix timestamp for source page
     * @param translationUpdateTime unix timestamp for translation page
     * @param sourceLink url of the source page
     * @returns localized text
     */
    content: (
      linkRenderer: LinkRenderer,
      sourceUpdateTime: number,
      translationUpdateTime: number,
      sourceLink: string,
    ) => string;
  };
}

interface I18nPluginFrontmatter extends Record<string, unknown> {
  _i18n?: {
    filePathRelative?: string;
    pathLocale?: string;
    untranslated?: boolean;
  };
  gitInclude?: string[];
  tag?: string[];
}

interface I18nPageData {
  pathLocale?: string;
  outdated?: boolean;
  sourceLink?: string;
  sourceUpdatedTime?: number;
  untranslated?: boolean;
  updatedTime?: number | undefined;
}

interface I18nPluginPageData extends Record<string, unknown> {
  i18n?: I18nPageData;
  /** maybe added by @vuepress/plugin-git */
  git?: GitData;
}

interface I18nData {
  isOutdated: boolean;
  isUntranslated: boolean;
  locale: I18nPluginLocaleData;
  options: {
    baseLocalePath: string;
    containerClass: string[];
    titleClass: string[];
  };
  pathLocale: string;
  sourceLink: string | undefined;
  sourceUpdatedTime: number | undefined;
  translationGuide: string | undefined;
  updatedTime: number | undefined;
}

type Page = _Page<I18nPluginPageData, I18nPluginFrontmatter>;
type PageData = _PageData<I18nPluginPageData>;

export type {
  I18nData,
  I18nPluginFrontmatter,
  I18nPageData,
  I18nPluginLocaleData,
  I18nPluginPageData,
  LinkRenderer,
  Page,
  PageData,
};
