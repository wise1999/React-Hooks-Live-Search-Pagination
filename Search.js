import React, { useState } from "react";
import { graphql, Link, useStaticQuery } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";

export default function Search() {
  const searchPosts = useStaticQuery(graphql`
    query SearchPosts {
      wpgraphql {
        posts(first: 1000) {
          nodes {
            uri
            title
          }
        }
      }
    }
  `);

  const searchPostsPrefix = searchPosts.wpgraphql.posts.nodes;

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const maxPage = Math.ceil(filteredData.length / postsPerPage);

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = searchPostsPrefix.filter((post) => {
      return post.title.toLowerCase().includes(searchWord.toLowerCase());
    });

    if (searchWord === "") {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = [];
  const totalPosts = filteredData.length;

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  function next() {
    setCurrentPage((currentPage) => Math.min(currentPage + 1, maxPage));
  }
  function prev() {
    setCurrentPage((currentPage) => Math.max(currentPage - 1, 1));
  }

  return (
    <>
      <div className="search-box mb-5">
        <input
          className="w-100"
          type="text"
          placeholder="Search in articles"
          value={wordEntered}
          onChange={handleFilter}
        />
        {filteredData.length !== 0 && (
          <div className="results-box position-relative">
            <button onClick={clearInput} className="close position-absolute">
              <StaticImage
                src="../../images/svg/cancel.svg"
                width={15}
                height={15}
                alt="Close"
                placeholder="tracedSVG"
              />
            </button>
            {filteredData
              .slice(indexOfFirstPost, indexOfLastPost)
              .map((post, index) => {
                return (
                  <Link
                    className="dataItem mb-1 d-block"
                    key={index}
                    title={post.title}
                    to={post.uri}
                  >
                    <p className="mb-0">{post.title} </p>
                  </Link>
                );
              })}
          </div>
        )}
        <ul className="pagination">
          {currentPage > 1 && currentPage <= maxPage ? (
            <li>
              <div
                className="page-number d-flex align-items-center"
                onClick={() => prev()}
              >
                <StaticImage
                  src="../../images/svg/left-arrow.svg"
                  width={15}
                  height={15}
                  alt="Previous Page"
                  placeholder="tracedSVG"
                />
              </div>
            </li>
          ) : null}
          {pageNumbers.map((number) => {
            if (currentPage === number) {
              return (
                <li key={number}>
                  <div className="current page-number">{number}</div>
                </li>
              );
            } else {
              return (
                <li key={number}>
                  <div onClick={() => paginate(number)} className="page-number">
                    {number}
                  </div>
                </li>
              );
            }
          })}
          {currentPage >= 1 && currentPage < maxPage ? (
            <li>
              <div
                className="page-number d-flex align-items-center"
                onClick={() => next()}
              >
                <StaticImage
                  src="../../images/svg/right-arrow.svg"
                  width={15}
                  height={15}
                  alt="Next Page"
                  placeholder="tracedSVG"
                />
              </div>
            </li>
          ) : null}
        </ul>
      </div>
    </>
  );
}
