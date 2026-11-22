# GPT-2 BigPicture: Proje Rehberi

Bu dosya, bu klasörde çalışan Claude oturumları için bağlam ve kurallar içerir. Önce bunu oku.

## Amaç

GPT-2'yi (Generative Pre-trained Transformer 2 / Üretken Önceden Eğitilmiş Dönüştürücü 2) **ayrıntılarıyla ve sezgisel olarak öğreten** etkileşimli HTML sayfaları üretmek. Hedef, "ne yapıldığını" değil **neden yapıldığını** (sezgiyi) anlatmak. Proje bir Gemini görselinden (GPT-2 mimari akış şeması) başladı ve sayfalar üzerine eklenerek büyüyor.

Örnek girdi her yerde aynı: **"Sabah armut"** → tahmin: **"yedim"**. Model: GPT-2 small (768 boyut, 12 blok, 12 baş, 50.257 sözlük, 1.024 bağlam).

## Dosyalar

| Dosya | İçerik |
|---|---|
| `GPT2_Mimari.html` | **Çıkarım (Inference)** sayfası. Model eğitilmiş ve ağırlıklar sabit. Kartlar: 1 Tokenizer, 2 Embedding + Konum (768 sayı ne demek, konum vektörü sezgisi), 3 MHA (Q/K/V, gerçek sayılı mini örnek, "karıştırma" açıklaması), 4 FFN (toplantı/masa başı sezgisi, genişlet-kapı-özetle, W1/W2 anlamı, "kapı neden şart" demosu, 4→8→4 sayılı örnek) + GELU, 5 LM Head, 6 Softmax (sıcaklık), 7 Üretim döngüsü (autoregressive). |
| `GPT2_Egitim.html` | **Eğitim (Training)** sayfası. Kartlar: 1 Büyük resim, 2 Loss, 3 Backpropagation, 4 Optimizer/LR, 5 Sayılar nereden geliyor, 6 Aktivasyon türevi (GELU/ReLU), 7 Pratik notlar. |
| `CLAUDE.md` | Bu dosya. |

İki sayfa en üstteki bağlantı çubuğuyla ve metin içi bağlantılarla (`GPT2_Egitim.html#sayilar`, `#aktivasyon`) birbirine bağlıdır. Yeni bir sayfa eklenirse iki sayfanın da bağlantı çubuğu güncellenmelidir.

**Kural: Her sayfadan tek kopya olur.** `_v2`, `_yeni` gibi yan dosyalar açma. Mevcut dosyayı güncelle.

## Kullanıcı ve öğrenme tarzı

- Kullanıcı Türkçe yazar. **Tüm yanıtlar ve sayfa metinleri Türkçe.**
- Kullanıcı **resim/diyagram tarzı görsellerle ve etkileşimle** daha iyi öğrenir. Sayfaları bu yönde geliştir (kaydırıcılar, düğmeler, adım adım hesaplar).
- Kullanıcı deneyimli bir yazılımcıdır ama yapay zeka konusunda öğrenme aşamasındadır. "Ne yapıldığı"ndan çok **sezgiyi** ister. Bir şey "havada kalmışsa" fark edip sorar: açıklamayı eksik bırakma.
- Kullanıcı bir şeyi yanlış hatırlayabilir. Nazikçe ve açıkça düzelt (örnek: "GELU hep pozitiftir" yanlıştır, hep sıfır ya da pozitif olan ReLU'dur). Yanlış bir şey yazdıysan da açıkça söyle ve düzelt.

## İçerik kuralları

1. **Kısaltmalar:** İlk geçtikleri yerde `KISALTMA (English / Türkçe)` biçiminde aç. Her sayfanın sonunda "Kısaltmalar sözlüğü" olsun ve yeni kısaltma eklenince oraya da yaz.
2. **"Neden?" kutusu:** Her kavramda sadece işlem değil, sezgi ve benzetme olsun (kütüphane, boya, sisli dağ, dişli çark gibi).
3. **Uydurma değerler uyarısı:** İnsanın anlaması için uydurulan her örnek (768 boyutun "konu" isimleri, olasılıklar, mini ağırlıklar) sayfada bir `⚠️` kutusuyla **uydurma olduğunu** ve gerçekte modelin/backpropagation'ın bulduğunu belirtmeli. Bir boyut = bir konu gibi sadeleştirmelerde, gerçekte kavramların birçok boyuta yayıldığı da yazılmalı.
4. **Gerçek sayılar:** Hesap örneklerinde sayılar o an JavaScript ile **gerçekten hesaplanmalı**, elle yazılmış sonuç olmamalı. Sayfaya koymadan önce numpy/node ile doğrula.
5. **Sabit ve hesaplanan ayrımı net olsun:** Modelden gelen sabit ağırlıklar (🔒: kelime/konum tabloları, Wq/Wk/Wv, çıkış matrisi, FFN matrisleri, LM Head) ile her girdide hesaplanan değerler (X, Q/K/V, puanlar, FFN ara sonucu, logits) karıştırılmamalı.
6. **Şekil gösterimi:** Matris çarpımlarını `X (2×768) × W (768×768) = Q (2×768)` biçiminde, hangisinin girdi, hangisinin ağırlık, hangisinin sonuç olduğunu belli ederek yaz. ("Ağırlık 768×768 → Q, K, V" gibi karışık yazım kullanıcıyı şaşırttı.)
7. **Eğitim ve çıkarım ayrı kalsın:** "Sayı nereden geldi / nasıl öğrenildi" soruları Eğitim sayfasında, akış Çıkarım sayfasında anlatılır. Diğer sayfaya bağlantı ver.

## Doğruluk notları (daha önce düzeltilenler)

- **GELU negatif değer alabilir** (en düşüğü yaklaşık −0,17, x ≈ −0,75). Hep sıfır ya da pozitif olan ReLU'dur.
- **ReLU:** x = 0'da türevsiz (kırık nokta), ama asıl sorun x < 0'da türevin tam 0 olması ("ölü nöron"). GELU'nun üstünlüğü deneylerle görülen bir şeydir, kanıtlanmış teorem değildir.
- **Backpropagation sadece türevleri hesaplar.** Ağırlıkları güncelleyen ayrı adım optimizer'dır. Türevi alınan şey loss'un ağırlığa göre türevidir.
- **"Toplanan kelime+konum karışımı sonradan ayrılır" ifadesi yanıltıcıdır.** Doğrusu: sonraki katmanlar karışımdan ihtiyaç duyduklarını okumayı öğrenir (çarpma toplamı dağıtır: x·Wq = kelime·Wq + konum·Wq).
- **Weight tying:** GPT-2'de LM Head matrisi ayrı değil, kelime tablosunun ters çevrilmiş halidir.
- **Wq, Wk, Wv** GPT-2'de tek büyük matriste (768×2304) saklanır. Mantıksal olarak üçü ayrıdır.
- **Optimizer:** GPT-2'nin optimizer ayrıntısını kesin bilmiyoruz. "Transformer modellerinde Adam ailesi yaygındır" diye yaz, "GPT-2 Adam kullandı" yazma.
- "Yaklaşık 40 GB WebText" ve "yaklaşık 124 milyon ağırlık" bilgileri hafızadan yazıldı, kaynakla doğrulanmadı. Doğrulama fırsatı olursa doğrula.
- **Bilinen sadeleştirme:** Sayfalar **LayerNorm (Katman Normalizasyonu)** ve **residual connection (artık/atlama bağlantısı)** konularını henüz içermiyor. Görselde de yok. "Tüm detayları öğret" hedefi için eklenmesi gereken eksiklerdir.

## Teknik kurallar (HTML)

- Her sayfa **tek başına çalışan tek bir `.html` dosyası**: harici kütüphane, CDN, font yok. Saf (vanilla) JavaScript ve CSS.
- Düzen: üstte bağlantı çubuğu, oynat/ileri/geri düğmeleri, yapışkan "şu anki tensör şekli" çubuğu, kartlar (varsayılan **açık**), en altta sözlük ve mini test.
- Kart tıklaması `.detail`, `button`, `input` içinden gelen tıklamalarda kartı kapatmamalı.
- Her kaydırıcı/düğme `stopPropagation` ya da bu istisnalarla çalışmalı.
- Renkler: Embedding mavi, MHA mor, FFN turuncu, LM Head turkuaz, Softmax yeşil, Backprop kırmızı.
- Değişiklikten sonra sayfayı gerçek bir tarayıcıda (Playwright ile) aç, konsol hatası olmadığını ve düğmelerin çalıştığını doğrula.

## Dosya yazma ve teslim kuralları

- **Çalışma klasörü: `D:\repos\GPT2.0BigPicture`** (Google Drive'daki eski klasör artık kullanılmıyor, ona yazma). Erişim yoksa `device_request_folder_access` ile iste.
- **Satır sonları CRLF (Windows).** Dosyalar bu klasörde CRLF. Düzenlerken LF'ye çevirip çalışabilirsin ama **geri yazarken tekrar CRLF yap**, aksi halde git'te tüm dosya değişmiş görünür.
- Yazmadan önce dosyayı `device_stage_files` ile al ve içeriğin beklediğinle aynı olduğunu doğrula (satır sonlarını normalize ederek karşılaştır).
- Yeni yazılan dosya container'da birkaç saniye geç okunabiliyor ve `device_commit_files` bazen **eski içeriği yazabiliyor**. Bu yüzden: dosyayı yaz, **~5 saniye bekle**, commit et, sonra `device_list_dir` ile **boyutu yerel dosyayla karşılaştır**. Eşleşmiyorsa tekrar commit et.
- Cihazdaki kabuk (`device_bash`) bu klasörleri bağlayamayabiliyor. Dosya silme/taşıma gerekirse kullanıcıya bırak.
- Aynı klasörde `.git` var. **Kullanıcı istemedikçe commit atma.**

## Commit mesajı kuralları

- **Dosyalarda yaptığın her değişiklikten sonra, yanıtının sonunda o değişiklik için Türkçe bir commit mesajı ver.** Kullanıcı ayrıca istemese de.
- Commit'i kendin atma, sadece mesajı ver. (Kullanıcı açıkça "commit at" derse at.) Commit atarsan, oturumun istediği `Co-Authored-By` ve oturum bağlantısı satırlarını mesajın sonuna ekle.
- Mesajı bir **kod bloğu** içinde ver ki kolay kopyalansın.
- Biçim: ilk satır kısa başlık (yaklaşık 70 karakteri geçmesin), boş satır, altında `- ` ile madde madde değişiklikler.
- Mesaj **gerçekte yapılan** değişikliği yansıtsın: tek seferde birden çok dosya değiştiyse hepsini kapsa, yapılmayanı yazma.
- Yalnızca CLAUDE.md değiştiyse de mesaj ver.

## Her değişikliğin sonunda kontrol listesi

1. Sayfayı tarayıcıda aç, konsol hatası ve düğme/kaydırıcı testi.
2. Dosyayı yaz (CRLF), ~5 sn bekle, commit et, `device_list_dir` ile boyutu doğrula.
3. Yeni kart, dosya ya da kural eklendiyse **bu dosyadaki** "Dosyalar" tablosunu ve ilgili bölümleri güncelle.
4. Yanıtın sonunda Türkçe commit mesajını ver.

## Fikir listesi (kararlaştırılmadı, kullanıcı onayı gerekir)

Kullanıcıya zaman zaman önerilen ama henüz yapılmayanlar:

- Dikkat matrisi ısı haritası ("armut" hangi kelimeye ne kadar bakıyor)
- Parametre sayısı hesabı (124 milyon nereden çıkıyor)
- Kullanıcının yazdığı cümleyle çalışan token → embedding simülasyonu
- Her adım için küçük Python/PyTorch kodu
- LayerNorm ve residual connection kartları
- Birden çok bloğun üst üste binmesi (12 blok) ve çok başlı dikkatin gerçek hesabı
