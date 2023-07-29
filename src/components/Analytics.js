import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Fetchnews from "./Fetchnews";
// import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";
// require('dotenv').config();


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
  const [stockChartColors, setStockChartColors] = useState([]);
  const [apiFetched, setApiFetched] = useState(false);

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
    const API_KEY = process.env.API_KEY_FOR_ST_DATA_AND_ST_TOCKEN
    const Stock_Symbol = inputValue;
    // const Stock_Symbol = "APPH.DEX"
    console.log(Stock_Symbol);
    const API_Call_Stock = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol=${Stock_Symbol}&outputsize=full&apikey=${API_KEY}`;
    try {
      const res_stock = await fetch(API_Call_Stock);
      const data_stock = await res_stock.json();
      setApiFetched(true);
      console.log(data_stock);

      const stockChartXValuesFunction = [];
      const stockChartYValuesFunction = [];
      const stockChartOpenValues = [];
      const stockChartCloseValues = [];

      for (let key in data_stock["Weekly Adjusted Time Series"]) {
        if (key >= "2019-01-01") {
          // console.log("Valid date key:", key);
          stockChartXValuesFunction.push(key);
          stockChartYValuesFunction.push(
            data_stock["Weekly Adjusted Time Series"][key]["4. close"]
          );
          stockChartOpenValues.push(
            data_stock["Weekly Adjusted Time Series"][key]["1. open"]
          );
          stockChartCloseValues.push(
            data_stock["Weekly Adjusted Time Series"][key]["4. close"]
          );
        }
      }
      var noHikeDay = false;
      const stockChartColors = [];
      for (let i = 0; i < stockChartOpenValues.length - 1; i++) {
        const nextOpenPrice = stockChartOpenValues[i + 1];
        const currentClosePrice = stockChartCloseValues[i];
        const percentageChange =
          ((nextOpenPrice - currentClosePrice) / currentClosePrice) * 100;
        if (percentageChange > 10) {
          stockChartColors.push("red");
          console.log(
            "close price ",
            currentClosePrice,
            " open price ",
            nextOpenPrice,
            " change",
            percentageChange
          );
          noHikeDay = true;
        } else {
          stockChartColors.push("blue");
        }
      }
      if (noHikeDay === false) {
        console.log("no data with given hike");
      }
      console.log(stockChartYValuesFunction);
      setStockChartXValues(stockChartXValuesFunction);
      setStockChartYValues(stockChartYValuesFunction);
      setStockChartColors(stockChartColors);
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
    if (!apiFetched) {
      fetchStock();
    }
  }, [apiFetched]);

  if (!stockChartXValues.length) {
    console.log("data no availabe:");
  }

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
              line: {
                color: "#0000FF",
              },
              name:"stock price",
              fillcolor: "rgba(0, 0, 255, 0.3)",
            },
            {
              x: stockChartXValues.filter(
                (_, i) => stockChartColors[i] === "red"
              ),
              y: stockChartYValues.filter(
                (_, i) => stockChartColors[i] === "red"
              ),
              type: "scatter",
              mode: "markers",
              marker: {
                color: "#FF0000",
                size: 8,
              },
              name: "10% hikes",
            },
          ]}
          layout={{
            autosize: true,
            legend: {"orientation": "h"},
            margin: {
              l: 50,
              r: 50,
              b: 50,
              t: 50,
            },
    //         paper_bgcolor:'rgba(0,0,0,0)',
    // plot_bgcolor:'rgba(0,0,0,0)'
   
          }}
          onClick={handleClick}  // for selecting dates
          config={
            { 
              displayModeBar: false,
              responsive:true,
              maintainAspectRatio	: false
            }
          }
        />
      )}
      {startDate !== undefined && endDate !== undefined ? (
        <Fetchnews startDate={startDate} endDate={endDate} />
      ) : (
        <div></div> // Render an empty div when startDate or endDate is undefined
      )}
    </div>
  );
};

export default Analytics;
