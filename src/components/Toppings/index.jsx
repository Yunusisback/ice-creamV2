import axios from 'axios';
import { useEffect, useState } from 'react';


const Toppings = () => {
  const [data, setData] = useState([]);
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3030/toppings')
      .then((res) => setData(res.data));
  }, []);

  const handleChange = (item) => {
    const isSelected = basket.some((i) => i.name === item.name);
    
    if (isSelected) {
      setBasket(basket.filter((i) => i.name !== item.name));
    } else {
      setBasket([...basket, item]);
    }
  };


  const isSelected = (item) => {
    return basket.some((i) => i.name === item.name);
  };

  return (
    <div className="toppings-container">
      <div className="toppings-header">
        <h1 className="toppings-title">🍰 Sos Çeşitleri</h1>
        <p className="toppings-price">
          Tanesi: <span className="price-tag">20₺</span>
        </p>
      </div>

      <div className="toppings-total">
        <h3 className="total-label">Soslar Ücreti</h3>
        <span className="total-price">{basket.length * 20} ₺</span>
      </div>

      <div className="toppings-grid">
        {data.map((item) => (
          <div
            key={item.name}
            className={`topping-card ${isSelected(item) ? 'selected' : ''}`}
            onClick={() => handleChange(item)}
            style={{ cursor: 'pointer' }}
          >
            <input
              onChange={() => {}} 
              checked={isSelected(item)}
              id={item.name}
              type="checkbox"
              className="topping-checkbox"
            />
            <label
              htmlFor={item.name}
              className="topping-label"
              onClick={(e) => e.preventDefault()} 
            >
              <div className="topping-image">
                <img
                  height={100}
                  src={item.imagePath}
                  alt="sos-resim"
                />
              </div>
              <p className="topping-name">{item.name}</p>
              <span className="checkmark-icon">✓</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toppings;