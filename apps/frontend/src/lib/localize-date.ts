export function localizeDateTime(
  date: Date,
  locale: string,
  timezone: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const formatOptions: Intl.DateTimeFormatOptions = {
    timeZone: timezone,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    ...options,
  };

  return new Intl.DateTimeFormat(locale, formatOptions).format(date);
}

export function localizeDateTimeBrowser(dateTime: string): string {
  return localizeDateTime(
    new Date(dateTime),
    navigator.language,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
}

type LocalizeDate = {
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
  ago: string;
  in: string;
};

export function localizeRelativeTime(
  date: Date,
  locale: string,
  i18n: LocalizeDate,
): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (Math.abs(seconds) < 60) {
    value = seconds;
    unit = "second";
  } else if (Math.abs(minutes) < 60) {
    value = minutes;
    unit = "minute";
  } else if (Math.abs(hours) < 24) {
    value = hours;
    unit = "hour";
  } else {
    value = days;
    unit = "day";
  }

  // Use RTF directly for English
  if (locale.startsWith("en")) {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
    return rtf.format(Math.round(value), unit);
  }

  // Custom formatting for Czech
  const roundedValue = Math.round(Math.abs(value));
  let localizedUnit = "";

  switch (unit) {
    case "second":
      localizedUnit = i18n.seconds;
      break;
    case "minute":
      localizedUnit = i18n.minutes;
      break;
    case "hour":
      localizedUnit = i18n.hours;
      break;
    case "day":
      localizedUnit = i18n.days;
      break;
  }

  // For past time (negative values)
  if (value < 0) {
    // Czech grammar: "před X [jednotkami]"
    return `${i18n.ago} ${roundedValue} ${localizedUnit}`;
  }

  // For future time (positive values)
  // Czech grammar: "za X [jednotkami]"
  return `${i18n.in} ${roundedValue} ${localizedUnit}`;
}

export function localizeRelativeTimeBrowser(
  dateTime: string,
  locale: string,
  localization: LocalizeDate,
): string {
  return localizeRelativeTime(
    new Date(dateTime),
    locale,
    localization,
  );
}
