import React, { useContext, useEffect, useState } from "react";
import { authorizedAxios, unauthorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";
import SuccessToaster from "../toaster/SuccessToaster";

function AllBooks() {
  const context = useContext(RootContext);
  const [books, setBooks] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAllBook = async () => {
    try {
      const res = await unauthorizedAxios.get("/book/fetch-all");
      console.log("res:", res);
      setBooks(res.data);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const deleteBook = async bookId => {
    try {
      const res = await authorizedAxios(context.secretToken).delete(`/book/delete/${bookId}`);
      console.log("res:", res);
      fetchAllBook();
      setSuccessMessage(res.data);
    } catch (err) {
      console.log("err:", err);
    }
  }

  const deleteBookById = bookId => {
    deleteBook(bookId);
  }

  useEffect(() => {
    fetchAllBook();
  }, []);

  return (
    <div>
      <SuccessToaster message={successMessage} setMessage={setSuccessMessage} />

      <span>All Books</span>
      {
        books.map(book =>
          <div key={book.bookId} className="flex space-x-4">
            <span>{book.bookName}</span>
            <span>{book.pageCount}</span>
            <span>{book.stock}</span>
            <span>₹{book.price}</span>
            <button onClick={() => deleteBookById(book.bookId)}><i className="fa-solid fa-trash-can text-red-600"></i></button>
          </div>
        )
      }
    </div>
  );
}

export default AllBooks;
