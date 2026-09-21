export type TimeLayer = {
  year: string;
  label: string;
  body: string;
};

export type PlaceSource = {
  label: string;
  url: string;
};

export type NarrationChapter = {
  title: string;
  body: string;
};

export type Place = {
  id: string;
  name: string;
  district: string;
  city: string;
  hook: string;
  glyph: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  summary: string;
  facts: string[];
  layers: TimeLayer[];
  chapters: NarrationChapter[];
  sources: PlaceSource[];
};

export const PLACES: Place[] = [
  {
    id: 'galata',
    name: 'Galata Kulesi',
    district: 'Beyoğlu',
    city: 'İstanbul',
    hook: 'Bir Ceneviz gözetleme kulesinden İstanbul’un simge müzelerinden birine uzanan yaklaşık yedi yüzyıllık dönüşüm.',
    glyph: 'G',
    coordinates: {
      latitude: 41.0256,
      longitude: 28.9742,
    },
    summary:
      'Bugün gördüğümüz Galata Kulesi’nin inşası 1348’e uzanır. Ceneviz kolonisi Galata’nın sur sisteminin parçası olarak yükselen yapı, Osmanlı döneminde farklı işlevler üstlendi; yangınlar, depremler ve fırtınalarla defalarca değişti. 2020’de tamamlanan çalışmaların ardından müze işleviyle yeniden ziyarete açıldı.',
    facts: [
      'Bugünkü kulenin inşası 1348 yılına tarihlenir.',
      'Kule, Galata surlarının gözetleme kulesi olarak inşa edildi.',
      '1875’teki fırtına kulenin çatısını devirdi.',
      '2020’de yeniden düzenlenerek müze olarak ziyarete açıldı.',
    ],
    layers: [
      {
        year: '1348',
        label: 'Ceneviz Kulesi',
        body:
          'Cenevizliler, Galata’daki savunma sistemlerini 14. yüzyıl ortalarında güçlendirirken bugünkü kulenin inşasını 1348’de tamamladı. Yapı, Galata surlarının yüksek bir gözetleme noktasıydı.',
      },
      {
        year: '1453',
        label: 'Osmanlı Dönemi',
        body:
          'İstanbul’un fethinden sonra Galata Osmanlı yönetimine geçti. Kule ilerleyen yüzyıllarda zindan ve yangın gözetleme noktası gibi farklı amaçlarla kullanıldı; yangın ve depremler sonrasında birden fazla kez onarıldı.',
      },
      {
        year: '1875',
        label: 'Fırtına ve Değişim',
        body:
          '1875’teki şiddetli fırtına kulenin çatısını devirdi. Üst bölüm daha sonra yeniden düzenlendi; kulenin silüeti tarih boyunca onarımlar ve kullanım ihtiyaçlarıyla birkaç kez değişti.',
      },
      {
        year: '2020',
        label: 'Müze Olarak Yeniden Açılış',
        body:
          '2020’de yürütülen restorasyon ve düzenleme çalışmaları sonrasında Galata Kulesi müze işleviyle yeniden açıldı. Yapı bugün İstanbul’un farklı dönemlerine ait eser ve anlatıları da barındırıyor.',
      },
    ],
    chapters: [
      {
        title: 'Tepeye neden bir kule yapıldı?',
        body:
          'Galata Kulesi’ne bakarken önce bulunduğu tepeyi fark etmek gerekir. Orta Çağ’da Haliç’in kuzeyinde Cenevizlilerin yönettiği Galata kolonisi bulunuyordu. Ticaret yollarını, limanı ve sur hattını gözlemek için yüksek noktalar önemliydi. Bugün bildiğimiz kulenin inşası 1348 yılına dayanır ve yapı Galata sur sisteminin bir parçasıydı. Silindirik taş gövdesi yalnızca bir anıt değil, aynı zamanda savunma ve gözetleme düzeninin çalışan bir öğesiydi. Bugün etrafını saran sokaklar kuleyi bağımsız bir yapı gibi gösterse de ilk döneminde onu çevreleyen surlar, kapılar ve ticaret dokusuyla birlikte düşünmek gerekir.',
      },
      {
        title: '1453’ten sonra değişen görevler',
        body:
          'İstanbul’un 1453’te Osmanlılar tarafından alınmasından sonra Galata da Osmanlı yönetimine geçti. Kule varlığını sürdürdü fakat işlevi sabit kalmadı. Kaynaklarda farklı dönemlerde zindan olarak kullanıldığı, daha sonra yangın gözetleme görevine hizmet ettiği anlatılır. İstanbul gibi ahşap yapıların yoğun olduğu bir kentte yangınlar büyük tehlikeydi. Bu nedenle yüksek bir kule, yalnızca manzara değil erken uyarı imkânı da sağlıyordu. Yapının bugüne kadar ulaşabilmesinin arkasında, her dönemin onu kendi ihtiyacına göre yeniden kullanması ve onarması bulunuyor.',
      },
      {
        title: 'Yangınlar, deprem ve fırtına',
        body:
          'Galata Kulesi’nin görünümü yüzyıllar boyunca aynı kalmadı. 1509 depreminden sonra onarıldı; 1794 ve 1831 yangınları üst bölümlerde yeni düzenlemelere yol açtı. 1875’te bir fırtına çatıyı devirdi. Bu olayların her biri kulenin silüetini değiştirdi. Bu nedenle bugün gördüğümüz biçimi tek bir tarihin ürünü olarak düşünmek yanıltıcı olur. ZAMANALTI’nda bu katmanların amacı tam da budur: aynı taş gövdenin üzerinde, doğal afetlerin, şehir ihtiyaçlarının ve mimari tercihlerin bıraktığı farklı izleri birlikte görebilmek.',
      },
      {
        title: '20. yüzyılda yeniden keşif',
        body:
          '20. yüzyıl ortalarına gelindiğinde kule yıpranmış durumdaydı. 1965 ile 1967 arasında yapılan kapsamlı restorasyonla turistik kullanıma uygun biçimde düzenlendi ve çatısı tarihsel görünümüne yaklaşacak şekilde yenilendi. Böylece kule, savunma ya da yangın gözetleme yapısından kent manzarasının izlendiği bir ziyaret noktasına dönüştü. Bu değişim, İstanbul’un tarihî yapılarına bakışındaki dönüşümü de gösterir: günlük işlevi azalan bir yapı, kültürel miras ve kent belleği açısından yeni bir değer kazanmıştır.',
      },
      {
        title: 'Bugünkü Galata',
        body:
          '2020’deki çalışmaların ardından kule müze olarak yeniden açıldı. Günümüzde ziyaretçi yalnızca İstanbul panoramasını görmez; kulenin içinde kentin farklı dönemlerine ilişkin anlatılar ve eserlerle de karşılaşır. Yapının güçlü etkisi, tek bir tarih anlatısından değil, katmanların üst üste gelmesinden doğar. Ceneviz savunması, Osmanlı şehir güvenliği, afetler, restorasyonlar ve modern müzecilik aynı yapının içinde buluşur. Dışarı çıktığında kuleye tekrar bak: taş gövdenin sabit, işlevlerin ise sürekli değişmiş olduğunu düşün.',
      },
    ],
    sources: [
      {
        label: 'T.C. Kültür ve Turizm Bakanlığı — Galata Kulesi',
        url: 'https://muze.gov.tr/muze-detay?distid=mrk&sectionid=glt04',
      },
      {
        label: 'T.C. Kültür ve Turizm Bakanlığı — Galata Kulesi bilgi dosyası',
        url: 'https://muze.gov.tr/s3/MysFileLibrary/6c1a430e-5fee-4d05-b6e3-7969e1ecc919.pdf',
      },
    ],
  },
  {
    id: 'ayasofya',
    name: 'Ayasofya',
    district: 'Fatih',
    city: 'İstanbul',
    hook: '6. yüzyıldan bugüne ibadet, imparatorluk, mimarlık ve koruma tarihinin aynı yapıdaki kesişimi.',
    glyph: 'A',
    coordinates: {
      latitude: 41.0086,
      longitude: 28.9802,
    },
    summary:
      'Ayasofya, İmparator I. Justinianus döneminde 532–537 yılları arasında inşa edildi. 1453’te camiye çevrildi, 1935’te müze olarak açıldı ve 2020’de yeniden cami statüsüne geçti. UNESCO, Ayasofya’yı İstanbul’un Tarihî Alanları Dünya Mirası bileşenleri arasında değerlendirir.',
    facts: [
      'Bugünkü yapı 532–537 yıllarında inşa edildi.',
      'Mimarları Anthemios ve Isidoros olarak bilinir.',
      '1453’te camiye dönüştürüldü.',
      '1935–2020 arasında müze olarak hizmet verdi; 2020’de yeniden cami statüsüne geçti.',
    ],
    layers: [
      {
        year: '537',
        label: 'İmparatorluk Kilisesi',
        body:
          'I. Justinianus’un emriyle 532–537 arasında inşa edilen yapı, büyük kubbesi ve taşıyıcı sistemiyle Bizans mimarlığının en etkili örneklerinden biri hâline geldi.',
      },
      {
        year: '1453',
        label: 'Camiye Dönüşüm',
        body:
          'İstanbul’un Osmanlılar tarafından alınmasının ardından Ayasofya camiye dönüştürüldü. Sonraki yüzyıllarda minareler, payandalar ve farklı Osmanlı dönemi ekleri yapının tarihine katıldı.',
      },
      {
        year: '1935',
        label: 'Müze Dönemi',
        body:
          'Ayasofya 1935’te müze olarak ziyarete açıldı. Bu dönemde yapı, mimari ve sanat tarihi açısından uluslararası ölçekte incelenen ve ziyaret edilen bir kültür mirası alanı oldu.',
      },
      {
        year: '2020',
        label: 'Yeniden Cami',
        body:
          '2020’de Ayasofya yeniden cami statüsüne geçti. Yapı, İstanbul’un Tarihî Alanları Dünya Mirası kapsamındaki önemini korumaya devam ediyor.',
      },
    ],
    chapters: [
      {
        title: '532’de başlayan büyük inşa',
        body:
          'Bugünkü Ayasofya, 6. yüzyılda İmparator I. Justinianus döneminde inşa edildi. Yapım 532’de başladı ve 537’de tamamlandı. Tasarımın arkasında Anthemios ve Isidoros bulunuyordu. Yapının en çarpıcı özelliği, devasa iç mekânı örten kubbenin oluşturduğu açıklık hissidir. Ayasofya’yı gezerken taş duvarlardan çok ışığın ve boşluğun nasıl düzenlendiğine dikkat et. Kubbe, yarım kubbeler ve taşıyıcı ayaklar yalnızca mühendislik çözümü değil, dönemin imparatorluk temsilinin de parçasıydı.',
      },
      {
        title: 'Mimarlığın başka yapılara etkisi',
        body:
          'Ayasofya yalnızca kendi döneminin büyük bir yapısı olarak kalmadı. UNESCO, onun daha sonra inşa edilen çok sayıda kilise ve cami üzerinde etkili olduğunu vurgular. Büyük merkezi kubbe fikri, mekânın ışıkla kurulması ve anıtsal iç hacim yüzyıllar boyunca mimarlar için referans oldu. Bu yüzden Ayasofya’ya tek bir dinî yapının tarihi olarak değil, mimarlık fikirlerinin farklı coğrafyalara taşındığı bir düğüm noktası olarak da bakılabilir.',
      },
      {
        title: '1453 ve Osmanlı katmanı',
        body:
          '1453’te İstanbul’un Osmanlılar tarafından alınmasının ardından Ayasofya camiye çevrildi. Bu dönüşüm yapının kullanımını değiştirdi, fakat eski mimari gövde korunarak yeni unsurlar eklendi. Minareler, mihrap, minber ve farklı dönemlerde yapılan güçlendirmeler, yapının Osmanlı katmanını oluşturdu. Ayasofya’nın bugün bu kadar karmaşık görünmesinin nedeni, eski öğelerin silinmesi değil; farklı dönemlerin aynı yapının üzerinde birikmesidir.',
      },
      {
        title: '1935’ten 2020’ye müze',
        body:
          'Ayasofya 1935’te müze olarak açıldı. Bu dönemde hem Bizans hem Osmanlı dönemlerine ait unsurların birlikte incelenmesi, korunması ve ziyaretçilere sunulması öne çıktı. Yapı aynı zamanda İstanbul’un 1985’te Dünya Mirası Listesi’ne giren tarihî alanlarının en güçlü simgelerinden biri oldu. Müze dönemi, Ayasofya’nın dünya çapında sanat tarihi, mimarlık ve koruma tartışmalarının merkezinde kalmasını sağladı.',
      },
      {
        title: '2020 sonrası yaşayan miras',
        body:
          '2020’de Ayasofya yeniden cami statüsüne geçti. Bugün yapı hem aktif bir ibadet mekânı hem de dünya çapında kültürel miras değeri taşıyan tarihî bir anıttır. Bu iki özellik, koruma ve ziyaret yönetimi açısından özel bir denge gerektirir. Buradan ayrılırken tek bir “doğru dönem” aramak yerine, 6. yüzyıldan 21. yüzyıla kadar yapının üstlendiği farklı rollerin aynı mekânda nasıl yan yana durduğunu düşün.',
      },
    ],
    sources: [
      {
        label: 'UNESCO — Historic Areas of Istanbul',
        url: 'https://whc.unesco.org/en/list/356',
      },
      {
        label: 'UNESCO — Ayasofya hakkında 2020 açıklaması',
        url: 'https://whc.unesco.org/en/news/2156',
      },
    ],
  },
  {
    id: 'yerebatan',
    name: 'Yerebatan Sarnıcı',
    district: 'Fatih',
    city: 'İstanbul',
    hook: 'Şehrin altında su, devşirme taşlar ve 336 sütunla kurulan 6. yüzyıl mühendisliği.',
    glyph: 'Y',
    coordinates: {
      latitude: 41.00848,
      longitude: 28.97838,
    },
    summary:
      'Yerebatan Sarnıcı, 6. yüzyılda I. Justinianus döneminde Büyük Saray ve çevresine su sağlamak amacıyla inşa edildi. Yaklaşık 10 bin metrekarelik yapının tonozlarını 336 sütun taşır. 1985–1987 çalışmalarında Medusa başı blokları görünür hâle geldi; sarnıç 2022’de kapsamlı restorasyonun ardından yeniden açıldı.',
    facts: [
      'Sarnıç 6. yüzyılda I. Justinianus döneminde inşa edildi.',
      'İçeride 336 mermer sütun bulunur.',
      'Yaklaşık 80 bin metreküp su depolama kapasitesine sahiptir.',
      '22 Temmuz 2022’de kapsamlı restorasyonun ardından yeniden ziyarete açıldı.',
    ],
    layers: [
      {
        year: '6. yy',
        label: 'Büyük Saray’ın Su Deposu',
        body:
          'Sarnıç I. Justinianus döneminde, Büyük Saray ve çevresindeki yapılara su sağlamak amacıyla inşa edildi. Dev tonoz sistemi 336 mermer sütunla taşınır.',
      },
      {
        year: 'Osmanlı',
        label: 'Onarımlar ve Kent Yaşamı',
        body:
          'Osmanlı döneminde sarnıç tamamen unutulmadı; farklı dönemlerde onarımlar gördü. 16. yüzyılda İstanbul’u inceleyen Petrus Gyllius, sarnıcın suyu ve sütunları hakkında ayrıntılı gözlemler kaydetti.',
      },
      {
        year: '1987',
        label: 'Ziyarete Açılış',
        body:
          '1985–1987 arasında İstanbul Büyükşehir Belediyesi tarafından kapsamlı temizlik ve onarım yapıldı. Medusa başı kabartmalı iki büyük blok görünür hâle getirildi ve sarnıç ziyaretçilere açıldı.',
      },
      {
        year: '2022',
        label: 'Yeni Restorasyon',
        body:
          'İBB Miras tarafından yürütülen kapsamlı restorasyonla yapı deprem riskine karşı güçlendirildi, dolaşım düzeni yenilendi ve sarnıç 22 Temmuz 2022’de yeniden ziyarete açıldı.',
      },
    ],
    chapters: [
      {
        title: 'Yeraltında neden bu kadar büyük bir yapı var?',
        body:
          'Yerebatan Sarnıcı, 6. yüzyılda Konstantinopolis’in anıtsal merkezinde inşa edildi. Amaç Büyük Saray ve çevresindeki yapıların su ihtiyacını güvence altına almaktı. Yaklaşık on bin metrekareye yayılan bu yeraltı hacmi, yalnızca su depolayan bir tank değil; kentin altyapısının dev bir parçasıydı. Yukarıdaki meydanlar, saraylar ve yollar gündelik hayatı taşırken, yerin altında görünmeyen bir su sistemi çalışıyordu. ZAMANALTI için Yerebatan’ın özel olmasının nedeni de bu: şehrin görünen yüzünün altında gerçekten başka bir şehir sistemi bulunuyor.',
      },
      {
        title: '336 sütunun oluşturduğu ritim',
        body:
          'Sarnıcın tonozlarını 336 sütun taşır. Sütunlar 12 sıra hâlinde düzenlenmiştir ve her sırada 28 sütun bulunur. Birçoğu farklı mermer türlerinden yapılmış, bazı mimari parçalar ise daha eski yapılardan getirilerek yeniden kullanılmıştır. Bu tekrar düzeni, mekânın neredeyse sonsuzmuş gibi algılanmasına yol açar. Sütunlara tek tek bakmak yerine aralarındaki aralıkları ve tavandaki kemerlerin ritmini izle. Yapının mühendisliği, görsel etkisinin doğrudan kaynağıdır.',
      },
      {
        title: 'Medusa başları ne anlatıyor?',
        body:
          'Sarnıcın en tanınmış parçaları, iki sütunun altında kaide olarak kullanılan Medusa başı kabartmalı bloklardır. Biri yana, diğeri ters çevrilmiş durumdadır. Bu yerleşim hakkında pek çok efsane anlatılsa da kesin neden bilinmez. Arkeolojik açıdan önemli olan nokta, bu blokların başka yapılardan alınarak sarnıçta yeni bir işleve kavuşmuş olmasıdır. Yani Medusa başları, antik kentte malzemenin yeniden kullanımına dair güçlü örneklerdir.',
      },
      {
        title: '1987’de görünür olan yeraltı mirası',
        body:
          '1985 ile 1987 arasındaki kapsamlı çalışmalar, sarnıcın modern ziyaret deneyimi açısından önemli bir dönüm noktası oldu. Yapı temizlendi, onarıldı ve ziyaret rotası oluşturuldu. Medusa başı blokları da bu süreçte görünür hâle geldi. Böylece yüzyıllarca altyapı olarak çalışan yeraltı hacmi, kentin en çok ziyaret edilen kültür mirası alanlarından birine dönüştü.',
      },
      {
        title: '2022 restorasyonu ve bugünkü deneyim',
        body:
          '2022’de tamamlanan restorasyon, sarnıcı yalnızca estetik olarak yenilemek yerine yapısal güvenliği de güçlendirmeyi hedefledi. İBB Miras ekipleri olası deprem risklerine karşı müdahaleler yaptı ve ziyaret dolaşımını yeniledi. Bugün sarnıç hem tarihî altyapı yapısı hem de çağdaş sergi ve kültür etkinliklerine ev sahipliği yapan bir müze alanı. Yerden yükselen sütunlara bakarken, aslında İstanbul’un görünmeyen altyapı tarihinin içinde yürüdüğünü hatırla.',
      },
    ],
    sources: [
      {
        label: 'Kültür AŞ — Yerebatan Sarnıcı',
        url: 'https://kultur.istanbul/yerebatan-sarnici-muzesi/',
      },
      {
        label: 'İBB — 2022 Yerebatan restorasyonu',
        url: 'https://istanbulseninhaber.ibb.istanbul/haber-detay/yerebatan-sarnici-restorasyonu-tamamlandi',
      },
    ],
  },
  {
    id: 'balat',
    name: 'Balat',
    district: 'Fatih',
    city: 'İstanbul',
    hook: 'Haliç kıyısında Yahudi, Rum ve Müslüman toplulukların izlerini taşıyan yaşayan mahalle dokusu.',
    glyph: 'B',
    coordinates: {
      latitude: 41.0320,
      longitude: 28.9483,
    },
    summary:
      'Balat, Haliç kıyısında Fener ile Ayvansaray arasında yer alan tarihî bir mahalledir. Yüzyıllar boyunca özellikle Yahudi nüfusun önemli merkezlerinden biri olmuş, aynı zamanda farklı inanç ve toplulukların yan yana yaşadığı bir kentsel doku geliştirmiştir. Fener-Balat bölgesi 2000’lerde Avrupa Birliği destekli ve UNESCO’nun katkıda bulunduğu kapsamlı bir rehabilitasyon programına konu oldu.',
    facts: [
      'Balat, Haliç kıyısında Fatih ilçesinde yer alır.',
      'Mahalle tarihsel olarak İstanbul’un önemli Yahudi yerleşimlerinden biridir.',
      '19. yüzyıl kent dokusunun önemli örneklerini barındırır.',
      'Fener-Balat rehabilitasyon programında 121 tarihî yapı restore edildi.',
    ],
    layers: [
      {
        year: '15–16. yy',
        label: 'Yahudi Mahallesi',
        body:
          'Osmanlı döneminde Balat, özellikle İber Yarımadası’ndan gelen Sefarad Yahudilerinin yerleştiği önemli merkezlerden biri oldu. Mahalle zamanla farklı toplulukların yan yana yaşadığı yoğun bir kentsel doku geliştirdi.',
      },
      {
        year: '19. yy',
        label: 'Yoğun Kent Dokusu',
        body:
          'Bugün Balat ve Fener’de görülen çok katlı tarihî yapıların önemli bölümü 19. yüzyıl kentsel dokusunu yansıtır. Konutlar, ibadethaneler, dükkânlar ve eğimli sokaklar birlikte mahalle kimliğini oluşturdu.',
      },
      {
        year: '2003–08',
        label: 'Fener-Balat Rehabilitasyonu',
        body:
          'Avrupa Birliği finansmanı ve UNESCO’nun desteğiyle yürütülen Fener-Balat rehabilitasyon programında konutlar, dükkânlar ve sosyal merkezler dâhil 121 tarihî yapı restore edildi.',
      },
      {
        year: 'Bugün',
        label: 'Yaşayan Mahalle',
        body:
          'Balat günümüzde hem yerel yaşamın sürdüğü bir mahalle hem de tarihî mimarisi nedeniyle yoğun ziyaret alan bir bölgedir. Koruma, turizm ve mahalle yaşamı arasındaki denge güncel tartışmaların merkezindedir.',
      },
    ],
    chapters: [
      {
        title: 'Balat’ı bir açık hava dekoru gibi görme',
        body:
          'Balat’a gelen ziyaretçi çoğu zaman renkli cepheleri ve dar sokakları fark eder. Fakat burası yalnızca fotoğraf çekilecek bir tarihî dekor değil, yüzyıllardır yaşayan bir mahalledir. Haliç kıyısındaki konumu ticaret, göç ve gündelik hayatı şekillendirdi. Tarih boyunca özellikle Yahudi topluluğunun önemli merkezlerinden biri oldu; Rum ve Müslüman nüfusla birlikte çok katmanlı bir sosyal yapı oluştu. Sokakta yürürken binalara yalnızca mimari nesneler olarak değil, uzun süreli mahalle yaşamının parçaları olarak bak.',
      },
      {
        title: 'Göçlerle büyüyen mahalle',
        body:
          'Balat’ın Osmanlı dönemindeki kimliği farklı göç dalgalarıyla güçlendi. İber Yarımadası’ndan gelen Sefarad Yahudileri İstanbul’un çeşitli bölgelerine yerleşirken Balat önemli merkezlerden biri hâline geldi. Sinagoglar, küçük ticaret alanları ve konut dokusu mahalledeki topluluk yaşamını destekledi. Bu tarih, Balat’ın tek bir kültüre ait değil, farklı dönemlerde farklı toplulukların katkısıyla şekillenmiş bir yer olduğunu gösterir.',
      },
      {
        title: '19. yüzyıl sokakları',
        body:
          'UNESCO ve ICOMOS raporları Fener-Balat çevresinde çoğu 19. yüzyıla ait yoğun tarihî yapı dokusuna dikkat çeker. Dar parseller üzerindeki çok katlı evler, dükkânlar ve kamusal yapılar mahallede güçlü bir sokak duvarı oluşturur. Bugün renkli cepheler öne çıksa da tarihî değeri yalnızca renklerden gelmez. Yapıların ölçüsü, birbirleriyle kurduğu ilişki ve Haliç’e doğru inen sokaklar bütün olarak korunması gereken kentsel mirası oluşturur.',
      },
      {
        title: '2000’lerde koruma ve mahalle yaşamı',
        body:
          'Fener-Balat, 2000’lerde Avrupa Birliği finansmanı ve UNESCO’nun desteğiyle yürütülen önemli bir rehabilitasyon programına sahne oldu. Programın amacı yalnızca cepheleri güzelleştirmek değildi; tarihî konutları iyileştirirken mevcut mahalle yaşamını sürdürebilmekti. UNESCO raporlarına göre 121 tarihî yapı restore edildi. Bu süreç, korumanın yalnızca binayı değil orada yaşayan topluluğu da dikkate alması gerektiğini gösteren önemli bir örnek olarak değerlendirildi.',
      },
      {
        title: 'Bugünün Balat’ında neye bakmalı?',
        body:
          'Bugün Balat yoğun ziyaretçi alan bir mahalle. Bu ilgi ekonomik canlılık yaratırken, gündelik yaşam ve koruma açısından yeni baskılar da oluşturabiliyor. Ziyaret ederken tarihî bir yapıyı yalnızca çekici bir arka plan olarak değil, birilerinin evi, dükkânı ya da ibadet alanı olarak düşünmek önemli. ZAMANALTI’nın amacı burada geçmişi romantikleştirmek değil; farklı toplulukların, dönüşümlerin ve koruma çabalarının hâlâ yaşayan bir mahallede nasıl üst üste geldiğini göstermek.',
      },
    ],
    sources: [
      {
        label: 'UNESCO — Fener-Balat teknik destek ve rehabilitasyon',
        url: 'https://whc.unesco.org/en/activities/782',
      },
      {
        label: 'UNESCO/ICOMOS — 2012 İstanbul izleme raporu',
        url: 'https://whc.unesco.org/document/123045',
      },
      {
        label: 'İBB — Balat sokakları ve mahalle tarihi',
        url: 'https://istanbulseninhaber.ibb.istanbul/haber-detay/balat-sokaklarinda-tarihi-bir-yolculuk',
      },
    ],
  },
];
