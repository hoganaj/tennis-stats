
// Map from IOC country codes to ISO 3166-1 alpha-2 codes
const iocToIsoCountryCode: Record<string, string> = {
  'USA': 'us',
  'ESP': 'es',
  'SRB': 'rs',
  'ITA': 'it',
  'GBR': 'gb',
  'RUS': 'ru',
  'GER': 'de',
  'FRA': 'fr',
  'SUI': 'ch',
  'AUT': 'at',
  'AUS': 'au',
  'ARG': 'ar',
  'CRO': 'hr',
  'CAN': 'ca',
  'JPN': 'jp',
  'GRE': 'gr',
  'BEL': 'be',
  'NED': 'nl',
  'SWE': 'se',
  'POL': 'pl',
  'NOR': 'no',
  'BUL': 'bg',
  'RSA': 'za',
  'CZE': 'cz',
  'CHL': 'cl',
  'POR': 'pt',
  'KAZ': 'kz',
  'DEN': 'dk',
  'FIN': 'fi',
  'BRA': 'br',
  'KOR': 'kr',
  'UKR': 'ua',
  'GEO': 'ge',
  'HUN': 'hu',
  'ROU': 'ro',
  'IND': 'in',
  'URU': 'uy',
  'COL': 'co',
  'CHN': 'cn',
  'TPE': 'tw',
  'MEX': 'mx',
  'SVK': 'sk',
  'SLO': 'si',
  'DOM': 'do',
  'TUN': 'tn',
  'LAT': 'lv',
  'EST': 'ee',
  'MDA': 'md',
  'LTU': 'lt',
  'CYP': 'cy',
  'BLR': 'by',
};

export function convertIocToIsoCountryCode(iocCode: string): string {
  // Return the mapped country code if it exists, otherwise return "un" (unknown) flag code
  return iocToIsoCountryCode[iocCode] || 'un';
}

export function getFlagUrlFromIocCode(iocCode: string, size: number = 20): string {
  const isoCode = convertIocToIsoCountryCode(iocCode);
  return `https://flagcdn.com/w${size}/${isoCode}.png`;
}