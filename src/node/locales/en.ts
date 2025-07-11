import type { I18nPluginLocaleData } from "../../shared/index.js";

const enLocaleData: I18nPluginLocaleData = {
  lang: "en-US",
  untranslated: {
    title: "Notice",
    content: (linkRenderer, translationGuide) =>
      `This page has not yet been translated${
        translationGuide
          ? `, see how you can help ${linkRenderer("here", translationGuide)}`
          : ""
      }.`,
  },
  outdated: {
    title: "Warning",
    content: (
      linkRenderer,
      sourceUpdateTime,
      translationUpdateTime,
      sourceLink,
    ) => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ] as const;

      const getDateString = (timestamp: number) => {
        const date = new Date(timestamp);
        return `${date.getDate()} ${
          months[date.getMonth()] as string
        } ${date.getFullYear()}`;
      };

      return `This translation was modified on ${getDateString(
        translationUpdateTime,
      )} and an updated version (${getDateString(
        sourceUpdateTime,
      )}) is available on the source page. ${linkRenderer(
        "View the original page",
        sourceLink,
      )}`;
    },
  },
};
export default enLocaleData;
