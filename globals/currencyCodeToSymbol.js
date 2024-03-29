const currencyCodeToSymbol = {
    'AED': [ 'Dhs', 'Dh', 'د.إ' ],
    'AFN': [ 'Af', 'Afs', '؋' ],
    'ALL': 'Lek',
    'AMD': '֏',
    'ANG': [ 'ƒ', 'NAƒ', 'NAf', 'f' ],
    'AOA': 'Kz',
    'ARS': [ '$', 'Arg$' ],
    'AUD': [ '$', 'Au$', 'A$' ],
    'AWG': 'Afl',
    'AZN': '₼',
    'BAM': 'KM',
    'BBD': [ '$', 'BB$', 'BBD$', 'BDS$' ],
    'BDT': '৳',
    'BGN': [ 'лв', 'lv' ],
    'BHD': [ '.د.ب', 'BD' ],
    'BIF': 'FBu',
    'BMD': [ '$', 'BD$' ],
    'BND': [ '$', 'B$' ],
    'BOB': 'Bs',
    'BRL': 'R$',
    'BTN': 'Nu',
    'BWP': 'P',
    'BYN': 'Br',
    'BZD': [ '$', 'BZ$' ],
    'CAD': [ '$', 'CA$', 'Can$', 'C$' ],
    'CDF': 'FC',
    'CHF': 'CHF',
    'CLP': [ '$', 'CLP$' ],
    'CNY': '¥',
    'COP': [ '$', 'Col$' ],
    'CRC': '₡',
    'CUP': [ '$', '$MN' ],
    'CVE': 'Esc',
    'CZK': 'Kč',
    'DJF': 'Fdj',
    'DKK': 'kr',
    'DOP': [ '$', 'RD$' ],
    'DZD': [ 'دج', 'DA' ],
    'EGP': [ '.ج.م', 'E£', '£E', 'LE', 'EGP' ],
    'ERN': [ 'ናቕፋ', 'ناكفا', 'Nkf' ],
    'ETB': [ 'ብር', 'Br' ],
    'EUR': '€',
    'FJD': [ '$', 'FJ$' ],
    'GBP': '£',
    'GEL': [ '₾', 'ლ' ],
    'GHS': [ 'GH₵', 'GH¢' ],
    'GMD': 'D',
    'GNF': [ 'FG', 'Fr', 'GFr' ],
    'GTQ': 'Q',
    'GYD': [ '$', 'G$', 'GY$' ],
    'HKD': [ '$', 'HK$', '元' ],
    'HNL': 'L',
    'HTG': 'G',
    'HUF': 'Ft',
    'IDR': 'Rp',
    'ILS': '₪',
    'INR': '₹',
    'IQD': [ 'د.ع', 'ID' ],
    'IRR': [ '﷼', 'RI' ],
    'ISK': 'kr',
    'JMD': [ '$', 'J$' ],
    'JOD': 'د.أ',
    'JPY': '¥',
    'KES': 'KSh',
    'KGS': [ '⃀', 'сом', 'som' ],
    'KHR': '៛',
    'KMF': 'FC',
    'KRW': '₩',
    'KWD': [ 'د.ك', 'KD' ],
    'KYD': [ '$', 'CI$' ],
    'KZT': '₸',
    'LAK': [ '₭', '₭N' ],
    'LBP': [ 'ل.ل', 'LL' ],
    'LKR': [ 'රු', '௹', 'Rs', 'Re' ],
    'LRD': [ '$', 'L$', 'LD$' ],
    'LSL': 'M',
    'LYD': [ 'ل.د', 'LD' ],
    'MAD': 'DH',
    'MDL': 'L',
    'MGA': 'Ar',
    'MKD': [ 'ден', 'den' ],
    'MMK': 'Ks',
    'MNT': '₮',
    'MOP': [ '$', 'MOP$' ],
    'MRU': 'UM',
    'MUR': 'Rs',
    'MVR': [ 'Rf', 'MVR', 'ރ' ],
    'MWK': 'K',
    'MXN': [ '$', 'Mex$' ],
    'MYR': 'RM',
    'MZN': [ 'MT', 'MTn' ],
    'NAD': [ '$', 'N$' ],
    'NGN': '₦',
    'NIO': [ '$', 'C$' ],
    'NOK': 'kr',
    'NPR': 'रू',
    'NZD': [ '$', 'NZ$', '$NZ' ],
    'OMR': [ 'ر.ع.', ' R.O', '﷼' ],
    'PAB': 'B/.',
    'PEN': 'S/',
    'PGK': 'K',
    'PHP': '₱',
    'PKR': 'Rs',
    'PLN': 'zł',
    'PYG': '₲',
    'QAR': [ 'ر.ق', 'QR' ],
    'RON': [ 'Leu', 'Lei' ],
    'RSD': [ 'РСД', 'DIN' ],
    'RUB': '₽',
    'RWF': [ 'FRw', 'RF', 'R₣' ],
    'SAR': [ 'ر.س', 'SAR', 'SR' ],
    'SBD': [ '$', 'SI$' ],
    'SCR': 'SR',
    'SDG': [ 'ج.س', 'LS' ],
    'SEK': 'kr',
    'SGD': [ '$', 'S$' ],
    'SLE': 'Le',
    'SOS': 'Sh.So',
    'SRD': [ '$', 'Sur$' ],
    'SSP': 'SSP',
    'STN': 'Db',
    'SYP': [ 'ل.س', 'LS', 'SP' ],
    'SZL': 'E',
    'THB': '฿',
    'TJS': 'SM',
    'TMT': 'm',
    'TND': [ 'د.ت', 'DT' ],
    'TOP': [ 'T$', 'PT' ],
    'TRY': '₺',
    'TTD': [ '$', 'TT$' ],
    'TWD': [ '$', 'NT$', 'NT' ],
    'TZS': 'TSh',
    'UAH': '₴',
    'UGX': 'USh',
    'USD': [ '$', 'US$', 'U$' ],
    'UYU': '$U',
    'UZS': 'soʻm',
    'VES': 'Bs.S',
    'VND': '₫',
    'VUV': 'VT',
    'WST': [ 'WS$', 'SAT', 'ST', 'T' ],
    'XAF': 'F.CFA',
    'XCD': [ '$', 'EC$' ],
    'XOF': 'F.CFA',
    'XPF': 'F',
    'YER': '﷼',
    'ZAR': 'R',
    'ZMW': [ 'K', 'ZK' ]
};