export type LayerVisualKind =
  | 'archive'
  | 'reconstruction'
  | 'map'
  | 'modern';

export type LayerVisual = {
  fileName: string;
  title: string;
  note: string;
  credit: string;
  license: string;
  sourceUrl: string;
  kind: LayerVisualKind;
};

const visualKey = (placeId: string, year: string) => `${placeId}::${year}`;

export const LAYER_VISUALS: Record<string, LayerVisual> = {
  [visualKey('galata', '1348')]: {
    fileName: 'The Galata Tower (Buondelmonti, BNF).jpg',
    title: 'Galata Kulesi’nin erken dönem betimlemesi',
    note:
      '1348’e ait fotoğraf yoktur. Bu görsel 1465–1475 arasında kopyalanmış Buondelmonti haritasındaki kule betimlemesidir; ilk yapım dönemine en yakın tarihsel görsel referanslardan biridir.',
    credit: 'Cristoforo Buondelmonti / BnF / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:The_Galata_Tower_(Buondelmonti,_BNF).jpg',
    kind: 'archive',
  },
  [visualKey('galata', '1453')]: {
    fileName: 'The Galata Tower (Buondelmonti, BNF).jpg',
    title: '15. yüzyılda Galata Kulesi',
    note:
      'Görsel 1465–1475 tarihli bir elyazması kopyasındandır. 1453 anının birebir resmi değildir; fethin hemen sonrasındaki döneme yakın bir betimlemedir.',
    credit: 'Cristoforo Buondelmonti / BnF / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:The_Galata_Tower_(Buondelmonti,_BNF).jpg',
    kind: 'archive',
  },
  [visualKey('galata', '1875')]: {
    fileName: 'Galata Tower.jpg',
    title: '1875–1886 arasında Galata Kulesi',
    note:
      'Pascal Sébah’ın albümen baskısı, 1875 fırtınasında konik çatının yıkılmasından sonraki görünümü belgeliyor.',
    credit: 'Pascal Sébah / Cornell University Library / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Galata_Tower.jpg',
    kind: 'archive',
  },
  [visualKey('galata', '2020')]: {
    fileName: 'Galata Tower - Istanbul.jpg',
    title: 'Galata Kulesi’nin güncel görünümü',
    note:
      '2020’deki müze düzenlemesi sonrası dönemi temsil eden çağdaş fotoğraf.',
    credit: 'İlke.bahceci / Wikimedia Commons',
    license: 'CC0 1.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Galata_Tower_-_Istanbul.jpg',
    kind: 'modern',
  },

  [visualKey('ayasofya', '537')]: {
    fileName: 'Reconstruction drawing of the Hagia Sophia (02).jpg',
    title: 'Ayasofya’nın Bizans dönemine ait rekonstrüksiyonu',
    note:
      '537 yılına ait fotoğraf bulunmadığı için 19. yüzyılda hazırlanmış mimari rekonstrüksiyon kullanılıyor. Görsel, özgün Bizans kütlesini anlamaya yardımcı olan temsili bir çalışmadır.',
    credit: 'Unknown author / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Reconstruction_drawing_of_the_Hagia_Sophia_(02).jpg',
    kind: 'reconstruction',
  },
  [visualKey('ayasofya', '1453')]: {
    fileName:
      'Façade principale de Ste Sophie, prise de la cour du médressé - Fossati Gaspard - 1852.jpg',
    title: 'Osmanlı döneminde Ayasofya',
    note:
      '1453’ün birebir görüntüsü değildir. Fossati’nin 1852 tarihli çalışması, yapının Osmanlı dönemindeki görünümünü tarihsel bir belge olarak gösterir.',
    credit: 'Gaspard Fossati / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Façade_principale_de_Ste_Sophie,_prise_de_la_cour_du_médressé_-_Fossati_Gaspard_-_1852.jpg',
    kind: 'archive',
  },
  [visualKey('ayasofya', '1935')]: {
    fileName: 'Hagia Sophia. Fortepan 76187.jpg',
    title: 'Ayasofya, 1937',
    note:
      'Müze statüsünün başladığı 1935 katmanı için, iki yıl sonra çekilmiş 1937 tarihli arşiv fotoğrafı kullanılıyor.',
    credit: 'FOTO:FORTEPAN / PRL / Wikimedia Commons',
    license: 'CC BY-SA 3.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Hagia_Sophia._Fortepan_76187.jpg',
    kind: 'archive',
  },
  [visualKey('ayasofya', '2020')]: {
    fileName: 'Exterior of Hagia Sophia (1) - Istanbul (2022).jpg',
    title: 'Ayasofya’nın güncel dönemi',
    note:
      '2020 sonrası kullanım dönemini temsil eden 2022 tarihli çağdaş fotoğraf.',
    credit: 'ImanFakhri / Wikimedia Commons',
    license: 'CC BY-SA 4.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Exterior_of_Hagia_Sophia_(1)_-_Istanbul_(2022).jpg',
    kind: 'modern',
  },

  [visualKey('yerebatan', '6. yy')]: {
    fileName: 'Yere-Batan Sarai, Constantinople - Walsh Robert & Allom Thomas - 1836.jpg',
    title: 'Yerebatan Sarnıcı’nın erken tarihsel betimlemesi',
    note:
      '6. yüzyıla ait görsel kayıt bulunmadığı için 1836 tarihli Thomas Allom gravürü kullanılıyor. Bu, yapının modern fotoğraf öncesi en eski görsel belgelerinden biridir.',
    credit: 'Thomas Allom / Robert Walsh / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Yere-Batan_Sarai,_Constantinople_-_Walsh_Robert_%26_Allom_Thomas_-_1836.jpg',
    kind: 'archive',
  },
  [visualKey('yerebatan', 'Osmanlı')]: {
    fileName: 'Yere-Batan Sarai, Constantinople - Walsh Robert & Allom Thomas - 1836.jpg',
    title: 'Osmanlı döneminde Yerebatan',
    note:
      '1836 tarihli gravür, sarnıcın Osmanlı dönemindeki görünümünü tarihsel bir çizim üzerinden belgelemektedir.',
    credit: 'Thomas Allom / Robert Walsh / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:Yere-Batan_Sarai,_Constantinople_-_Walsh_Robert_%26_Allom_Thomas_-_1836.jpg',
    kind: 'archive',
  },
  [visualKey('yerebatan', '1987')]: {
    fileName: 'CisternIstanbul.jpg',
    title: 'Modern ziyaret dönemindeki Yerebatan',
    note:
      '1987’de ziyarete açılan sarnıcın modern müze dönemini temsil eden fotoğraf.',
    credit: 'Spiderone / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:CisternIstanbul.jpg',
    kind: 'modern',
  },
  [visualKey('yerebatan', '2022')]: {
    fileName: 'CisternIstanbul.jpg',
    title: 'Yerebatan’ın güncel müze dönemi',
    note:
      '2022 restorasyonu sonrasındaki deneyimi temsil etmek için güncel sarnıç görünümü kullanılıyor.',
    credit: 'Spiderone / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:CisternIstanbul.jpg',
    kind: 'modern',
  },

  [visualKey('balat', '15–16. yy')]: {
    fileName: "27 Balat - Corne d'Or - J. Pervititch - btv1b10100712w.jpg",
    title: 'Balat’ın tarihsel kentsel dokusunu okuma',
    note:
      '15–16. yüzyıla ait sokak fotoğrafı yoktur. 1929 Pervititch haritası, tarihsel parsel ve sokak dokusunu okumak için kullanılan arşiv belgesidir.',
    credit: 'Jacques Pervititch / BnF / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:27_Balat_-_Corne_d'Or_-_J._Pervititch_-_btv1b10100712w.jpg",
    kind: 'map',
  },
  [visualKey('balat', '19. yy')]: {
    fileName: "28 Balat - Corne d'Or - J. Pervititch - btv1b10100713b.jpg",
    title: 'Balat’ın tarihsel mahalle planı',
    note:
      '19. yüzyılın birebir fotoğrafı yerine, eski yapı ve sokak dokusunu gösteren 1928 tarihli Pervititch haritası kullanılıyor.',
    credit: 'Jacques Pervititch / BnF / Wikimedia Commons',
    license: 'Public domain',
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:28_Balat_-_Corne_d'Or_-_J._Pervititch_-_btv1b10100713b.jpg",
    kind: 'map',
  },
  [visualKey('balat', '2003–08')]: {
    fileName: 'Balat.jpg',
    title: 'Balat, 2004',
    note:
      'Fener-Balat rehabilitasyon programının yürütüldüğü yıllardan 2004 tarihli bir mahalle fotoğrafı.',
    credit: 'Michele C. / Wikimedia Commons',
    license: 'CC BY 2.0',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Balat.jpg',
    kind: 'archive',
  },
  [visualKey('balat', 'Bugün')]: {
    fileName: 'IstanbulBalatStreet.jpg',
    title: 'Balat’ın güncel görünümü',
    note:
      'Mahallenin güncel sokak dokusunu temsil eden çağdaş fotoğraf.',
    credit: 'Mondo79 / Wikimedia Commons',
    license: 'CC BY 2.0',
    sourceUrl:
      'https://commons.wikimedia.org/wiki/File:IstanbulBalatStreet.jpg',
    kind: 'modern',
  },
};

export function getLayerVisual(placeId: string, year: string) {
  return LAYER_VISUALS[visualKey(placeId, year)] ?? null;
}

export function getLayerVisualUrl(visual: LayerVisual) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    visual.fileName,
  )}?width=1400`;
}

export function getLayerVisualKindLabel(kind: LayerVisualKind) {
  if (kind === 'reconstruction') return 'REKONSTRÜKSİYON';
  if (kind === 'map') return 'ARŞİV HARİTASI';
  if (kind === 'modern') return 'GÜNCEL GÖRÜNÜM';
  return 'ARŞİV GÖRSELİ';
}
