import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { unauthorizedAxios } from "../../axios/axios";
import Assistant from "../assistant/Assistant";

function Books() {
  const [books, setBooks] = useState([]);
  const [searchBooks, setSearchBooks] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);

  const fetchAllBook = async () => {
    try {
      const res = await unauthorizedAxios.get("/book/fetch-all");
      console.log("res:", res);
      setBooks(res.data);
      setFilteredBooks(res.data);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const filterBooks = () => {
    const searchedBooks = books.filter(book => {
      return book.bookName.toLowerCase().match(searchBooks.toLowerCase()) || book.authors[0].authorName.toLowerCase().match(searchBooks.toLowerCase());
    });
    setFilteredBooks(searchedBooks);
  }

  useEffect(() => {
    fetchAllBook();
  }, []);

  useEffect(() => {
    filterBooks();
  }, [searchBooks]);

  return (
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
          filteredBooks.map(book =>
            <div key={book.bookId} className="p-2 flex flex-col items-center space-y-2 rounded-sm border border-slate-400">
              <Link to={`/book/${book.bookName.replaceAll(' ', '-')}?bookId=${book.bookId}`}>
                <img className="cursor-pointer w-32 h-48 border duration-150 hover:scale-125" src={book.bookImage} alt="" />
              </Link>
              <Link className="cursor-pointer w-[200px] text-sm text-center hover:font-medium hover:text-blue-600" to={`/book/${book.bookName.replaceAll(' ', '-')}?bookId=${book.bookId}`}>
                <span>{book.bookName}</span>
              </Link>
              <span className="font-medium text-slate-600">~ {book?.authors[0].authorName}</span>
              <span className="text-lg font-medium">₹{book.price} <span className="text-slate-400">({book.stock})</span></span>
            </div>
          )
        }
      </div>
      <Assistant />
    </div>
  );
}

export default Books;
