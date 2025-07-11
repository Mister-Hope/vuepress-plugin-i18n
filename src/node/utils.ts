import {
  type App,
  type Page,
  type SiteData,
  // @ts-ignore
  parsePageContent,
} from "vuepress/core";
import { deepAssign, Logger } from "@vuepress/helper";
import pluginLocaleData from "./locales/index.js";
import type { I18nPluginLocaleData } from "../shared/types.js";

export const PLUGIN_NAME = "vuepress-plugin-i18n";

export const insertComponentToPageTop = (
  app: App,
  page: Page,
  componentName: string,
) => {
  const { content, filePath, filePathRelative, frontmatter, path } = page;
  const fmRegExp = /^---$/gm;
  const headRegExp = /^[\r\n]+#\s.+?[\r\n]+/g;
  fmRegExp.exec(content);
  fmRegExp.exec(content);
  let index = fmRegExp.lastIndex ?? 0;
  headRegExp.exec(content.slice(index));
  index += headRegExp.lastIndex;

  if (!content.slice(index).startsWith(`<${componentName} />\n`)) {
    page.content =
      content.slice(0, index) + `<${componentName} />\n` + content.slice(index);
    Object.assign(
      page,
      parsePageContent({
        app,
        content: page.content,
        filePath,
        filePathRelative,
        options: {
          path,
          frontmatter,
          content,
          ...(filePath ? { filePath } : {}),
        },
      }),
    );
  }
};

export const getLocales = (
  siteData: SiteData,
  customLocales: Record<string, Partial<I18nPluginLocaleData>>,
) =>
  Object.fromEntries(
    Object.entries(siteData.locales).map(([path, { lang = siteData.lang }]) => [
      path,
      deepAssign(
        {},
        pluginLocaleData[lang] ??
          pluginLocaleData[siteData.lang] ??
          pluginLocaleData["en-US"]!,
        customLocales[lang],
      ),
    ]),
  ) as Record<string, I18nPluginLocaleData>;

export const insertAfterFrontmatter = (content: string, data: string) => {
  const regexp = /^---$/gm;
  regexp.exec(content);
  regexp.exec(content);
  let index = regexp.lastIndex ?? 0;
  if (content.at(index) === "\r") index++;
  if (content.at(index) === "\n") index++;
  return content.slice(0, index) + data + content.slice(index);
};

export const logger = new Logger(PLUGIN_NAME);
