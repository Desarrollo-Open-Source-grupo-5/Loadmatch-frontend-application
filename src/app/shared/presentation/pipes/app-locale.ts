import {registerLocaleData} from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';

registerLocaleData(localeEsPe, 'es-PE');

/**
 * Maps an ngx-translate language to the Angular locale used to format dates and numbers.
 * @param language - Current ngx-translate language (`en`, `es` or null).
 * @returns Angular locale identifier.
 */
export const toLocaleId = (language: string | null): string => (language === 'es' ? 'es-PE' : 'en-US');
