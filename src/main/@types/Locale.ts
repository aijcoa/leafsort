export type Code =
  | 'ar'
  | 'cs'
  | 'de'
  | 'en'
  | 'es'
  | 'fr'
  | 'hu'
  | 'ja'
  | 'pl'
  | 'pt'
  | 'ru'
  | 'tr'
  | 'zh-CN'
  | 'zh-TW';

export type Locale = {
  code: Code;
  value: string;
};
