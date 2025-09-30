import { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../Card';


const Scoops = () => {
  const [data, setData] = useState([]);
  const [basket, setBasket] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:3030/scoops')
      .then((res) => setData(res.data));
  }, []);

  return (
    <div className="scoops-container">
      <div className="scoops-header">
        <h1 className="scoops-title">🍦 Dondurma Çeşitleri</h1>
        <p className="scoops-price">
          Tanesi: <span className="price-tag">50 ₺</span>
        </p>
      </div>

      <div className="scoops-total">
        <h3 className="total-label">Çeşitler Ücreti</h3>
        <span className="total-price">{basket.length * 50} ₺</span>
      </div>


      <div className="scoops-grid">
        {data.map((i) => (
          <Card basket={basket} setBasket={setBasket} item={i} key={i.name} />
        ))}
      </div>
    </div>
  );
};

export default Scoops;