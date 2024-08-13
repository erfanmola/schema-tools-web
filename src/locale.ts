import type * as en from "./i18n/en.ts";
import * as i18n from "@solid-primitives/i18n";

import { dict as en_dict } from "./i18n/en.ts";
import { dict as fa_dict } from "./i18n/fa.ts";

const locales = [
    "en",
    "fa",
] as const;

const localeFlags: { [key in Locale]: string } = {
    'en': '🇺🇸',
    'fa': '🇮🇷',
};

const localeDirections: { [key in Locale]: string } = {
    'en': 'ltr',
    'fa': 'rtl',
};

function fetchDictionary(locale: Locale): Dictionary {
    let dict: RawDictionary;

    switch (locale) {
        case 'fa':
            dict = fa_dict;
            break;
        default:
            dict = en_dict;
            break;
    }

    return i18n.flatten(dict);
}

export type Locale = typeof locales[number];
export type RawDictionary = typeof en.dict;
export type Dictionary = i18n.Flatten<RawDictionary>;

export {
    locales,
    localeFlags,
    localeDirections,
    fetchDictionary,
}