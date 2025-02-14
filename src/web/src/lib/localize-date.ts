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