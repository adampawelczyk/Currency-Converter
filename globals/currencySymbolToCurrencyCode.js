const currencySymbolToCurrencyCode = {
    'Dhs': 'AED',
    'Dh': 'AED',
    'د.إ': 'AED',
    'Af': 'AFN',
    'Afs': 'AFN',
    '؋': 'AFN',
    'Lek': 'ALL',
    '֏': 'AMD',
    'ƒ': 'ANG',
    'NAƒ': 'ANG',
    'NAf': 'ANG',
    'f': 'ANG',
    'Kz': 'AOA',
    '$': ['USD', 'ARS', 'AUD', 'BBD', 'BMD', 'BND', 'BZD', 'CAD', 'CLP', 'COP', 'CUP', 'DOP', 'FJD', 'GYD', 'HKD', 'JMD', 'KYD', 'LRD', 'MOP', 'MXN', 'NAD', 'NIO', 'NZD', 'SBD', 'SGD', 'SRD', 'TTD', 'TWD', 'XCD'],
    'Arg$': 'ARS',
    'Au$': 'AUD',
    'A$': 'AUD',
    'Afl': 'AWG',
    '₼': 'AZN',
    'KM': 'BAM',
    'BB$': 'BBD',
    'BBD$': 'BBD',
    'BDS$': 'BBD',
    '৳': 'BDT',
    'лв': 'BGN',
    'lv': 'BGN',
    '.د.ب': 'BHD',
    'BD': 'BHD',
    'FBu': 'BIF',
    'BD$': 'BMD',
    'B$': 'BND',
    'Bs': 'BOB',
    'R$': 'BRL',
    'Nu': 'BTN',
    'P': 'BWP',
    'Br': [ 'BYN', 'ETB' ],
    'BZ$': 'BZD',
    'CA$': 'CAD',
    'Can$': 'CAD',
    'C$': [ 'CAD', 'NIO' ],
    'FC': [ 'CDF', 'KMF' ],
    '₣': 'CHF',
    'CHF': 'CHF',
    'CLP$': 'CLP',
    '¥': [ 'JPY', 'CNY' ],
    '円': 'JPY',
    'CN¥': 'CNY',
    'Col$': 'COP',
    '₡': 'CRC',
    '$MN': 'CUP',
    'Esc': 'CVE',
    'Kč': 'CZK',
    'Fdj': 'DJF',
    'kr': [ 'DKK', 'ISK', 'NOK', 'SEK' ],
    'RD$': 'DOP',
    'دج': 'DZD',
    'DA': 'DZD',
    '.ج.م': 'EGP',
    'E£': 'EGP',
    '£E': 'EGP',
    'LE': 'EGP',
    'EGP': 'EGP',
    'ናቕፋ': 'ERN',
    'ناكفا': 'ERN',
    'Nkf': 'ERN',
    'ብር': 'ETB',
    '€': 'EUR',
    'FJ$': 'FJD',
    '£': 'GBP',
    '₾': 'GEL',
    'ლ': 'GEL',
    'GH₵': 'GHS',
    'GH¢': 'GHS',
    'D': 'GMD',
    'FG': 'GNF',
    'Fr': 'GNF',
    'GFr': 'GNF',
    'Q': 'GTQ',
    'G$': 'GYD',
    'GY$': 'GYD',
    'HK$': 'HKD',
    '元': 'HKD',
    'L': [ 'HNL', 'MDL' ],
    'G': 'HTG',
    'Ft': 'HUF',
    'Rp': 'IDR',
    '₪': 'ILS',
    '₹': 'INR',
    'د.ع': 'IQD',
    'ID': 'IQD',
    '﷼': [ 'IRR', 'OMR', 'YER' ],
    'RI': 'IRR',
    'J$': 'JMD',
    'د.أ': 'JOD',
    'KSh': 'KES',
    '⃀': 'KGS',
    'сом': 'KGS',
    'som': 'KGS',
    '៛': 'KHR',
    '₩': 'KRW',
    'د.ك': 'KWD',
    'KD': 'KWD',
    'CI$': 'KYD',
    '₸': 'KZT',
    '₭': 'LAK',
    '₭N': 'LAK',
    'ل.ل': 'LBP',
    'LL': 'LBP',
    'රු': 'LKR',
    '௹': 'LKR',
    'Rs': [ 'LKR', 'MUR', 'PKR' ],
    'Re': 'LKR',
    'L$': 'LRD',
    'LD$': 'LRD',
    'M': 'LSL',
    'ل.د': 'LYD',
    'LD': 'LYD',
    'DH': 'MAD',
    'Ar': 'MGA',
    'ден': 'MKD',
    'den': 'MKD',
    'Ks': 'MMK',
    '₮': 'MNT',
    'MOP$': 'MOP',
    'UM': 'MRU',
    'Rf': 'MVR',
    'MVR': 'MVR',
    'ރ': 'MVR',
    'K': [ 'MWK', 'PGK', 'ZMW' ],
    'Mex$': 'MXN',
    'RM': 'MYR',
    'MT': 'MZN',
    'MTn': 'MZN',
    'N$': 'NAD',
    '₦': 'NGN',
    'रू': 'NPR',
    'NZ$': 'NZD',
    '$NZ': 'NZD',
    'ر.ع.': 'OMR',
    ' R.O': 'OMR',
    'B/.': 'PAB',
    'S/': 'PEN',
    '₱': 'PHP',
    'zł': 'PLN',
    '₲': 'PYG',
    'ر.ق': 'QAR',
    'QR': 'QAR',
    'Leu': 'RON',
    'Lei': 'RON',
    'РСД': 'RSD',
    'DIN': 'RSD',
    '₽': 'RUB',
    'FRw': 'RWF',
    'RF': 'RWF',
    'R₣': 'RWF',
    'ر.س': 'SAR',
    'SAR': 'SAR',
    'SR': [ 'SAR', 'SCR' ],
    'SI$': 'SBD',
    'ج.س': 'SDG',
    'LS': [ 'SDG', 'SYP' ],
    'S$': 'SGD',
    'Le': 'SLE',
    'Sh.So': 'SOS',
    'Sur$': 'SRD',
    'SSP': 'SSP',
    'Db': 'STN',
    'ل.س': 'SYP',
    'SP': 'SYP',
    'E': 'SZL',
    '฿': 'THB',
    'SM': 'TJS',
    'm': 'TMT',
    'د.ت': 'TND',
    'DT': 'TND',
    'T$': 'TOP',
    'PT': 'TOP',
    '₺': 'TRY',
    'TT$': 'TTD',
    'NT$': 'TWD',
    'NT': 'TWD',
    'TSh': 'TZS',
    '₴': 'UAH',
    'USh': 'UGX',
    'US$': 'USD',
    'U$': 'USD',
    '$U': 'UYU',
    'soʻm': 'UZS',
    'Bs.S': 'VES',
    '₫': 'VND',
    'VT': 'VUV',
    'WS$': 'WST',
    'SAT': 'WST',
    'ST': 'WST',
    'T': 'WST',
    'F.CFA': [ 'XAF', 'XOF' ],
    'EC$': 'XCD',
    'F': 'XPF',
    'R': 'ZAR',
    'ZK': 'ZMW'
};