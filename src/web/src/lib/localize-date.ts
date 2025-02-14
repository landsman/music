import {i18n} from "../i18n/i18n.ts";

export function localizeDateTime(
    date: Date,
    locale: string,
    timezone: string,
    options?: Intl.DateTimeFormatOptions
): string {
    const formatOptions: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        ...options,
    };

    return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

export function localizeDateTimeBrowser(dateTime: string): string {
    return localizeDateTime(new Date(dateTime), navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone)
}

type LocalizeDate = {
    seconds: string
    minutes: string
    hours: string
    days: string
}

export function localizeRelativeTime(date: Date, locale: string, i18n: LocalizeDate): string {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const seconds = diff / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    let value: number;
    let unit: string;

    if (Math.abs(seconds) < 60) {
        value = seconds;
        unit = i18n.seconds;
    } else if (Math.abs(minutes) < 60) {
        value = minutes;
        unit = i18n.minutes;
    } else if (Math.abs(hours) < 24) {
        value = hours;
        unit = i18n.hours;
    } else {
        value = days;
        unit = i18n.days;
    }

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'always' });
    return rtf.format(Math.round(value), unit as Intl.RelativeTimeFormatUnit);
}

export function localizeRelativeTimeBrowser(dateTime: string, localization: LocalizeDate): string {
    return localizeRelativeTime(
        new Date(dateTime),
        navigator.language,
        localization
    );
}