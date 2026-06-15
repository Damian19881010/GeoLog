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
    cities: [
      'Hokkaido',
      'Aomori Prefecture',
      'Iwate Prefecture',
      'Miyagi Prefecture',
      'Akita Prefecture',
      'Yamagata Prefecture',
      'Fukushima Prefecture',
      'Ibaraki Prefecture',
      'Tochigi Prefecture',
      'Gunma Prefecture',
      'Saitama Prefecture',
      'Chiba Prefecture',
      'Tokyo Metropolis',
      'Kanagawa Prefecture',
      'Niigata Prefecture',
      'Toyama Prefecture',
      'Ishikawa Prefecture',
      'Fukui Prefecture',
      'Yamanashi Prefecture',
      'Nagano Prefecture',
      'Gifu Prefecture',
      'Shizuoka Prefecture',
      'Aichi Prefecture',
      'Mie Prefecture',
      'Shiga Prefecture',
      'Kyoto Prefecture',
      'Osaka Prefecture',
      'Hyogo Prefecture',
      'Nara Prefecture',
      'Wakayama Prefecture',
      'Tottori Prefecture',
      'Shimane Prefecture',
      'Okayama Prefecture',
      'Hiroshima Prefecture',
      'Yamaguchi Prefecture',
      'Tokushima Prefecture',
      'Kagawa Prefecture',
      'Ehime Prefecture',
      'Kochi Prefecture',
      'Fukuoka Prefecture',
      'Saga Prefecture',
      'Nagasaki Prefecture',
      'Kumamoto Prefecture',
      'Oita Prefecture',
      'Miyazaki Prefecture',
      'Kagoshima Prefecture',
      'Okinawa Prefecture',
    ],
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
    cities: [
      'Taipei City',
      'New Taipei City',
      'Taoyuan City',
      'Taichung City',
      'Tainan City',
      'Kaohsiung City',
      'Hsinchu County',
      'Miaoli County',
      'Changhua County',
      'Nantou County',
      'Yunlin County',
      'Chiayi County',
      'Pingtung County',
      'Yilan County',
      'Hualien County',
      'Taitung County',
      'Penghu County',
      'Kinmen County',
      'Lienchiang County',
      'Keelung City',
      'Hsinchu City',
      'Chiayi City',
    ],
  },
  'United States': {
    label: '美國',
    flagCode: 'us',
    cities: ['New York', 'Los Angeles', 'Chicago'],
  },
  'United Kingdom': {
    label: '英國',
    flagCode: 'gb',
    cities: ['London', 'Manchester', 'Birmingham'],
  },
  France: {
    label: '法國',
    flagCode: 'fr',
    cities: ['Paris', 'Lyon', 'Marseille'],
  },
  Australia: {
    label: '澳洲',
    flagCode: 'au',
    cities: ['Sydney', 'Melbourne', 'Brisbane'],
  },
  'Czech Republic': {
    label: '捷克',
    flagCode: 'cz',
    cities: ['Prague', 'Brno', 'Ostrava'],
  },
  Netherlands: {
    label: '荷蘭',
    flagCode: 'nl',
    cities: ['Amsterdam', 'Rotterdam', 'The Hague'],
  },
  Spain: {
    label: '西班牙',
    flagCode: 'es',
    cities: ['Madrid', 'Barcelona', 'Valencia'],
  },
}

export const cityLabels: Record<string, string> = {
  Okinawa: '沖繩',
  Osaka: '大阪',
  Kyoto: '京都',
  Tokyo: '東京',
  Hokkaido: '北海道',
  'Aomori Prefecture': '青森縣',
  'Iwate Prefecture': '岩手縣',
  'Miyagi Prefecture': '宮城縣',
  'Akita Prefecture': '秋田縣',
  'Yamagata Prefecture': '山形縣',
  'Fukushima Prefecture': '福島縣',
  'Ibaraki Prefecture': '茨城縣',
  'Tochigi Prefecture': '栃木縣',
  'Gunma Prefecture': '群馬縣',
  'Saitama Prefecture': '埼玉縣',
  'Chiba Prefecture': '千葉縣',
  'Tokyo Metropolis': '東京都',
  'Kanagawa Prefecture': '神奈川縣',
  'Niigata Prefecture': '新潟縣',
  'Toyama Prefecture': '富山縣',
  'Ishikawa Prefecture': '石川縣',
  'Fukui Prefecture': '福井縣',
  'Yamanashi Prefecture': '山梨縣',
  'Nagano Prefecture': '長野縣',
  'Gifu Prefecture': '岐阜縣',
  'Shizuoka Prefecture': '靜岡縣',
  'Aichi Prefecture': '愛知縣',
  'Mie Prefecture': '三重縣',
  'Shiga Prefecture': '滋賀縣',
  'Kyoto Prefecture': '京都府',
  'Osaka Prefecture': '大阪府',
  'Hyogo Prefecture': '兵庫縣',
  'Nara Prefecture': '奈良縣',
  'Wakayama Prefecture': '和歌山縣',
  'Tottori Prefecture': '鳥取縣',
  'Shimane Prefecture': '島根縣',
  'Okayama Prefecture': '岡山縣',
  'Hiroshima Prefecture': '廣島縣',
  'Yamaguchi Prefecture': '山口縣',
  'Tokushima Prefecture': '德島縣',
  'Kagawa Prefecture': '香川縣',
  'Ehime Prefecture': '愛媛縣',
  'Kochi Prefecture': '高知縣',
  'Fukuoka Prefecture': '福岡縣',
  'Saga Prefecture': '佐賀縣',
  'Nagasaki Prefecture': '長崎縣',
  'Kumamoto Prefecture': '熊本縣',
  'Oita Prefecture': '大分縣',
  'Miyazaki Prefecture': '宮崎縣',
  'Kagoshima Prefecture': '鹿兒島縣',
  'Okinawa Prefecture': '沖繩縣',
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
  Taipei: '台北市',
  NewTaipei: '新北市',
  Taoyuan: '桃園市',
  Taichung: '台中市',
  Tainan: '台南市',
  Kaohsiung: '高雄市',
  'Taipei City': '台北市',
  'New Taipei City': '新北市',
  'Taoyuan City': '桃園市',
  'Taichung City': '台中市',
  'Tainan City': '台南市',
  'Kaohsiung City': '高雄市',
  'Hsinchu County': '新竹縣',
  'Miaoli County': '苗栗縣',
  'Changhua County': '彰化縣',
  'Nantou County': '南投縣',
  'Yunlin County': '雲林縣',
  'Chiayi County': '嘉義縣',
  'Pingtung County': '屏東縣',
  'Yilan County': '宜蘭縣',
  'Hualien County': '花蓮縣',
  'Taitung County': '台東縣',
  'Penghu County': '澎湖縣',
  'Kinmen County': '金門縣',
  'Lienchiang County': '連江縣',
  'Keelung City': '基隆市',
  'Hsinchu City': '新竹市',
  'Chiayi City': '嘉義市',
  Singapore: '新加坡',
  'New York': '紐約',
  'Los Angeles': '洛杉磯',
  Chicago: '芝加哥',
  London: '倫敦',
  Manchester: '曼徹斯特',
  Birmingham: '伯明罕',
  Paris: '巴黎',
  Lyon: '里昂',
  Marseille: '馬賽',
  Sydney: '雪梨',
  Melbourne: '墨爾本',
  Brisbane: '布里斯本',
  Prague: '布拉格',
  Brno: '布爾諾',
  Ostrava: '俄斯特拉發',
  Amsterdam: '阿姆斯特丹',
  Rotterdam: '鹿特丹',
  'The Hague': '海牙',
  Madrid: '馬德里',
  Barcelona: '巴塞隆納',
  Valencia: '瓦倫西亞',
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
