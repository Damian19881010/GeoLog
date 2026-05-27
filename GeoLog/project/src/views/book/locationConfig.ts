type CountryConfig = {
  label: string
  flagCode?: string
  cities?: string[]
}

export type CountryCityMap = Record<string, string[]>

export const countryConfig: Record<string, CountryConfig> = {
  Japan: {
    label: '日本',
    flagCode: 'jp',
    cities: ['Okinawa', 'Osaka', 'Kyoto', 'Tokyo'],
  },
  'South Korea': {
    label: '韓國',
    flagCode: 'kr',
    cities: ['Seoul', 'Busan', 'Jeju'],
  },
  Thailand: {
    label: '泰國',
    flagCode: 'th',
    cities: ['Bangkok', 'Chiang Mai', 'Phuket'],
  },
  Vietnam: {
    label: '越南',
    flagCode: 'vn',
    cities: ['Hanoi', 'Da Nang', 'Ho Chi Minh City'],
  },
  Singapore: {
    label: '新加坡',
    flagCode: 'sg',
    cities: ['Singapore'],
  },
  Malaysia: {
    label: '馬來西亞',
    flagCode: 'my',
    cities: ['Kuala Lumpur', 'Penang', 'Kota Kinabalu'],
  },
  Philippines: {
    label: '菲律賓',
    flagCode: 'ph',
    cities: ['Manila', 'Cebu', 'Boracay'],
  },
  Indonesia: {
    label: '印尼',
    flagCode: 'id',
    cities: ['Bali', 'Jakarta'],
  },
  Germany: {
    label: '德國',
    flagCode: 'de',
    cities: ['Frankfurt', 'Berlin', 'Munich'],
  },
  Taiwan: {
    label: '台灣',
    flagCode: 'tw',
    cities: ['Taipei', 'Taichung', 'Kaohsiung'],
  },
  'United States': {
    label: '美國',
    flagCode: 'us',
  },
  'United Kingdom': {
    label: '英國',
    flagCode: 'gb',
  },
  France: {
    label: '法國',
    flagCode: 'fr',
  },
  Australia: {
    label: '澳洲',
    flagCode: 'au',
  },
  'Czech Republic': {
    label: 'Czech Republic',
    flagCode: 'cz',
  },
  Netherlands: {
    label: 'Netherlands',
    flagCode: 'nl',
  },
  Spain: {
    label: 'Spain',
    flagCode: 'es',
  },
}

export const cityLabels: Record<string, string> = {
  Okinawa: '沖繩',
  Osaka: '大阪',
  Kyoto: '京都',
  Tokyo: '東京',
  Seoul: '首爾',
  Busan: '釜山',
  Jeju: '濟州',
  Bangkok: '曼谷',
  'Chiang Mai': '清邁',
  Phuket: '普吉',
  Hanoi: '河內',
  'Da Nang': '峴港',
  'Ho Chi Minh City': '胡志明',
  'Kuala Lumpur': '吉隆坡',
  Penang: '檳城',
  'Kota Kinabalu': '亞庇',
  Manila: '馬尼拉',
  Cebu: '宿霧',
  Boracay: '長灘島',
  Bali: '峇里島',
  Jakarta: '雅加達',
  Frankfurt: '法蘭克福',
  Berlin: '柏林',
  Munich: '慕尼黑',
  Taipei: '台北',
  Taichung: '台中',
  Kaohsiung: '高雄',
  Singapore: '新加坡',
}

export const fallbackCountryCityMap: CountryCityMap = Object.fromEntries(
  Object.entries(countryConfig)
    .filter(([, config]) => Array.isArray(config.cities) && config.cities.length > 0)
    .map(([country, config]) => [country, config.cities ?? []])
) as CountryCityMap

const countryLabels = Object.fromEntries(
  Object.entries(countryConfig).map(([country, config]) => [country, config.label])
) as Record<string, string>

const countryValuesByLabel = Object.fromEntries(
  Object.entries(countryLabels).map(([value, label]) => [label, value])
) as Record<string, string>

const cityValuesByLabel = Object.fromEntries(
  Object.entries(cityLabels).map(([value, label]) => [label, value])
) as Record<string, string>

export const getLocationLabel = (value: string) =>
  countryLabels[value] ?? cityLabels[value] ?? value

export const getCountryFlagClass = (country: string) => {
  const countryCode = countryConfig[country]?.flagCode
  return countryCode ? `fi-${countryCode}` : ''
}

export const toCountryValue = (value: string) =>
  countryValuesByLabel[value] ?? value

export const toCityValue = (value: string) =>
  cityValuesByLabel[value] ?? value