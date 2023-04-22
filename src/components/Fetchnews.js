// import React, { useState, useEffect } from "react";

// function FetchNews(props) {
//   const [articles, setArticles] = useState([]);
//   const [pending, setpending] = useState([true]);
//   useEffect(() => {
//     function execute() {
//       const { startDate, endDate } = props;
//         // const startDate = "20210101";
//         // const endDate = "20210131";
//       const apiKey = "aMfMxyiKotndaOeY6qsmZVm5IIQroT1G";
//       const url = `https://api.nytimes.com/svc/search/v2/articlesearch.json?begin_date=${startDate}&end_date=${endDate}&q=stock&sort=relevance&api-key=${apiKey}`;
//       const options = {
//         method: "GET",
//         headers: {
//           Accept: "application/json",
//         },
//       };
//       fetch(url, options)
//         .then((response) => {
//           if (response.ok) {
//             return response.text();
//           }
//           return Promise.reject(response);
//         })
//         .then((data) => {
//           const articles = JSON.parse(data).response.docs;
//           setArticles(articles);
//           setpending(false);
//         })
//         .catch((err) => {
//           console.error(err);
//         });
//     }
//     execute();
//   }, [props.startDate, props.endDate]);
  

//   return (
//     <div className="center-div">
//       <h1>New York Times Articles</h1>
//       <div className="loading">{pending && <h2>Select Date</h2>}</div>
//       <ul className="center-div">
//         {articles.map((article, index) => (
//           <div className="news-card" key={index}>
//             <div className="news-card-content">
//               <h3 className="news-title">{article.headline.main}</h3>
//               <p className="about-news">
//                 {/* {article.abstract?.substring(0, 90) + "... "} */}
//                 {article.snippet}
//               </p>
//               <div className="read-more-div">
//                 <h4 className="news-author">{article.byline.original?.substring(0, 30)}</h4>
//                 <a href={article.web_url} target="_blank" rel="noreferrer">
//                   <button className="readme-btn">Read more</button>
//                 </a>
//               </div>
//             </div>
//             {article.multimedia && (
//               <div className="cover img-cover">
//                 <img
//                   className="news-img"
//                   src={article.multimedia?.[0]?.url ?
//                     `https://nytimes.com/${article.multimedia[0].url}` : 
//                     'https://upload.wikimedia.org/wikipedia/commons/4/40/New_York_Times_logo_variation.jpg'
//                 }
//                   alt="news images"
//                 />
//               </div>
//             )}
//           </div>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default FetchNews;