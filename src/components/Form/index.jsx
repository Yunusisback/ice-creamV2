import { useState } from 'react';

const Form = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  return (
    <div className="form-container">
      {/* Checkbox Section */}
      <div className="checkbox-section">
        <input
          onChange={(e) => setIsChecked(e.target.checked)}
          id="terms"
          className="form-checkbox"
          type="checkbox"
        />
        <label htmlFor="terms" className="checkbox-label">
          <span className="checkmark"></span>
          Koşulları okudum ve kabul ediyorum.
        </label>
      </div>

      {/* Terms Tooltip */}
      <div className="terms-tooltip">
        <p className={`tooltip-text ${isHover ? 'visible' : ''}`}>
          Size gerçekten bir şey teslim etmeyeceğiz.
        </p>
      </div>

      {/* Submit Button */}
      <button
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onMouseDown={() => setIsButtonPressed(true)}
        onMouseUp={() => setIsButtonPressed(false)}
        className={`form-submit-btn ${!isChecked ? 'disabled' : ''} ${isButtonPressed ? 'pressed' : ''}`}
        disabled={!isChecked}
      >
        {!isChecked && <span className="lock-icon">🔒</span>}
        Sipariş Onayla
        {isChecked && <span className="check-icon">✨</span>}
      </button>
    </div>
  );
};

export default function Demo() {
  return (
    <div style={{ 
      background: 'black', 
      minHeight: '100vh', 
      padding: '50px',
      display: 'flex',
      
     
      alignItems: 'flex-start',
      
      justifyContent: 'center'
    }}>
      <Form />
    </div>
  );
}