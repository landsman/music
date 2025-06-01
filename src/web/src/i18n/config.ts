import { i18n } from "@lingui/core";

export async function dynamicActivate(locale: string) {
    // Import the messages for the requested locale
    const { messages } = await import(`./locales/${locale}`).then(module => ({
        messages: module[locale].messages
    }));

    i18n.load({
        [locale]: messages
    });
    i18n.activate(locale);
}
