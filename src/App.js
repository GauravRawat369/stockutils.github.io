// import { BrowserRouter as Router, Routes ,Route , useNavigate, useParams } from "react-router-dom";
// import "./App.css";
// import "./styles/CssSidebar.css";
// import Sidebar from "./components/Sidebar";
// import News from "./components/News";
// import Notification from "./components/Notification";
// import Analytics from "./components/Analytics";
// import { useState,useEffect } from "react";

// function App() {
//   const [inputValue, setInputValue] = useState('');
//   const [symbol, setSymbol] = useState(null);

//   const handleInputChange = (event) => {
//     setInputValue(event.target.value);
//   };



//   const fetchSymbol = async () => {
//     const stock =  inputValue;
//     // const stock = "GOOG"
//     console.log(inputValue)
//     const API_KEY = "WP8RSCAZJ8NVA8CF";
//   const API_Call = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stock}&apikey=${API_KEY}`;

//   const res = await fetch(API_Call);
//   const data = await res.json();
//   if (data && data.bestMatches && data.bestMatches.length > 0) {
//     setSymbol(data.bestMatches[0]["1. symbol"]);
//     // console.log(symbol);
//     // console.log(1);
  
//   }
// }
//   useEffect(() => {
//     fetchSymbol();
//   },[inputValue,symbol]);

//   return (
//     <div className="main-div">
//       <div className="main-body">
//         <Router>
//         <Sidebar />
//           <div className="content-div">
//             <div className="input-field">
//               <input type="text" value={inputValue} onChange={handleInputChange}/>
//               <SearchButton inputValue={inputValue} />
//               {/* <TickerSymbolSearch/> */}
//             </div>
//             <Routes>
//               <Route exact path="/news1" element={<News />} />
//               <Route exact path="/analytics2" element={<Analytics />} />  
//               <Route exact path="/notification3" element={<Notification />} />
//             </Routes>
//           </div>
//         </Router>
//       </div>
//     </div>
//   );
// }

// function SearchButton() {
//   const navigate = useNavigate();
//   const { symbol } = useParams();
//   const handleAnalyticsClick = () => {
//     navigate(`/analytics2/${symbol}`);
//   };

//   return (
//     <div>
//       <button onClick={handleAnalyticsClick}>Search</button>
//     </div>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import "./styles/CssSidebar.css";
import Sidebar from "./components/Sidebar";
import News from "./components/News";
import Notification from "./components/Notification";
import Analytics from "./components/Analytics";
import { useState } from "react";

function App() {
  return (
    <div className="main-div">
      <div className="main-body">
        <Router>
          <Sidebar />
          <div className="content-div">
            <div className="input-field">
              <TickerSymbolSearch />
            </div>
            <Routes>
              <Route exact path="/news1" element={<News />} />
              <Route
                exact
                path="/analytics2/:symbol"
                element={<Analytics />}
              />
              <Route exact path="/notification3" element={<Notification />} />
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
    const API_KEY = "WP8RSCAZJ8NVA8CF";
    const API_Call = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${API_KEY}`;

    const res = await fetch(API_Call);
    const data = await res.json();

    if (data && data.bestMatches && data.bestMatches.length > 0) {
      setSuggestions(data.bestMatches);
    }
  }

  function handleSuggestionClick(s) {
    const symbol = s["1. symbol"];
    setSymbol(symbol);
    navigate(`/analytics2/${symbol}`);
  }

  return (
    <div>
      <label htmlFor="search-input">Search for a Ticker Symbol:</label>
      <input
        id="search-input"
        type="text"
        value={searchTerm}
        onChange={handleSearchInputChange}
      />  

      <ul>
        {suggestions.map((s) => (
          <li key={s["1. symbol"]} onClick={() => handleSuggestionClick(s)}>
            {s["2. name"]} ({s["1. symbol"]})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


