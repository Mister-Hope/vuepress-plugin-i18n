import { translationGuides, locales } from "@temp/i18n/locales";

// VuePress defines
declare const I18N_PLUGIN_CONTAINER_CLASS: string[];
declare const I18N_PLUGIN_BASE_LOCALE_PATH: string;
declare const I18N_PLUGIN_TITLE_CLASS: string[];

const containerClass = I18N_PLUGIN_CONTAINER_CLASS;
const baseLocalePath = I18N_PLUGIN_BASE_LOCALE_PATH;
const titleClass = I18N_PLUGIN_TITLE_CLASS;

export {
  containerClass,
  translationGuides,
  locales,
  baseLocalePath,
  titleClass,
};
