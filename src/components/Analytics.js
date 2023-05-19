import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Fetchnews from "./Fetchnews";
// import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";

/**
 * This is a functional component that sets and manages state values for loading, start and end dates,
 * and stock chart values.
 */
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

/**
 * This function fetches daily adjusted stock data from the Alpha Vantage API and sets the X and Y
 * values for a stock chart.
 */
  const fetchStock = async () => {
    const API_KEY = "WP8RSCAZJ8NVA8CF";
    const Stock_Symbol = inputValue;
    // const Stock_Symbol = "ALPHS.PAR"
    console.log(Stock_Symbol);
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

/* This code block is using the `useEffect` hook to fetch stock data from the Alpha Vantage API and set
the X and Y values for a stock chart. It is also checking if the `stockChartXValues` array is empty
and logging a message to the console if it is. The `useEffect` hook is triggered whenever the
`symbol` or `inputValue` variables change. */
  useEffect(() => {
    setLoading(true);
    fetchStock();
  }, [symbol, inputValue]);

   if(!stockChartXValues.length)
   {
      console.log("data no availabe:")
   }

/* This is the JSX code that is being returned by the `Analytics` functional component. It is rendering
a `div` element with a class name of "analytics-div" that contains a `h2` element with the text
"Stock Market". It also contains a conditional statement that checks if the `loading` state value is
true or false. If it is true, it renders a loading message. If it is false, it renders a `Plot`
component from the `react-plotly.js` library with data and layout properties. It also includes an
`onClick` event handler that calls the `handleClick` function. Additionally, there is another
conditional statement that checks if `startDate` and `endDate` are defined. If they are, it renders
a `Fetchnews` component with `startDate` and `endDate` props. If they are not defined, it renders a
message asking the user to select dates. */
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
      {startDate != undefined && endDate != undefined?(<Fetchnews startDate={startDate} endDate={endDate} />)
      : <h2>pls select the dates</h2>}

    </div>
  );
};

export default Analytics;
