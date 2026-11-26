import { registerLocaleData } from '@angular/common';
import localeAr from '@angular/common/locales/ar';
import localeBg from '@angular/common/locales/bg';
import localeDe from '@angular/common/locales/de';
import localeEs from '@angular/common/locales/es';
import localeFr from '@angular/common/locales/fr';
import localeHe from '@angular/common/locales/he';
import localeIt from '@angular/common/locales/it';
import localeNl from '@angular/common/locales/nl';
import localePl from '@angular/common/locales/pl';
import localePt from '@angular/common/locales/pt';
import localeRu from '@angular/common/locales/ru';
import localeZh from '@angular/common/locales/zh';
import { LanguagesEnum } from '@gauzy/contracts';
// Moment ships only `en`. The date pipes call `moment().locale(preferredLanguage)`, so without these
// imports every language silently falls back to English month and day names. Moment has no plain
// `zh` locale (only zh-cn, zh-tw...), so Chinese keeps that fallback.
import 'moment/locale/ar';
import 'moment/locale/bg';
import 'moment/locale/de';
import 'moment/locale/es';
import 'moment/locale/fr';
import 'moment/locale/he';
import 'moment/locale/it';
import 'moment/locale/nl';
import 'moment/locale/pl';
import 'moment/locale/pt';
import 'moment/locale/pt-br'; // RegionsEnum.PT_BR, which moment normalises to pt-br
import 'moment/locale/ru';

/**
 * Angular locale data per UI language. Angular's `pt` is Portuguese (Brazil): `R$ 12.345,67`.
 */
const ANGULAR_LOCALES: Record<LanguagesEnum, unknown[] | null> = {
	[LanguagesEnum.ENGLISH]: null, // en-US is built in
	[LanguagesEnum.ARABIC]: localeAr,
	[LanguagesEnum.BULGARIAN]: localeBg,
	[LanguagesEnum.GERMAN]: localeDe,
	[LanguagesEnum.SPANISH]: localeEs,
	[LanguagesEnum.FRENCH]: localeFr,
	[LanguagesEnum.HEBREW]: localeHe,
	[LanguagesEnum.ITALIAN]: localeIt,
	[LanguagesEnum.DUTCH]: localeNl,
	[LanguagesEnum.POLISH]: localePl,
	[LanguagesEnum.PORTUGUESE]: localePt,
	[LanguagesEnum.RUSSIAN]: localeRu,
	[LanguagesEnum.CHINESE]: localeZh
};

const DEFAULT_LOCALE = 'en-US';

/**
 * Reads the language the user picked, as persisted by the Akita store (`_gauzyStore.persist`).
 * Returns null when nothing usable is stored (first visit, private window, blocked storage).
 */
function readPreferredLanguage(): string | null {
	try {
		const raw = localStorage.getItem('_gauzyStore');
		const persisted = raw ? JSON.parse(raw)?.persist?.preferredLanguage : null;
		return persisted || localStorage.getItem('preferredLanguage');
	} catch {
		return null;
	}
}

/**
 * Factory for `LOCALE_ID`: number, currency, percent and date pipes then follow the UI language
 * instead of always formatting as en-US. `LOCALE_ID` is fixed at bootstrap, so a language change
 * takes effect for these pipes on the next page load; translations still switch immediately.
 */
export function resolveAppLocale(): string {
	const language = readPreferredLanguage() as LanguagesEnum | null;
	const data = language ? ANGULAR_LOCALES[language] : null;
	if (!language || !data) return DEFAULT_LOCALE;

	registerLocaleData(data, language);
	return language;
}
