import type { Page } from "@vuepress/core";
import type { I18nPluginLocaleData } from "../shared/types";

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

interface I18nPluginTipOptions {
  /**
   * Enable tip containers
   * @default true
   */
  enable: boolean;
  /**
   * Classes of the container div (type of container will always be add)
   * @default ["custom-container", "hint-container"]
   */
  containerClass: string[];
  /**
   * Classes of the container title
   * @default ["custom-container-title", "hint-container-title"]
   */
  titleClass: string[];
}
interface I18nPluginInternalOptions {
  /**
   * Tip container options
   * @see I18nPluginTipOptions
   */
  tip: I18nPluginTipOptions;
  /**
   * Page filter
   * @param page Vuepress page object
   * @returns Whether the page should be included
   */
  filter: (page: Page) => boolean;
  /**
   * Custom locales for i18n plugin
   */
  locales: Record<string, Partial<I18nPluginLocaleData>>;
  /**
   * Link to translation guide(without locale path)
   */
  guideLink?: string;
}

interface I18nPluginOptions
  extends Omit<DeepPartial<I18nPluginInternalOptions>, "tip"> {
  tip?: I18nPluginTipOptions | boolean;
}

const defaultOptions: I18nPluginInternalOptions = {
  tip: {
    enable: true,
    containerClass: ["custom-container", "hint-container"],
    titleClass: ["custom-container-title", "hint-container-title"],
  },
  filter: (page) => page.frontmatter["homepage"] !== true && !!page.filePath,
  locales: {},
};

const getOptions: (options: I18nPluginOptions) => I18nPluginInternalOptions = (
  options
) => ({
  ...defaultOptions,
  tip:
    typeof options.tip === "boolean"
      ? {
          ...defaultOptions.tip,
          enable: options.tip,
        }
      : options.tip ?? defaultOptions.tip,
  ...Object.fromEntries(
    Object.entries(options).filter(([key]) => key !== "tip")
  ),
});
export {
  defaultOptions,
  getOptions,
  type I18nPluginInternalOptions,
  type I18nPluginOptions,
};
