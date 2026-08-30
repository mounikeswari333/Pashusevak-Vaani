/**
 * Localization Service
 * Owns localization orchestration for backend content payloads.
 * It receives content fields, delegates translation to the translation service,
 * and returns a persistence-ready object containing both legacy English values
 * and localized JSONB payloads.
 */

const translationService = require('./translationService');

async function buildLocalizedNewsPayload(payload = {}) {
  const normalizedPayload = {
    headline: payload.headline || '',
    subheading: payload.subheading || '',
    byline: payload.byline || '',
    body: payload.body || '',
    credit: payload.credit || '',
  };

  const i18nPayload = {};
  const translationInputs = [
    { column: 'headline_i18n', value: normalizedPayload.headline },
    { column: 'subheading_i18n', value: normalizedPayload.subheading },
    { column: 'byline_i18n', value: normalizedPayload.byline },
    { column: 'body_i18n', value: normalizedPayload.body },
    { column: 'credit_i18n', value: normalizedPayload.credit },
  ];

  for (const item of translationInputs) {
    if (!item.value) continue;

    const hiValue = await translationService.translateText(item.value, 'hi');
    i18nPayload[item.column] = {
      en: item.value,
      hi: hiValue,
    };
  }

  return {
    headline_i18n: JSON.stringify(i18nPayload.headline_i18n || null),
    subheading_i18n: JSON.stringify(i18nPayload.subheading_i18n || null),
    byline_i18n: JSON.stringify(i18nPayload.byline_i18n || null),
    body_i18n: JSON.stringify(i18nPayload.body_i18n || null),
    credit_i18n: JSON.stringify(i18nPayload.credit_i18n || null),
  };
}

module.exports = {
  buildLocalizedNewsPayload,
};
