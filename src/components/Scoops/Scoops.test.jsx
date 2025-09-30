import { render } from "@testing-library/react";
import Scoops from ".";
import { screen } from "@testing-library/react";    
import userEvent from '@testing-library/user-event';

/*
! Seçiciler

? Method [All] BySeçici
* Method > get | find | query 
* get > element başlangıçta DOM da varsa kullanılır eleman yoksa hata verir
* find > elementin ne zaman ekrana basılacağı belli değilse kullanılır (async)
* query > get ile benzer şekilde çalışır elementin ekranda olmaması gerektiğinde kullanılır eleman yoksa null döner

*not: find methodu promise döner bu yüzden async await kullanılır

*eğer All kullanılırsa elementin birden fazla olması beklenir ve her zaman (dizi) array döner
*/

// Ürünler ekrana geliyor mu?
test("API'dan gelen veriler için ekrana kartlar basılır", async () => {
  render(<Scoops />);

  // ekrana basılan resimleri al
  const images = await screen.findAllByAltText('çeşit-resim');

  // gelen resimlerin sayısı 1 den büyük mü
  expect(images.length).toBeGreaterThanOrEqual(1);
});

// ekleme ve sıfırlama butonlarının işlevselliği
test('Çeşit ekleme ve sıfırlamanın toplama etkisi', async () => {
  render(<Scoops />);
  const user = userEvent.setup();

  // 1- ekle ve sıfırlama Butonlarını çağırma
  // find tek bir eleman için kullanılır
  // birden fazla eleman için findAll kullanılır
  // getAll kullanılamaz çünkü başlangıçta butonlar yok
  // queryAll kullanılamaz çünkü butonlar var
  // await bekleme süresi verir api dan veri gelene kadar bekler

  const addButtons = await screen.findAllByRole('button', {
    name: 'Ekle',
  });

  const delButtons = await screen.findAllByRole('button', {
    name: 'Sıfırla',
  });

  //2- toplam Spanı Çağır
  // burda getbyrole kullanıyoruz çünkü bir tane element var ve başlangıçta da var
  const total = screen.getByRole('heading', {
    name: /çeşitler ücreti/i,
  });

  //3- topla Fiyatı 0'dır - Sadece fiyat kısmını kontrol et
  const totalPrice = screen.getByText('0 ₺', { selector: '.total-price' });
  expect(totalPrice).toBeInTheDocument();

  //4- ekle butonlarından birine tıklanır
  // burda (addButtons[0]); ilk butona tıklanır ikinciye tıklanırsa farklı bir ürün eklenir
  // await user.click(addButtons[1]); ikinci butona tıklanır
  // await user.click(addButtons[2]); üçüncü butona tıklanır
  await user.click(addButtons[0]);

  //5- toplam Fiyatı 50 olur
  expect(screen.getByText('50 ₺', { selector: '.total-price' })).toBeInTheDocument();

  //6- farklı bir çeşitten iki tane eklenir
  await user.dblClick(addButtons[2]);

  //7- toplam fiyat 150 olur
  expect(screen.getByText('150 ₺', { selector: '.total-price' })).toBeInTheDocument();

  //8- 1 tane ekleninin Sıfırla butonuna tıklanır
  await user.click(delButtons[0]);

  //9-  toplam fiyat 100 olur
  expect(screen.getByText('100 ₺', { selector: '.total-price' })).toBeInTheDocument();

  //10- 2 tane eklenenin sıfırla butonuna tıklanır
  await user.click(delButtons[2]);

  //11- toplam fiyat 0 olur
  expect(screen.getByText('0 ₺', { selector: '.total-price' })).toBeInTheDocument();
});

// YENİ TESTLER 

test('Scoops container doğru class\'a sahip', async () => {
  render(<Scoops />);

  // API'dan veri gelene kadar bekle
  await screen.findAllByAltText('çeşit-resim');

  // Containerı bul
  const container = screen.getByRole('heading', { name: /çeşitler ücreti/i }).closest('.scoops-container');
  
  expect(container).toHaveClass('scoops-container');
});

test('Scoops header section doğru styling\'e sahip', async () => {
  render(<Scoops />);

  // API'dan veri gelene kadar bekle
  await screen.findAllByAltText('çeşit-resim');

  // Titleı bul
  const title = screen.getByText(/dondurma çeşitleri/i);
  
  expect(title).toHaveClass('scoops-title');
});

test('Price tag doğru class ve styling\'e sahip', async () => {
  render(<Scoops />);

  // APIdan veri gelene kadar bekle
  await screen.findAllByAltText('çeşit-resim');

  // Price tagi bul
  const priceTag = screen.getByText('50 ₺');
  
  expect(priceTag).toHaveClass('price-tag');
});

test('Total section doğru class\'lara sahip', async () => {
  render(<Scoops />);

  // APIdan veri gelene kadar bekle
  await screen.findAllByAltText('çeşit-resim');

  // Total labelı bul
  const totalLabel = screen.getByRole('heading', { name: /çeşitler ücreti/i });
  expect(totalLabel).toHaveClass('total-label');

  // Total sectionı bul
  const totalSection = totalLabel.closest('.scoops-total');
  expect(totalSection).toHaveClass('scoops-total');
});

test('Total price doğru class ve animasyon\'a sahip', async () => {
  render(<Scoops />);
  const user = userEvent.setup();

  // API'dan veri gelene kadar bekle
  const addButtons = await screen.findAllByRole('button', { name: 'Ekle' });

  // Total price span'ı bul
  const totalPrice = screen.getByText('0 ₺', { selector: '.total-price' });
  expect(totalPrice).toHaveClass('total-price');

  // Bir ürün ekle ve yeni fiyatı kontrol et
  await user.click(addButtons[0]);

  const updatedPrice = screen.getByText('50 ₺', { selector: '.total-price' });
  expect(updatedPrice).toHaveClass('total-price');
});

test('Scoops grid doğru layout\'a sahip', async () => {
  render(<Scoops />);

  // API'dan veri gelene kadar bekle
  const images = await screen.findAllByAltText('çeşit-resim');

  // Grid containerı bul (ilk imageın parent'larından biri)
  const firstCard = images[0].closest('.modern-card');
  const grid = firstCard.parentElement;

  expect(grid).toHaveClass('scoops-grid');
});

test('Cards grid\'de doğru şekilde render ediliyor', async () => {
  render(<Scoops />);

  // APIdan veri gelene kadar bekle
  const images = await screen.findAllByAltText('çeşit-resim');

  // Her card modern card classına sahip olmalı
  images.forEach(img => {
    const card = img.closest('.modern-card');
    expect(card).toHaveClass('modern-card');
  });
});

test('Scoops component tüm özellikleri bir arada çalışıyor', async () => {
  render(<Scoops />);
  const user = userEvent.setup();

  // 1. APIdan veri gelene kadar bekle
  const images = await screen.findAllByAltText('çeşit-resim');
  expect(images.length).toBeGreaterThanOrEqual(1);

  // 2. Tüm sectionların doğru render edildiğini kontrol et
  const title = screen.getByText(/dondurma çeşitleri/i);
  expect(title).toHaveClass('scoops-title');

  const totalLabel = screen.getByRole('heading', { name: /çeşitler ücreti/i });
  expect(totalLabel).toHaveClass('total-label');

  // 3. Başlangıç fiyatı 0 olmalı  Sadece fiyat span'ını kontrol et
  const initialPrice = screen.getByText('0 ₺', { selector: '.total-price' });
  expect(initialPrice).toBeInTheDocument();

  // 4. Butonları al
  const addButtons = await screen.findAllByRole('button', { name: 'Ekle' });
  const delButtons = await screen.findAllByRole('button', { name: 'Sıfırla' });

  // 5. Ürün ekle ve fiyatı kontrol et
  await user.click(addButtons[0]);
  expect(screen.getByText('50 ₺', { selector: '.total-price' })).toBeInTheDocument();

  // 6. Başka ürün ekle
  await user.click(addButtons[1]);
  expect(screen.getByText('100 ₺', { selector: '.total-price' })).toBeInTheDocument();

  // 7. Ürün sıfırla
  await user.click(delButtons[0]);
  expect(screen.getByText('50 ₺', { selector: '.total-price' })).toBeInTheDocument();

});