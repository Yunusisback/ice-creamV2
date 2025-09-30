import {fireEvent, render, screen } from "@testing-library/react";
import Form from "."; 
import userEvent from "@testing-library/user-event";

test("koşulların onaylanmasına göre buton aktifliği", async () => {
    // test bileşenini ekrana bas
    render(<Form />);

    // kurulumunu yap
    const user = userEvent.setup();

    // gerekli elemanları al
    const orderBtn = screen.getByRole("button");
    const checkbox = screen.getByRole("checkbox");

    // 1-checkbox tiksizdir
    expect(checkbox).not.toBeChecked();

    // 2-button disable durumdadır
    expect(orderBtn).toBeDisabled();

    // 3-checkbox tiklenir 
   await user.click(checkbox);  // fireEvent kullanabilrdik ama userEvent daha gerçekçi kullanıcı etkileşimi simüle eder.
    // fireevent direkt site açıldığı anda milisaniyeler içinde checkboxa tıklıyor kullanıcı davranışını simüle edemiyor
    // userEvent ise gerçek kullanıcı davranışlarını simüle eder. Yani önce checkboxa gider sonra tıklar

    // fireEvent neden kullanılır?
    // fireEvent, DOM üzerinde temel eventleri simüle etmek için kullanılır.
    // Örneğin:
    // - Tıklama (click)
    // - Yazı yazma (change)
    // - Seçim yapma (select)
    // Ancak gerçek kullanıcı davranışlarını (focus event zinciri) tam olarak simüle etmez
    // Daha gereçkçi etkileşimler için userEvent tercih edilir

    // 4-button enable olur
    expect(orderBtn).toBeEnabled();


    // 5-checkbox tik kaldırılır
   await user.click(checkbox);

    // 6-button tekrar disable olur
    expect(orderBtn).toBeDisabled();

});

test("onay butonuna hover yapıldığında açıklama görünür", async () => {
  render(<Form />);
  const user = userEvent.setup();

  // gerekli elemanlar
  const checkbox = screen.getByRole("checkbox");
  const button = screen.getByRole("button");
  const popup = screen.getByText(/size gerçekten/i);

  // buton checkbox tikle
  await user.click(checkbox);

  // Popup başlangıçta visible classına sahip değil
  expect(popup).not.toHaveClass('visible');

  // mouseyi butonun üzerine getir
  fireEvent.mouseEnter(button);

  // bildirim visible classına sahip olmalı
  expect(popup).toHaveClass('visible');

  // mouseu butondan çek
  fireEvent.mouseLeave(button);

  // popup visible classı kalkmalı
  expect(popup).not.toHaveClass('visible');
});

// YENİ TESTLER 

test('Form container doğru styling\'e sahip', () => {
  render(<Form />);

  // Containerı bul 
  const checkbox = screen.getByRole('checkbox');
  const formContainer = checkbox.closest('.form-container');
  
  expect(formContainer).toHaveClass('form-container');
});

test('Checkbox ve label doğru class\'lara sahip', () => {
  render(<Form />);

  const checkbox = screen.getByRole('checkbox');
  
  // getByLabelText checkbox'ın kendisini döndürür labelı değil
  // Labelı doğrudan bulalım
  const label = checkbox.nextElementSibling;

  // Doğru classlara sahip olmalı
  expect(checkbox).toHaveClass('form-checkbox');
  expect(label).toHaveClass('checkbox-label');
});

test('Checkbox işaretlendiğinde checkmark görünür', async () => {
  render(<Form />);
  const user = userEvent.setup();

  const checkbox = screen.getByRole('checkbox');
  
  // Checkboxı işaretle
  await user.click(checkbox);
  
  // Checkbox işaretli olmalı
  expect(checkbox).toBeChecked();
  
  // Label hala aynı classa sahip olmalı
  const label = checkbox.nextElementSibling;
  expect(label).toHaveClass('checkbox-label');
});

test('Submit button doğru CSS class\'ına sahip ve icon\'ları gösteriyor', () => {
  render(<Form />);

  const submitBtn = screen.getByRole('button');
  
  // Button doğru classa sahip olmalı
  expect(submitBtn).toHaveClass('form-submit-btn');
  
  // Disabled durumunda disabled classına sahip olmalı
  expect(submitBtn).toHaveClass('disabled');
});

test('Button enabled olduğunda disabled class\'ı kalkıyor', async () => {
  render(<Form />);
  const user = userEvent.setup();

  const checkbox = screen.getByRole('checkbox');
  const submitBtn = screen.getByRole('button');
  
  // Başlangıçta disabled classına sahip
  expect(submitBtn).toHaveClass('disabled');
  
  // Checkboxı işaretle
  await user.click(checkbox);
  
  // Button artık enabled olmalı 
  expect(submitBtn).not.toHaveClass('disabled');
});

test('Button press animasyonu çalışıyor', async () => {
  render(<Form />);
  const user = userEvent.setup();

  const checkbox = screen.getByRole('checkbox');
  const submitBtn = screen.getByRole('button');
  
  // Önce checkboxı aktif et
  await user.click(checkbox);
  
  // Buttona mouse down yap
  fireEvent.mouseDown(submitBtn);
  
  // Pressed classının eklendiğini kontrol et
  expect(submitBtn).toHaveClass('pressed');
  
  // Mouse up yap
  fireEvent.mouseUp(submitBtn);
  
  // Pressed classının kaldırıldığını kontrol et
  expect(submitBtn).not.toHaveClass('pressed');
});

test('Tooltip doğru class ve visibility davranışı', async () => {
  render(<Form />);
  const user = userEvent.setup();

  const checkbox = screen.getByRole('checkbox');
  const button = screen.getByRole('button');
  const tooltip = screen.getByText(/size gerçekten/i);
  
  // Checkboxı aktif et
  await user.click(checkbox);
  
  // Tooltip başlangıçta görünmez olmalı
  expect(tooltip).toHaveClass('tooltip-text');
  expect(tooltip).not.toHaveClass('visible');
  
  // Buttona hover yap
  fireEvent.mouseEnter(button);
  
  // Tooltip görünür olmalı
  expect(tooltip).toHaveClass('visible');
  
  // Buttondan hover kaldır
  fireEvent.mouseLeave(button);
  
  // Tooltip tekrar görünmez olmalı
  expect(tooltip).not.toHaveClass('visible');
});

test('Checkbox section doğru styling\'e sahip', () => {
  render(<Form />);

  const checkbox = screen.getByRole('checkbox');
  const checkboxSection = checkbox.parentElement;
  
  expect(checkboxSection).toHaveClass('checkbox-section');
});


test('Form tüm özellikleri bir arada çalışıyor - complete user journey', async () => {
  render(<Form />);
  const user = userEvent.setup();

  // 1. Başlangıç durumu kontrol et
  const formContainer = screen.getByRole('checkbox').closest('.form-container');
  expect(formContainer).toHaveClass('form-container');
  
  const checkbox = screen.getByRole('checkbox');
  const submitBtn = screen.getByRole('button');
  const tooltip = screen.getByText(/size gerçekten/i);
  
  // Başlangıç durumları
  expect(checkbox).not.toBeChecked();
  expect(submitBtn).toBeDisabled();
  expect(submitBtn).toHaveClass('disabled');
  expect(tooltip).not.toHaveClass('visible');

  // 2. Checkbox'ı işaretle
  await user.click(checkbox);
  
  expect(checkbox).toBeChecked();
  expect(submitBtn).toBeEnabled();
  expect(submitBtn).not.toHaveClass('disabled');

  // 3. Button hover test
  fireEvent.mouseEnter(submitBtn);
  expect(tooltip).toHaveClass('visible');
  
  // 4. Button press test
  fireEvent.mouseDown(submitBtn);
  expect(submitBtn).toHaveClass('pressed');
  
  fireEvent.mouseUp(submitBtn);
  expect(submitBtn).not.toHaveClass('pressed');
  
  // 5. Checkbox'ı kaldır
  await user.click(checkbox);
  
  expect(checkbox).not.toBeChecked();
  expect(submitBtn).toBeDisabled();
  expect(submitBtn).toHaveClass('disabled');
});