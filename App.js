import React, { useState, useEffect } from "react";
import "./App.css";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then((res) => res.json())
      .then((data) => setCurrencies(Object.keys(data.rates)))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  useEffect(() => {
    convert();
  }, [amount, fromCurrency, toCurrency]);

  const convert = async () => {
    if (amount <= 0) {
      setConvertedAmount(0);
      return;
    }

    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await res.json();
      const rate = data.rates[toCurrency];
      setConvertedAmount((amount * rate).toFixed(2));
    } catch (error) {
      console.error("Error converting currency:", error);
    }
  };

  return (
    <div className="currency-container">
      <h2 className="currency-title">Currency Converter 💰</h2>

      <div className="input-group">
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="currency-input"
          placeholder="Enter amount"
          min="0"
        />
      </div>

      <div className="currency-row">
        <div className="input-group">
          <label>From</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)} className="currency-select">
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency} 
              </option>
            ))}
          </select>
        </div>

        <span className="exchange-icon">⇄</span>

        <div className="input-group">
          <label>To</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)} className="currency-select">
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency} 
              </option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={convert} className="convert-button">Convert</button>

      {convertedAmount !== null && (
        <p className="converted-result">💲 {convertedAmount} {toCurrency}</p>
      )}
    </div>
  );
};

export default CurrencyConverter;
