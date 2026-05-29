import type { JourneyDay } from './types'

/**
 * 假資料：書本行程（以 Tab/Day 為單位）
 *
 * 結構：
 * - tabs: Array<{
 *    id: string
 *    date: string
 *    tabText: string
 *    header: { title: string; rhythm: string }
 *    items: Array<{
 *      id: string
 *      time: string
 *      title: string
 *      address: string
 *      note?: string
 *      tickets: null | {
 *        selectedTrip: 'outbound' | 'inbound'
 *        outbound: {
 *          airline: string
 *          bookingCode: string
 *          flightNo: string
 *          departureAt: string
 *          notice: string
 *        }
 *        inbound: {
 *          airline: string
 *          bookingCode: string
 *          flightNo: string
 *          departureAt: string
 *          notice: string
 *        }
 *      }
 *    }>
 *  }>
 */

export const journeyTabs: JourneyDay[] = [
  {
    id: 'day-1',
    date: '2025-03-19',
    tabText: 'DAY 1',
    header: {
      title: 'DAY 1｜抵達那霸・租車・PARCO CITY',
      rhythm: '節奏：抵達後先取車，再用一整個下午完成大採買；晚上視體力走國際通。',
    },
    items: [
      {
        id: 'd1-1',
        time: '05:00 - 06:00',
        title: 'start',
        address: '新北市永和區永平路368號23號',
        lat: 25.0095,
        lng: 121.5155,
        note: '出發前檢查 機票、藥品、護照、駕照 & 駕照譯本 是否都帶了',
        tickets: null,
        tags: ['transport'],
        transport: { mode: 'drive', duration: '40 分鐘', note: '前往桃園機場' },
        visited: false,
      },
      {
        id: 'd1-2',
        time: '09:45 - 11:25',
        title: '桃園機場 ➔ 那霸機場',
        address: '桃園市大園區航站南路9號',
        lat: 25.0797,
        lng: 121.2342,
        note: null,
        tags: ['transport'],
        transport: { mode: 'taxi', duration: '20 分鐘', note: '機場接駁至航廈' },
        visited: false,
        // 機票
        tickets: {
          selectedTrip: 'outbound',
          outbound: {
            airline: 'Peach樂桃',
            bookingCode: '5BPCRV',
            flightNo: 'MM922',
            departureAt: '2026/03/19 09:45',
            notice: '如搭乘日本國內線航班，請於出發時間前120分鐘~50分鐘內完成手續',
          },
          inbound: {
            airline: 'Peach樂桃',
            bookingCode: '5BPCRV',
            flightNo: 'MM929',
            departureAt: '2026/03/23 16:50',
            notice: '如搭乘日本國內線航班，請於出發時間前120分鐘~50分鐘內完成手續',
          },
        },
      },
      {
        id: 'd1-3',
        time: '11:25 - 13:20',
        title: '那霸機場（用餐 & 隨意逛逛）',
        address: '50 Kagamizu, Naha, Okinawa 901-0142 日本',
        lat: 26.2006,
        lng: 127.6478,
        note: '豬肉蛋飯糰「Pork Tamago Onigiri」珀塔瑪',
        tickets: null,
        tags: ['food', 'attraction'],
        transport: { mode: 'bus', duration: '10 分鐘', note: '機場免費接駁' },
        visited: false,
      },
      {
        id: 'd1-4',
        time: '13:30 - 14:00',
        title: 'OTS 取車（臨空豐崎營業所）',
        address: '3-37 Toyosaki, Tomigusuku, Okinawa 901-0225 日本',
        lat: 26.1693,
        lng: 127.6561,
        note: '機場免費接駁取車。由 4號出口 出來後請穿過人行道，前往左側的 「10-A (R-10)」 接駁站。預約號碼：OTS1409373,支付方式：當地支付,https://www.otsinternational.jp',
        tickets: null,
        tags: ['transport'],
        transport: { mode: 'drive', duration: '30 分鐘', note: '自駕前往 PARCO CITY' },
        visited: false,
      },
      {
        id: 'd1-5',
        time: '14:00 - 20:00',
        title: '浦添西 PARCO CITY',
        address: '3-37 Toyosaki, Tomigusuku, Okinawa 901-0225 日本',
        lat: 26.2647,
        lng: 127.6997,
        note: '1樓免稅櫃台可退稅，購物滿 5000 即可退稅。部分店家要在該店家退稅。食：敘敘苑（燒肉）、A&W',
        tickets: null,
        tags: ['shopping', 'food'],
        transport: { mode: 'drive', duration: '20 分鐘', note: '開車前往飯店' },
        visited: false,
      },
      {
        id: 'd1-6',
        time: '20:30 - 21:00',
        title: 'Nest Hotel Naha Nishi（Nest 鳥巢飯店）',
        address: '1 Chome-20-19 Nishi, Naha, Okinawa 900-0036日本',
        lat: 26.2169,
        lng: 127.6744,
        note: '15:00 可入住',
        tickets: null,
        tags: ['hotel'],
        transport: { mode: 'walk', duration: '10 分鐘', note: '步行前往國際通' },
        visited: false,
      },
      {
        id: 'd1-7',
        time: '21:00',
        title: '國際通',
        address: '日本沖繩縣那霸市',
        lat: 26.2154,
        lng: 127.6847,
        note: '視體力狀況調整，太累就把國際通移到第三天晚上',
        tickets: null,
        tags: ['attraction', 'shopping'],
        visited: false,
      },
    ],
  },
  {
    id: 'day-2',
    date: '2025-03-20',
    tabText: 'DAY 2',
    header: {
      title: 'DAY 2｜那霸市區・國際通・在地小吃',
      rhythm: '節奏：早上輕鬆逛街，中午吃在地料理，下午補貨；晚上看狀況加碼。',
    },
    items: [
      {
        id: 'd2-1',
        time: '10:00 - 11:30',
        title: '國際通散步',
        address: '沖縄県那覇市牧志3丁目',
        lat: 26.2154,
        lng: 127.6847,
        note: '建議：先買伴手禮，回程再補缺的。',
        tickets: null,
        tags: ['attraction', 'shopping'],
        transport: { mode: 'walk', duration: '15 分鐘', note: '步行前往餐廳' },
        visited: false,
      },
      {
        id: 'd2-2',
        time: '12:00 - 13:00',
        title: '午餐：沖繩麵',
        address: '沖縄県那覇市久茂地2丁目',
        lat: 26.2169,
        lng: 127.6786,
        tickets: null,
        tags: ['food'],
        visited: false,
      },
    ],
  },
]
