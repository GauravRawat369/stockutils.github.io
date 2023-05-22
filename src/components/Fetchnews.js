import React, { useState, useEffect } from "react";


function FetchNews(props) {
  /* `const [articles, setArticles] = useState([]);` initializes a state variable `articles` with an
  empty array and a function `setArticles` to update the state variable. */
  const [articles, setArticles] = useState([]);
  const [pending, setpending] = useState([true]);
/* `useEffect` is a hook in React that allows you to perform side effects in function components. In
this code, `useEffect` is used to fetch news articles from the New York Times API based on the
`startDate` and `endDate` props passed to the component. */
  useEffect(() => {
    function execute() {
      const { startDate, endDate } = props;
      console.log("inside news start date ",startDate," ","end date ",endDate);
      const api_Key = "aMfMxyiKotndaOeY6qsmZVm5IIQroT1G"
      const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${startDate}&end_date=${endDate}&q=stock&sort=relevance&api-key=${api_Key}`;
      const options = {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      };
      fetch(url, options)
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
          return Promise.reject(response);
        })
        .then((data) => {
          const articles = JSON.parse(data).response.docs;
          setArticles(articles);
          setpending(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    /* `execute();` is calling the function that fetches news articles from the New York Times API
    based on the `startDate` and `endDate` props passed to the component. It is being called inside
    the `useEffect` hook to ensure that the function is executed whenever the `startDate` and
    `endDate` props change. */
    execute();
    /* `[props.startDate, props.endDate]);` is passing an array of dependencies to the `useEffect`
  hook. This means that the effect will only be executed when either `props.startDate` or
  `props.endDate` changes. This is useful because it ensures that the news articles are only
  fetched when the date range changes, rather than on every render of the component. */
  }, [props.startDate, props.endDate]);
  
/*below code is just a format in which news api response will be vissible*/
  return (
    <div className="center-div">
      <h1>New York Times Articles</h1>
      <div className="loading">{pending && <h2>Fetching your news.....</h2>}</div>
      <ul className="center-div">
        {articles.map((article, index) => (
          <div className="news-card" key={index}>
            <div className="news-card-content">
              <h3 className="news-title">{article.headline.main}</h3>
              <p className="about-news">
                {/* {article.abstract?.substring(0, 90) + "... "} */}
                {article.snippet}
              </p>
              <div className="read-more-div">
                <h4 className="news-author">{article.byline.original?.substring(0, 30)}</h4>
                <a href={article.web_url} target="_blank" rel="noreferrer">
                  <button className="readme-btn">Read more</button>
                </a>
              </div>
            </div>
            {article.multimedia && (
              <div className="cover img-cover">
                <img
                  className="news-img"
                  src={article.multimedia?.[0]?.url ?
                    `https://nytimes.com/${article.multimedia[0].url}` : 
                    'https://upload.wikimedia.org/wikipedia/commons/4/40/New_York_Times_logo_variation.jpg'
                }
                  alt="news images"
                />
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
}

export default FetchNews;