import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./App.css";

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [rate, setRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("https://api.exchangerate-api.com/v4/latest/USD")
      .then(response => response.json())
      .then(data => setCurrencies([...Object.keys(data.rates), "BTC", "ETH"]));
  }, []);

  const convertCurrency = async () => {
    setLoading(true);
    if (from === "BTC" || from === "ETH" || to === "BTC" || to === "ETH") {
      setRate(null);
      setResult("Cryptocurrency conversion not available yet");
    } else {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const data = await response.json();
      setRate(data.rates[to]);
      setResult((amount * data.rates[to]).toFixed(2));
      setHistory([...history, { date: new Date().toLocaleDateString(), rate: data.rates[to] }]);
    }
    setLoading(false);
  };

  const swapCurrencies = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setRate(null);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
      <h2 className="title">Currency Converter</h2>
      <div className="input-group">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />
      </div>
      <div className="select-group">
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="select">
          {currencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
        <button className="swap-button" onClick={swapCurrencies}>🔄</button>
        <select value={to} onChange={(e) => setTo(e.target.value)} className="select">
          {currencies.map((cur) => (
            <option key={cur} value={cur}>{cur}</option>
          ))}
        </select>
      </div>
      <button onClick={convertCurrency} className="button" disabled={loading}>
        {loading ? "Converting..." : "Convert"}
      </button>
      {rate && <p className="exchange-rate">1 {from} = {rate} {to}</p>}
      {result && <h3 className="result">Converted Amount: {result} {to}</h3>}
      {history.length > 0 && (
        <div className="chart">
          <h3>Exchange Rate History</h3>
          <Chart
            options={{ xaxis: { categories: history.map(h => h.date) } }}
            series={[{ name: "Rate", data: history.map(h => h.rate) }]}
            type="line"
            width="100%"
          />
        </div>
      )}
    </div>
  );
}