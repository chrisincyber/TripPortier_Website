export interface DeviceBrand {
  name: string
  models: string[]
}

export const ESIM_DEVICES: DeviceBrand[] = [
  {
    name: 'Apple',
    models: [
      'iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16',
      'iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15',
      'iPhone 14 Pro Max', 'iPhone 14 Pro', 'iPhone 14 Plus', 'iPhone 14',
      'iPhone 13 Pro Max', 'iPhone 13 Pro', 'iPhone 13 Mini', 'iPhone 13',
      'iPhone 12 Pro Max', 'iPhone 12 Pro', 'iPhone 12 Mini', 'iPhone 12',
      'iPhone 11 Pro Max', 'iPhone 11 Pro', 'iPhone 11',
      'iPhone SE (3rd gen)', 'iPhone SE (2nd gen)',
      'iPhone XS Max', 'iPhone XS', 'iPhone XR',
      'iPad Pro 12.9" (3rd gen+)', 'iPad Pro 11" (1st gen+)',
      'iPad Air (3rd gen+)', 'iPad Mini (5th gen+)', 'iPad (7th gen+)',
      'Apple Watch Series 3+',
    ],
  },
  {
    name: 'Samsung',
    models: [
      'Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25',
      'Galaxy S24 Ultra', 'Galaxy S24+', 'Galaxy S24', 'Galaxy S24 FE',
      'Galaxy S23 Ultra', 'Galaxy S23+', 'Galaxy S23', 'Galaxy S23 FE',
      'Galaxy S22 Ultra', 'Galaxy S22+', 'Galaxy S22',
      'Galaxy S21 Ultra', 'Galaxy S21+', 'Galaxy S21', 'Galaxy S21 FE',
      'Galaxy S20 Ultra', 'Galaxy S20+', 'Galaxy S20',
      'Galaxy Z Fold 6', 'Galaxy Z Fold 5', 'Galaxy Z Fold 4', 'Galaxy Z Fold 3', 'Galaxy Z Fold 2',
      'Galaxy Z Flip 6', 'Galaxy Z Flip 5', 'Galaxy Z Flip 4', 'Galaxy Z Flip 3',
      'Galaxy Note 20 Ultra', 'Galaxy Note 20',
      'Galaxy A55', 'Galaxy A54', 'Galaxy A35',
      'Galaxy Watch 4+',
    ],
  },
  {
    name: 'Google',
    models: [
      'Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 9a',
      'Pixel 8 Pro', 'Pixel 8', 'Pixel 8a',
      'Pixel 7 Pro', 'Pixel 7', 'Pixel 7a',
      'Pixel 6 Pro', 'Pixel 6', 'Pixel 6a',
      'Pixel 5', 'Pixel 5a',
      'Pixel 4 XL', 'Pixel 4', 'Pixel 4a',
      'Pixel 3 XL', 'Pixel 3', 'Pixel 3a',
      'Pixel Fold',
    ],
  },
  {
    name: 'Huawei',
    models: [
      'P60 Pro', 'P50 Pro', 'P40 Pro', 'P40',
      'Mate 50 Pro', 'Mate 40 Pro',
    ],
  },
  {
    name: 'Xiaomi',
    models: [
      'Xiaomi 14 Pro', 'Xiaomi 14', 'Xiaomi 13 Pro', 'Xiaomi 13',
      'Xiaomi 12T Pro', 'Xiaomi 12 Pro',
    ],
  },
  {
    name: 'Motorola',
    models: [
      'Razr+ (2024)', 'Razr (2024)', 'Razr+ (2023)', 'Razr (2023)', 'Razr (2022)',
      'Edge 50 Pro', 'Edge 40 Pro', 'Edge 40', 'Edge 30 Pro', 'Edge 30',
      'Moto G Stylus 5G (2024)',
    ],
  },
  {
    name: 'OnePlus',
    models: [
      'OnePlus 12', 'OnePlus 11', 'OnePlus Open',
      'OnePlus Nord 3',
    ],
  },
  {
    name: 'Sony',
    models: [
      'Xperia 1 VI', 'Xperia 1 V', 'Xperia 1 IV',
      'Xperia 5 V', 'Xperia 5 IV',
      'Xperia 10 VI', 'Xperia 10 V',
    ],
  },
  {
    name: 'Oppo',
    models: [
      'Find X7 Ultra', 'Find X6 Pro', 'Find X5 Pro',
      'Reno 10 Pro+', 'Reno 8 Pro+',
      'Find N3', 'Find N2 Flip',
    ],
  },
  {
    name: 'Nothing',
    models: [
      'Phone (2a)', 'Phone (2)', 'Phone (1)',
    ],
  },
  {
    name: 'Nokia',
    models: [
      'X30', 'XR21', 'G60',
    ],
  },
  {
    name: 'Microsoft',
    models: [
      'Surface Duo 2', 'Surface Duo',
      'Surface Pro (5G)',
    ],
  },
]
