import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useNavigate } from "react-router-dom";
import { recommenderAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";

function TopBooks() {
  const navigate = useNavigate();
  const context = useContext(RootContext);
  const [books, setBooks] = useState([]);
  const [searchBooks, setSearchBooks] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const fetchAllBook = async () => {
    try {
      const res = await recommenderAxios.get("/top-50-books");
      console.log("res:", res);
      const books = res.data;
      setBooks(books);
      setFilteredBooks(books);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const filterBooks = () => {
    const searchedBooks = books.filter(book => {
      return book.bookName.toLowerCase().match(searchBooks.toLowerCase()) || book.author.toLowerCase().match(searchBooks.toLowerCase());
    });
    setFilteredBooks(searchedBooks);
  }

  useEffect(() => {
    if (context.isAdmin) {
      navigate('/');
    }
  });

  useEffect(() => {
    fetchAllBook();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchBooks]);

  return (
    <div>
      <Helmet><title>Top 50 Books | BookWorm</title></Helmet>

      <div className="m-4 space-y-4">
        <div className="p-2 flex justify-end">
          <input className="w-[35%] px-4 py-2 text-lg rounded outline-none shadow shadow-slate-400 text-blue-600" type="text" name="search" id="search" value={searchBooks} onChange={(e) => setSearchBooks(e.target.value)} placeholder="Search Book Here" />
        </div>
        <div className="sm:container sm:mx-auto flex flex-wrap justify-center gap-4">
          {
            (books.length === 0) &&
            <div className="spinner-container">
              <div className="mx-1 loading-spinner"></div>
              <span className="">Loading...</span>
            </div>
          }
          {
            (filteredBooks.length === 0 && books.length !== 0) &&
            <div className="spinner-container">
              <span className="">No result found for "<b>{searchBooks}</b>"</span>
            </div>
          }
          {
            filteredBooks.map((book, id) =>
              <div key={id} className="p-2 flex flex-col items-center space-y-2 rounded-sm border border-slate-400">
                <img className="w-32 h-48 border duration-150 hover:scale-125" src={book?.bookImage} alt="" />
                <span className="w-[200px] text-sm text-center">{book?.bookName}</span>
                <span className="font-medium text-slate-600">~ {book?.author}</span>
                <div className="px-1.5 py-0.5 flex justify-center items-center space-x-0.5 rounded text-xs text-white bg-[#388e3c]">
                  <div className="font-medium">{book?.rating.toPrecision(2)}</div>
                  <div className="mb-0.5"><i className="fa-sharp fa-solid fa-star text-[0.55rem]"></i></div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default TopBooks;
