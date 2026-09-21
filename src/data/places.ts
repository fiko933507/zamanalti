export type TimeLayer = {
  year: string;
  label: string;
};

export type Place = {
  id: string;
  name: string;
  district: string;
  hook: string;
  glyph: string;
  distance: string;
  layers: TimeLayer[];
};

export const PLACES: Place[] = [
  {
    id: 'galata',
    name: 'Galata Kulesi',
    district: 'Beyoğlu',
    hook: 'Aynı silüet, yüzyıllar boyunca değişen şehir.',
    glyph: 'G',
    distance: '1,2 km',
    layers: [
      { year: '1348', label: 'Ceneviz Kulesi' },
      { year: '1453', label: 'Osmanlı İstanbul’u' },
      { year: '1875', label: 'Fırtına ve dönüşüm' },
      { year: 'Bugün', label: 'Şehrin hafızası' },
    ],
  },
  {
    id: 'ayasofya',
    name: 'Ayasofya',
    district: 'Fatih',
    hook: 'Tek yapıda imparatorlukların, inançların ve insanların izleri.',
    glyph: 'A',
    distance: '3,8 km',
    layers: [
      { year: '537', label: 'İlk açılış' },
      { year: '1204', label: 'Latin dönemi' },
      { year: '1453', label: 'Osmanlı dönemi' },
      { year: '1935', label: 'Müze dönemi' },
    ],
  },
  {
    id: 'yerebatan',
    name: 'Yerebatan Sarnıcı',
    district: 'Fatih',
    hook: 'Şehrin altında suyun, taşın ve sessizliğin hikâyesi.',
    glyph: 'Y',
    distance: '3,6 km',
    layers: [
      { year: '532', label: 'İnşa dönemi' },
      { year: '1500’ler', label: 'Yeniden keşif' },
      { year: '1987', label: 'Ziyarete açılış' },
      { year: 'Bugün', label: 'Yeraltı katmanı' },
    ],
  },
  {
    id: 'balat',
    name: 'Balat',
    district: 'Fatih',
    hook: 'Sokakların üst üste biriktirdiği gündelik hayat katmanları.',
    glyph: 'B',
    distance: '4,1 km',
    layers: [
      { year: '1400’ler', label: 'Mahalle hafızası' },
      { year: '1600’ler', label: 'Çok kültürlü yaşam' },
      { year: '1900’ler', label: 'Dönüşen sokaklar' },
      { year: 'Bugün', label: 'Yaşayan arşiv' },
    ],
  },
];
