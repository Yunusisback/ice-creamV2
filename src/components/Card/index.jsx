import { useState } from 'react';


const Card = ({ basket, setBasket, item }) => {
  const [isHovered, setIsHovered] = useState(false);

  
  const found = basket.filter((i) => i.name === item.name);
  const amount = found.length;

 
  const handleReset = () => {
    setBasket(basket.filter((i) => i.name !== item.name));
  };

 
  const handleAdd = () => {
    setBasket([...basket, item]);
  };

  return (
    <div
      className="modern-card"
      style={{ width: '200px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      
      <div className="card-image">
        <img height={100} src={item.imagePath} alt="çeşit-resim" />
      </div>

     
      <span className="product-name">{item.name}</span>

    
      <div 
        className={`amount-badge ${amount === 0 ? 'invisible' : ''}`}
        data-testid="amount"
      >
        {amount || 0}
      </div>

      
      <div className="button-group">
        <button
          onClick={handleReset}
          className="reset-btn"
          disabled={amount === 0}
        >
          Sıfırla
        </button>
        
        <button
          onClick={handleAdd}
          className="add-btn"
        >
          Ekle
        </button>
      </div>
    </div>
  );
};

export default Card;