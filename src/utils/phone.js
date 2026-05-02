'use strict';

const { parsePhoneNumberFromString } = require('libphonenumber-js');

function normalizePhone(rawPhone) {
  if (typeof rawPhone !== 'string') return null;
  const parsed = parsePhoneNumberFromString(rawPhone.trim());
  if (!parsed || !parsed.isValid()) return null;
  return {
    e164: parsed.number,
    country: parsed.country,
    countryCallingCode: parsed.countryCallingCode,
  };
}

module.exports = { normalizePhone };
