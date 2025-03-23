export interface Event {
  id: number;
  image: string;
  name: string;
  description: string;
  rating: number;
  images: string[];
  link: string;
}

export interface Category {
  id: number;
  name: string;
  events: Event[];
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Phones',
    events: [
      {
        id: 1,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/h55/h07/86302551834654.jpg?format=gallery-medium',
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone with A16 Bionic chip.',
        rating: 4.8,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/h70/h22/86319889317918.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h57/h54/86319889350686.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h7c/hb6/86319889383454.jpg?format=gallery-medium'
        ],
        link: 'https://kaspi.kz/shop/p/apple-iphone-15-pro-128gb-sinii-113138222/?c=750000000',
      },
      {
        id: 2,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/h5e/h53/69635680763934.jpg?format=gallery-medium',
        name: 'Samsung Galaxy S23 Ultra',
        description: 'Flagship Android phone with Snapdragon 8 Gen 2.',
        rating: 4.7,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/he0/hae/69635684892702.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/hc7/hdc/69635685416990.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h9e/h60/69635687514142.jpg?format=gallery-medium'
        ],
        link: 'https://kaspi.kz/shop/p/samsung-galaxy-s23-ultra-12-gb-256-gb-chernyi-109174566/?c=750000000',
      },
      {
        id: 3,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/h32/h70/84378448199710.jpg?format=gallery-medium',
        name: 'iPhone 13',
        description: 'Latest iPhone with A16 Bionic chip.',
        rating: 4.8,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/h35/h8f/84378448232478.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h3d/h8e/64208874405918.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/hfe/h17/64208876634142.jpg?format=gallery-medium'
        ],
        link: 'https://kaspi.kz/shop/p/apple-iphone-13-128gb-chernyi-102298404/?c=750000000',
      },
      {
        id: 4,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/hcf/h1c/84932692574238.jpg?format=gallery-medium',
        name: 'Samsung Galaxy A25',
        description: 'Latest iPhone with A16 Bionic chip.',
        rating: 4.8,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/h20/h07/84932660559902.png?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h49/hdd/84932660625438.png?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/hb4/h8d/84932660953118.png?format=gallery-medium'
        ],
        link: 'https://kaspi.kz/shop/p/samsung-galaxy-a25-5g-6-gb-128-gb-temno-sinii-115937459/?c=750000000',
      },
      {
        id: 5,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/h1b/h77/84526902706206.jpg?format=gallery-medium',
        name: 'Xiaomi Redmi 13C',
        description: 'Latest iPhone with A16 Bionic chip.',
        rating: 4.8,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/h0f/h2d/84526902837278.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h6b/h15/84957845585950.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/hb3/h82/84957845717022.jpg?format=gallery-medium'
        ],
        link: 'https://kaspi.kz/shop/p/xiaomi-redmi-13c-8-gb-256-gb-chernyi-114695323/?c=750000000',
      },
    ]
  },
  {
    id: 2,
    name: 'Watches',
    events: [
      {
        id: 6,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/hec/h25/87197780049950.jpg?format=gallery-medium',
        name: 'Xiaomi Redmi Watch 5',
        description: 'Good new watch for their money.',
        rating: 4.6,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/h5b/h70/87197780181022.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h5e/hf2/87197780312094.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/ha6/h60/87197780443166.jpg?format=gallery-medium'
        ],
        link: 'https://kaspi.kz/shop/p/xiaomi-redmi-watch-5-active-51-mm-chernyi-chernyi-123879372/?c=750000000',
      },
      {
        id: 7,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/p55/p9b/5542335.png?format=gallery-medium',
        name: 'Apple Watch SE 2',
        description: 'Good new watch for their money.',
        rating: 4.6,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/pe4/p9a/5542339.png?format=gallery-medium',
          'https://jmart.kz/_next/image?url=https%3A%2F%2Fjmart.kz%2Fimages%2Fdetailed%2F6196%2F83874217525278-product-651a8963cb85e1.90951292.jpg&w=3840&q=50',
          'https://resources.cdn-kaspi.kz/img/m/p/p78/p98/5542340.png?format=gallery-medium '
        ],
        link: 'https://kaspi.kz/shop/p/apple-watch-se-gps-gen-2-2024-s-m-40-mm-bezhevyi-129172890/?c=750000000',
      },
      {
        id: 8,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/h76/h31/82569351266334.jpg?format=gallery-medium',
        name: 'Samsung Galaxy Watch 6',
        description: 'Good new watch for their money.',
        rating: 4.6,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/hb6/hc3/82569351299102.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/hd6/haf/82569351331870.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/ha5/h47/82569351364638.jpg?format=gallery-medium'
        ],
        link: 'https://kaspi.kz/shop/p/samsung-galaxy-watch6-44-mm-grafitovyi-chernyi-112368202/?c=750000000',
      }
    ]
  },
  {
    id: 3,
    name: 'Tablets',
    events: [
      {
        id: 11,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/hb3/h75/86106948239390.png?format=gallery-medium',
        name: 'Apple iPad Pro 2024',
        description: 'Latest Apple tablet with advanced features.',
        rating: 4.9,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/h27/h89/86106948272158.png?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h90/hc6/86106948304926.png?format=gallery-medium',
          'data:image/jpeg;base64,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'
        ],
        link: 'https://kaspi.kz/shop/p/apple-ipad-pro-2024-wi-fi-11-11-djuim-8-gb-256-gb-chernyi-119774227/?c=750000000'
      },
      {
        id: 12,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/p43/pd0/4510378.png?format=gallery-medium',
        name: 'Samsung Galaxy Tab S10+',
        description: 'Latest Samsung tablet with advanced features.',
        rating: 4.9,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/pf5/pcc/4510387.png?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/p34/pca/4510391.png?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/p8b/pc9/4510397.png?format=gallery-medium'
        ],
        link:'https://kaspi.kz/shop/p/samsung-galaxy-tab-s10-sm-x826bzarskz-12-4-djuim-12-gb-256-gb-seryi-128880949/?c=750000000'
      }
    ]
  },
  {
    id: 4,
    name: 'Laptops',
    events: [
      {
        id: 16,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/hf4/h52/64509322919966.jpg?format=gallery-medium',
        name: 'Apple MacBook Air 13 2022 13.6"',
        description: 'Powerful Apple laptop.',
        rating: 4.7,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/h86/h70/64509325803550.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h45/hb7/64509328457758.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h8e/h0c/64509330030622.jpg?format=gallery-medium'
        ],
        link: 'https://kaspi.kz/shop/p/apple-macbook-air-13-2022-13-6-8-gb-ssd-256-gb-macos-mlxw3-105933794/?c=750000000'
      },
      {
        id: 17,
        image: 'https://resources.cdn-kaspi.kz/img/m/p/h73/h87/63947822596126.jpg?format=gallery-medium',
        name: 'Apple MacBook Air 13 2020 13.3"',
        description: 'Apple laptop.',
        rating: 4.7,
        images: [
          'https://resources.cdn-kaspi.kz/img/m/p/h27/hec/63947824496670.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/h16/h90/63947827478558.jpg?format=gallery-medium',
          'https://resources.cdn-kaspi.kz/img/m/p/hc3/h83/63947832557598.jpg?format=gallery-medium'
        ],
        link: 'https://kaspi.kz/shop/p/apple-macbook-air-13-2020-13-3-8-gb-ssd-256-gb-macos-mgn63-100797845/?c=750000000'
      },
    ]
  }
];
