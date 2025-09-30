import { render, screen } from '@testing-library/react';
import Toppings from '.';
import userEvent from '@testing-library/user-event';

test("api'dan gelen soslar için ekrana kartlar basılıyor mu?", async () => {
  render(<Toppings />);

  // Ekran yüklendikten sonra tüm sos-resim alt etiketli görselleri bul
  const images = await screen.findAllByAltText('sos-resim');

  // Gelen görsel sayısının en az 1 olduğunu kontrol et
  expect(images.length).toBeGreaterThanOrEqual(1);
});

test('sosları ekleme çıkarma işlemi topam fiyatı etkiler', async () => {
  render(<Toppings />);
  const user = userEvent.setup();

  // Toplam ücret başlığı elementini al
  const total = screen.getByRole('heading', {
    name: /soslar ücreti/i,
  });

  // Başlangıçta toplam ücretin 0 ₺ olduğunu kontrol et - Sadece fiyat kısmını kontrol et
  const initialPrice = screen.getByText('0 ₺', { selector: '.total-price' });
  expect(initialPrice).toBeInTheDocument();

  // Ekranda görünen bütün sosların checkboxlarını bul
  const toppings = await screen.findAllByRole('checkbox');

  // Birinci sosu sepete eklemek için tıkla
  await user.click(toppings[0]);

  // Toplam ücretin 20 TL ye güncellendiğini kontrol et 
  expect(screen.getByText('20 ₺', { selector: '.total-price' })).toBeInTheDocument();

  // Üçüncü sosu sepete eklemek için tıkla
  await user.click(toppings[2]);

  // Toplam ücretin 40 TL'ye (2 x 20) güncellendiğini kontrol et
  expect(screen.getByText('40 ₺', { selector: '.total-price' })).toBeInTheDocument();

  // Birinci sosu sepetten çıkarmak için tıkla
  await user.click(toppings[0]);

  // Toplam ücretin tekrar 20 TL'ye (kalan 1 x 20) düştüğünü kontrol et
  expect(screen.getByText('20 ₺', { selector: '.total-price' })).toBeInTheDocument();

  // Üçüncü sosu sepetten çıkarmak için tıkla
  await user.click(toppings[2]);

  // Tüm soslar çıkarıldığı için toplam ücretin 0 TL'ye düştüğünü kontrol et
  expect(screen.getByText('0 ₺', { selector: '.total-price' })).toBeInTheDocument();
});

// YENİ TESTLER 

test('Toppings container doğru class\'a sahip', async () => {
  render(<Toppings />);

  // APIdan veri gelene kadar bekle
  await screen.findAllByAltText('sos-resim');

  // Containerı bul
  const container = screen.getByRole('heading', { name: /soslar ücreti/i }).closest('.toppings-container');
  
  expect(container).toHaveClass('toppings-container');
});

test('Toppings header section doğru styling\'e sahip', async () => {
  render(<Toppings />);

  // APIdan veri gelene kadar bekle
  await screen.findAllByAltText('sos-resim');

  // Titleı bul
  const title = screen.getByText(/sos çeşitleri/i);
  
  expect(title).toHaveClass('toppings-title');
});

test('Toppings price tag doğru class\'a sahip', async () => {
  render(<Toppings />);

  // APIdan veri gelene kadar bekle
  await screen.findAllByAltText('sos-resim');

  // Price tagi bul
  const priceTag = screen.getByText('20₺');
  
  expect(priceTag).toHaveClass('price-tag');
});

test('Toppings total section doğru class\'lara sahip', async () => {
  render(<Toppings />);

  // APIdan veri gelene kadar bekle
  await screen.findAllByAltText('sos-resim');

  // Total labelı bul
  const totalLabel = screen.getByRole('heading', { name: /soslar ücreti/i });
  expect(totalLabel).toHaveClass('total-label');

  // Total sectionı bul
  const totalSection = totalLabel.closest('.toppings-total');
  expect(totalSection).toHaveClass('toppings-total');
});

test('Topping cards doğru class\'a sahip', async () => {
  render(<Toppings />);

  // APIdan veri gelene kadar bekle
  const images = await screen.findAllByAltText('sos-resim');

  // Her imageın topping-card içinde olduğunu kontrol et
  images.forEach(img => {
    const card = img.closest('.topping-card');
    expect(card).toHaveClass('topping-card');
  });
});

test('Checkbox seçildiğinde card selected class\'ına sahip oluyor', async () => {
  render(<Toppings />);
  const user = userEvent.setup();

  // APIdan veri gelene kadar bekle
  const checkboxes = await screen.findAllByRole('checkbox');
  const images = await screen.findAllByAltText('sos-resim');

  // İlk card'ı bul
  const firstCard = images[0].closest('.topping-card');

  // Başlangıçta selected class ı yok
  expect(firstCard).not.toHaveClass('selected');

  // İlk checkbox'ı işaretle
  await user.click(checkboxes[0]);

  // Şimdi selected class'ı olmalı
  expect(firstCard).toHaveClass('selected');

  // Checkbox'ı kaldır
  await user.click(checkboxes[0]);

  // Selected class'ı kalkmalı
  expect(firstCard).not.toHaveClass('selected');
});

test('Topping label ve image doğru class\'lara sahip', async () => {
  render(<Toppings />);

  // API'dan veri gelene kadar bekle
  const images = await screen.findAllByAltText('sos-resim');

  // İlk image'ı kontrol et
  const firstImage = images[0];
  
  // Label'ı bul
  const label = firstImage.closest('label');
  expect(label).toHaveClass('topping-label');

  // Image container'ı bul
  const imageContainer = firstImage.parentElement;
  expect(imageContainer).toHaveClass('topping-image');
});

test('Topping name doğru class\'a sahip', async () => {
  render(<Toppings />);

  // API'dan veri gelene kadar bekle
  await screen.findAllByAltText('sos-resim');

  // İlk topping card'ı bul
  const firstCard = screen.getAllByRole('checkbox')[0].closest('.topping-card');
  
  // Topping name'i bul (p tag)
  const toppingName = firstCard.querySelector('.topping-name');
  expect(toppingName).toHaveClass('topping-name');
});

test('Checkmark icon selected durumunda görünüyor', async () => {
  render(<Toppings />);
  const user = userEvent.setup();

  // API'dan veri gelene kadar bekle
  const checkboxes = await screen.findAllByRole('checkbox');

  // İlk card'ı bul
  const firstCard = checkboxes[0].closest('.topping-card');
  const checkmarkIcon = firstCard.querySelector('.checkmark-icon');

  // Checkbox'ı işaretle
  await user.click(checkboxes[0]);

  // Checkmark icon doğru class'a sahip olmalı
  expect(checkmarkIcon).toHaveClass('checkmark-icon');
  
  // Card selected olmalı (böylece checkmark görünür olur)
  expect(firstCard).toHaveClass('selected');
});


test('Toppings component tüm özellikleri bir arada çalışıyor', async () => {
  render(<Toppings />);
  const user = userEvent.setup();

  // 1. API'dan veri gelene kadar bekle
  const images = await screen.findAllByAltText('sos-resim');
  expect(images.length).toBeGreaterThanOrEqual(1);

  // 2. Tüm sectionların doğru render edildiğini kontrol et
  const title = screen.getByText(/sos çeşitleri/i);
  expect(title).toHaveClass('toppings-title');

  const totalLabel = screen.getByRole('heading', { name: /soslar ücreti/i });
  expect(totalLabel).toHaveClass('total-label');

  // 3. Başlangıç fiyatı 0 olmalı  sadece fiyat span'ını kontrol et
  const initialPrice = screen.getByText('0 ₺', { selector: '.total-price' });
  expect(initialPrice).toBeInTheDocument();

  // 4. Checkboxları al
  const checkboxes = await screen.findAllByRole('checkbox');

  // 5. İlk toppingi seç
  await user.click(checkboxes[0]);
  
  // Card selected olmalı
  const firstCard = images[0].closest('.topping-card');
  expect(firstCard).toHaveClass('selected');
  
  // Fiyat 20 olmalı
  expect(screen.getByText('20 ₺', { selector: '.total-price' })).toBeInTheDocument();

  // 6. İkinci topping'i seç
  await user.click(checkboxes[1]);
  expect(screen.getByText('40 ₺', { selector: '.total-price' })).toBeInTheDocument();

  // 7. İlk topping'i kaldır
  await user.click(checkboxes[0]);
  expect(firstCard).not.toHaveClass('selected');
  expect(screen.getByText('20 ₺', { selector: '.total-price' })).toBeInTheDocument();

  // 8. Grid layout doğru çalışıyor
  const grid = images[0].closest('.topping-card').parentElement;
  expect(grid).toHaveClass('toppings-grid');
});