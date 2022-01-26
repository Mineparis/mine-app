import { format } from 'date-fns';
import { en, fr } from 'date-fns/locale';

const locales = { en, fr };

// by providing a default string of 'PP' or any of its variants for `formatStr`
// it will format dates in whichever way is appropriate to the locale
export const dateFormat = (date, formatStr = 'PP') => {
	return typeof window === "object" ? format(new Date(date), formatStr, {
		locale: locales[window.__localeId__] // or global.__localeId__
	}) : null;
};
