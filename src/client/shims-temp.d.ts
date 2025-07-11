declare module "@temp/i18n/locales" {
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
      content: (
        linkRenderer: LinkRenderer,
        translationGuide?: string,
      ) => string;
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

  export const translationGuides: Record<string, string | undefined>;
  export const locales: Record<string, I18nPluginLocaleData>;
}
