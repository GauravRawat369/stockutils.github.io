import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import "./styles/CssSidebar.css";
import Analytics from "./components/Analytics";
import { useState } from "react";

function App() {

  return (
    <div className="main-div">
      <div className="main-body">
        <Router>
          <div className="content-div">
            <div className="input-field">
              <TickerSymbolSearch />
            </div>
            <Routes>
              <Route
                exact
                path="/analytics/:symbol"
                element={<Analytics />}
              />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
}

function TickerSymbolSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [symbol, setSymbol] = useState(null);
  const navigate = useNavigate();

  async function handleSearchInputChange(event) {
    const term = event.target.value;
    setSearchTerm(term);
    // Make a request to the Alpha Vintage API using the search term
    // Parse the response and update the suggestions
    const API_KEY = process.env.API_KEY_FOR_ST_DATA_AND_ST_TOCKEN
    const API_Call = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${API_KEY}`;

    const res = await fetch(API_Call);
    const data = await res.json();
    console.log(data);
    if (data && data.bestMatches && data.bestMatches.length > 0) {
      setSuggestions(data.bestMatches);
    }
    else
    {
      setSuggestions([]);
    }
  }

  function handleSuggestionClick(s) {
    const symbol = s["1. symbol"];
    setSymbol(symbol);
    navigate(`/analytics/${symbol}`);
    setSuggestions([]);
  }

  return (
    <div className=" input-div">
      <label className="search-input">Search for a Ticker Symbol:</label>
      <input
        className="input-bar"
        type="text"
        value={searchTerm}
        onChange={handleSearchInputChange}
      />  

{suggestions.length > 0 && (
        <ul className="search-results">
          {suggestions.map((s) => (
            <li key={s["1. symbol"]} onClick={() => handleSuggestionClick(s)}>
              {s["2. name"]} ({s["1. symbol"]})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;


