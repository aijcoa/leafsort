import i18next from 'i18next';

import en from './locales/en.json';
import ja from './locales/ja.json';
/** Merge the pull request sent by PetrTodorov. */
/** https://github.com/sprout2000/leafview/pull/68 */
import cs from './locales/cs.json';
/** Merge the pull request sent by DrDeee. */
/** https://github.com/sprout2000/leafview/pull/166 */
import de from './locales/de.json';
/** Merge the pull request sent by singuerinc */
/** https://github.com/sprout2000/leafview/pull/178 */
import es from './locales/es.json';
/** Merge the pull request sent by nukeop */
/** https://github.com/sprout2000/leafview/pull/214 */
import pl from './locales/pl.json';

import ru from './locales/ru.json'

export const setLocales = (locale: string): void => {
  i18next.init({
    lng: locale,
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      ja: { translation: ja },
      cs: { translation: cs },
      de: { translation: de },
      es: { translation: es },
      pl: { translation: pl },
      ru: { translation: ru },
    },
  });
};
