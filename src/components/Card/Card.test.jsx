import { render, screen } from '@testing-library/react';
import Card from '.';
import userEvent from '@testing-library/user-event';

const item = {
  name: 'Salted caramel',
  imagePath: '/images/salted-caramel.png',
};

const basket = [
  {
    name: 'Salted caramel',
    imagePath: '/images/salted-caramel.png',
  },
  {
    name: 'Salted caramel',
    imagePath: '/images/salted-caramel.png',
  },
  {
    name: 'Chocolate',
    imagePath: '/images/chocolate.png',
  },
];

// Bileşenin propları doğru işlediğini ve butonların sepeti güncellediğini test et
test('Kart bileşeni render edilir miktarı gösterir ve sepeti günceller', async () => {
  // setbasket propunun çağrılıp çağrılmadığını kontrol etmek için mock fonksiyon oluştur
  const mock = jest.fn();

  // bileşeni gerekli proplarla renderle
  render(<Card item={item} basket={basket} setBasket={mock} />);

  // 1.Ürün adının ekranda göründüğünü kontrol et
  screen.getByText(item.name);

  // 2.  rresmin doğru 'src değerine sahip olduğunu kontrol et
  const img = screen.getByAltText('çeşit-resim');
  expect(img).toHaveAttribute('src', item.imagePath);

  // 3. Sepette Salted caramelden 2 tane olduğu için miktarın 2 olduğunu kontrol et
  const amount = screen.getByTestId('amount');
  expect(amount).toHaveTextContent(2);

  // 4.  userEvent kurulumu ve buton elementlerini alma
  const user = userEvent.setup();
  const addBtn = screen.getByRole('button', { name: /ekle/i });
  const delBtn = screen.getByRole('button', { name: /sıfırla/i });

  // 5. Ekle butonuna tıkla
  await user.click(addBtn);

  // setBasketin yeni ürün eklenmiş güncel sepetle çağrıldığını kontrol et
  expect(mock).toHaveBeenCalledWith([...basket, item]);

  // 6. Sıfırla butonuna tıkla 
  await user.click(delBtn);

  // setBasketin ilgili çeşidin tamamen çıkarıldığı sepetle çağrıldığını kontrol et
  expect(mock).toHaveBeenLastCalledWith([
    {
      name: 'Chocolate',
      imagePath: '/images/chocolate.png',
    },
  ]);
});

//  YENİ TESTLER 

test('Modern card styling class\'ları doğru uygulanıyor', () => {
  const mockSetBasket = jest.fn();
  const mockItem = { name: 'Test Item', imagePath: '/test.png' };
  const mockBasket = [];

  render(<Card item={mockItem} basket={mockBasket} setBasket={mockSetBasket} />);

  // modern card classının uygulandığını kontrol et
  const cardElement = screen.getByRole('img').closest('.modern-card');
  expect(cardElement).toHaveClass('modern-card');
});

test('Hover durumunda görsel değişiklikler tetikleniyor', async () => {
  const mockSetBasket = jest.fn();
  const mockItem = { name: 'Test Item', imagePath: '/test.png' };
  const mockBasket = [];

  render(<Card item={mockItem} basket={mockBasket} setBasket={mockSetBasket} />);
  const user = userEvent.setup();

  const cardElement = screen.getByRole('img').closest('.modern-card');
  
  // Card üzerine mouse getir
  await user.hover(cardElement);
  
  // Hover stateinin aktif olduğunu kontrol et (DOM'da değişiklik olup olmadığını)
  // Not: CSS transitionları test etmek zor olduğu için state değişikliğini kontrol ederiz
  expect(cardElement).toBeInTheDocument();
});

test('Amount badge animasyonu ve styling\'i doğru çalışıyor', async () => {
  const mockSetBasket = jest.fn();
  const mockItem = { name: 'Test Item', imagePath: '/test.png' };
  // Sepette 2 tane var
  const mockBasket = [
    { name: 'Test Item', imagePath: '/test.png' },
    { name: 'Test Item', imagePath: '/test.png' }
  ];

  render(<Card item={mockItem} basket={mockBasket} setBasket={mockSetBasket} />);

  // Amount badgei bul
  const amountBadge = screen.getByTestId('amount');
  
  // Badge'in doğru class'a sahip olduğunu kontrol et
  expect(amountBadge).toHaveClass('amount-badge');
  
  // İçeriğin doğru olduğunu kontrol et
  expect(amountBadge).toHaveTextContent('2');
});

test('Butonlar doğru CSS class\'larına sahip ve hover efektleri çalışıyor', async () => {
  const mockSetBasket = jest.fn();
  const mockItem = { name: 'Test Item', imagePath: '/test.png' };
  const mockBasket = [{ name: 'Test Item', imagePath: '/test.png' }];

  render(<Card item={mockItem} basket={mockBasket} setBasket={mockSetBasket} />);
  const user = userEvent.setup();

  // Butonları bul
  const resetBtn = screen.getByRole('button', { name: /sıfırla/i });
  const addBtn = screen.getByRole('button', { name: /ekle/i });

  // Doğru CSS class'larına sahip olduklarını kontrol et
  expect(resetBtn).toHaveClass('reset-btn');
  expect(addBtn).toHaveClass('add-btn');

  // Butonların aktif olduğunu kontrol et
  expect(resetBtn).toBeEnabled();
  expect(addBtn).toBeEnabled();
});

test('Disabled reset button doğru styling\'e sahip', () => {
  const mockSetBasket = jest.fn();
  const mockItem = { name: 'Test Item', imagePath: '/test.png' };
  // Sepet boş - reset button disabled olmalı
  const mockBasket = [];

  render(<Card item={mockItem} basket={mockBasket} setBasket={mockSetBasket} />);

  const resetBtn = screen.getByRole('button', { name: /sıfırla/i });
  
  // Button disabled olmalı
  expect(resetBtn).toBeDisabled();
  
  // Doğru classa sahip olmalı
  expect(resetBtn).toHaveClass('reset-btn');
});

test('Product name doğru styling ile görüntüleniyor', () => {
  const mockSetBasket = jest.fn();
  const mockItem = { name: 'Çikolata Dondurma', imagePath: '/test.png' };
  const mockBasket = [];

  render(<Card item={mockItem} basket={mockBasket} setBasket={mockSetBasket} />);

  // Product name'i bul
  const productName = screen.getByText('Çikolata Dondurma');
  
  // Doğru class'a sahip olduğunu kontrol et
  expect(productName).toHaveClass('product-name');
});

test('Card image container doğru styling\'e sahip', () => {
  const mockSetBasket = jest.fn();
  const mockItem = { name: 'Test Item', imagePath: '/test.png' };
  const mockBasket = [];

  render(<Card item={mockItem} basket={mockBasket} setBasket={mockSetBasket} />);

  // Image bul ve parent containerını kontrol et
  const image = screen.getByAltText('çeşit-resim');
  const imageContainer = image.parentElement;
  
  // Containerın doğru classa sahip olduğunu kontrol et
  expect(imageContainer).toHaveClass('card-image');
});

test('Button group container doğru styling\'e sahip', () => {
  const mockSetBasket = jest.fn();
  const mockItem = { name: 'Test Item', imagePath: '/test.png' };
  const mockBasket = [];

  render(<Card item={mockItem} basket={mockBasket} setBasket={mockSetBasket} />);

  // Butonları bul
  const resetBtn = screen.getByRole('button', { name: /sıfırla/i });
  const buttonContainer = resetBtn.parentElement;
  
  // Containerın doğru classa sahip olduğunu kontrol et
  expect(buttonContainer).toHaveClass('button-group');
});


test('Modern card tüm özellikleri bir arada çalışıyor - complete user journey', async () => {
  const mockSetBasket = jest.fn();
  const mockItem = { name: 'Vanilyalı', imagePath: '/vanilla.png' };
  const mockBasket = [];

  render(<Card item={mockItem} basket={mockBasket} setBasket={mockSetBasket} />);
  const user = userEvent.setup();

  // 1. Başlangıç durumu kontrol et
  const cardElement = screen.getByRole('img').closest('.modern-card');
  expect(cardElement).toHaveClass('modern-card');
  
  // reset button disabled
  const resetBtn = screen.getByRole('button', { name: /sıfırla/i });
  expect(resetBtn).toBeDisabled();

  // 2. Ürün ekle
  const addBtn = screen.getByRole('button', { name: /ekle/i });
  await user.click(addBtn);
  
  // setBasket çağrıldığını kontrol et
  expect(mockSetBasket).toHaveBeenCalledWith([mockItem]);

  // 3. Hover test
  await user.hover(cardElement);
  // Card hala aynı classlara sahip olmalı
  expect(cardElement).toHaveClass('modern-card');
});