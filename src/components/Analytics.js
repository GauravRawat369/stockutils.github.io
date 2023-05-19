import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Fetchnews from "./Fetchnews";
// import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";

const Analytics = () => {
  const { symbol } = useParams();
  const inputValue = symbol;
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [stockChartXValues, setStockChartXValues] = useState([]);
  const [stockChartYValues, setStockChartYValues] = useState([]);

  const handleClick = (data) => {
    if (data.points.length > 0) {
      // const selectedDate = data.points[0].x;
      let date1 = data.points[0].x.replaceAll("-", "");
      let date2 =
        new Date(data.points[0].x).getTime() + 7 * 24 * 60 * 60 * 1000;
      date2 = new Date(date2).toISOString().slice(0, 10).replaceAll("-", "");

      console.log("Selected date:", date1, "Next date:", date2);
      setStartDate(date1);
      setEndDate(date2);
      console.log(startDate);
      console.log(endDate);
    }
  };

  const fetchStock = async () => {
    const API_KEY = "WP8RSCAZJ8NVA8CF";
    const Stock_Symbol = inputValue;
    // const Stock_Symbol = "ALPHS.PAR"
    console.log(Stock_Symbol);
    // console.log(4)
    const API_Call_Stock = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${Stock_Symbol}&outputsize=full&apikey=${API_KEY}`;
    try {
      const res_stock = await fetch(API_Call_Stock);
      const data_stock = await res_stock.json();

      const stockChartXValuesFunction = [];
      const stockChartYValuesFunction = [];

      for (let key in data_stock["Time Series (Daily)"]) {
        if (key >= "2020-01-01") {
          stockChartXValuesFunction.push(key);
          stockChartYValuesFunction.push(
            data_stock["Time Series (Daily)"][key]["4. close"]
          );
        }
      }

      setStockChartXValues(stockChartXValuesFunction);
      setStockChartYValues(stockChartYValuesFunction);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchStock();
  }, [symbol, inputValue]);

  // if (!stockChartXValues.length) {
  //   return (
  //     <div className="loading-div">
  //       <h3>Loading... No data in api </h3>
  //     </div>
  //   );
  // }

  return (
    <div className="analylics-div">
      <h2>Stock Market</h2>
      {loading ? (
        <div className="loading-div">
          <h3>Loading...</h3>
        </div>
      ) : (
        <Plot
          data={[
            {
              x: stockChartXValues,
              y: stockChartYValues,
              type: "scatter",
              mode: "lines",
              fill: "tonexty",
              marker: { color: "blue" },
              fillcolor: "rgba(0, 0, 255, 0.3)",
            },
          ]}
          layout={{
            width: 790,
            height: 440,
            title: "A Fancy Plot",
            plot_bgcolor: "#white",
            paper_bgcolor: "#white",
            xaxis: {
              title: "Date",
              // showgrid: false
            },
            yaxis: {
              title: "Price",
              showgrid: false,
            },
          }}
          onClick={handleClick}
          config={{ displayModeBar: false }}
        />
      )}
      {/* <Searchsymbol/> */}
      ({startDate != undefined && endDate != undefined})&&(<Fetchnews startDate={startDate} endDate={endDate} />)
    </div>
  );
};

export default Analytics;
