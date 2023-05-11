import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { recommenderAxios, unauthorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";

function Book() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const context = useContext(RootContext);
  const [book, setBook] = useState(null);
  const [books, setBooks] = useState([]);

  const fetchAllSimilarBooks = async bookName => {
    try {
      const res = await recommenderAxios.get(`/recommend-books-info/${bookName}`);
      console.log("res:", res);
      const books = res.data;

      if (books?.data !== null) {
        setBooks(books);
      }
    } catch (err) {
      console.log("err:", err);
    }
  }

  const goToBookOrder = (bookId, bookName, bookImage, price, book) => {
    const params = { bookId, bookName, bookImage, price };

    navigate({
      pathname: "/place-order",
      search: `?${createSearchParams(params)}`
    }, { state: book });
  }

  const isItemExistInCart = (bookId) => {
    if (context.isLogin) {
      const items = JSON.parse(localStorage.getItem("cart"));

      if (items !== null) {
        for (let i = 0; i < items.length; ++i) {
          if (bookId === items[i].bookId) return true;
        }
      }
    }

    return false;
  }

  const addBookToCart = (book) => {
    if (context.isLogin) {
      const items = JSON.parse(localStorage.getItem("cart"));

      if (items !== null) {
        items.push(book);
        context.setCartItems(items);
        localStorage.setItem("cart", JSON.stringify(items));
      } else {
        const items = [];
        items.push(book);
        context.setCartItems(items);
        localStorage.setItem("cart", JSON.stringify(items));
      }
    }

    navigate("/book-cart");
  }

  const fetchBookById = async bookId => {
    try {
      const res = await unauthorizedAxios.get(`/book/fetch/${bookId}`);
      console.log("res:", res);
      const book = res.data;

      if (!(book.bookName.replaceAll(' ', '-') === params.bookName)) {
        navigate('/');
      }

      setBook(book);
      fetchAllSimilarBooks(book.bookName);
    } catch (err) {
      console.log("err:", err);
      navigate('/');
    }
  }

  const fetchBookFromURL = () => {
    const bookId = searchParams.get("bookId");
    fetchBookById(bookId);
  }

  useEffect(() => {
    if (context.isAdmin) {
      navigate('/');
    } else {
      fetchBookFromURL();
    }
  }, []);

  return (
    <div>
      <Helmet><title>{(book) ? book.bookName : "Loading..."} | BookWorm</title></Helmet>

      <div className="mx-6 flex">
        <div className="flex flex-col space-y-2">
          <div className="px-20 py-8 rounded-sm outline outline-1 outline-slate-300">
            <img className="w-72 h-96 border" src={book?.bookImage} alt="" />
          </div>
          <div className="flex space-x-2">
            {
              (isItemExistInCart(book?.bookId)) ?
                <button className="w-full py-4 uppercase font-semibold rounded-sm shadow-sm shadow-slate-400 text-white bg-[#ff9f00]" onClick={() => navigate("/book-cart")}>Go To Cart</button> :
                <button className="w-full py-4 uppercase font-semibold rounded-sm shadow-sm shadow-slate-400 text-white bg-[#ff9f00]" onClick={() => addBookToCart(book)}>Add To Cart</button>
            }
            {
              (book?.stock <= 0) ?
                <button className="cursor-auto w-full py-2 uppercase font-semibold rounded-sm text-slate-600 bg-slate-300" disabled={book?.stock <= 0}>Out of Stock</button> :
                <button className="w-full py-2 uppercase font-semibold rounded-sm shadow shadow-slate-400 text-white bg-[#fb641b]" onClick={() => goToBookOrder(book.bookId, book.bookName, book.bookImage, book.price, book)}>Buy Now</button>
            }
          </div>
        </div>
        <div className="relative px-10 py-8 flex flex-col">
          <span className="text-2xl text-slate-900">{book?.bookName} - (Dr. {book?.authors[0].authorName})</span>
          <span className="mt-4 font-medium text-3xl text-slate-900">₹{book?.price}</span>
          <span className="my-4 font-medium text-slate-900">Available offers</span>
          <span>
            <ul className="text-sm space-y-1">
              <li className="space-x-6">
                <span><i className="fa-solid fa-tags text-lg text-green-600"></i></span>
                <span><b>Bank Offer</b> Flat ₹100 Instant Cashback on Paytm Wallet. Min Order Value ₹1000. Valid once per Paytm account</span>
              </li>
              <li className="space-x-6">
                <span><i className="fa-solid fa-tags text-lg text-green-600"></i></span>
                <span><b>Bank Offer</b> 5% Cashback on Flipkart Axis Bank Card</span>
              </li>
              <li className="space-x-6">
                <span><i className="fa-solid fa-tags text-lg text-green-600"></i></span>
                <span><b>Partner Offer</b> Sign up for Flipkart Pay Later and get Flipkart Gift Card worth up to ₹1,000</span>
              </li>
              <li className="space-x-6">
                <span><i className="fa-solid fa-tags text-lg text-green-600"></i></span>
                <span><b>Partner Offer</b> Purchase now & get 1 surprise cashback coupon in Future</span>
              </li>
            </ul>
          </span>
          <span className="mt-4 flex space-x-10">
            <span className="font-medium text-slate-500">Author(s)</span>
            <ul className="list-disc text-slate-400">
              {
                book?.authors?.map((author, id) =>
                  <li key={author.authorId} style={{ fontWeight: (id === 1) ? "normal" : "bolder" }}><span className="text-black">{author.authorName}</span></li>
                )
              }
            </ul>
          </span>
          <span className="mt-4 flex space-x-10">
            <span className="font-medium text-slate-500">Highlights</span>
            <ul className="list-disc text-slate-400">
              <li><span className="text-sm text-black">Author: Dr. {book?.authors[0].authorName}</span></li>
              <li><span className="text-sm text-black">{book?.pageCount} Pages</span></li>
              <li><span className="text-sm text-black">Language: N/A</span></li>
              <li><span className="text-sm text-black">Publisher: N/A</span></li>
            </ul>
          </span>
          <div className="mt-4 space-x-2 text-center">
            <i className="fa-solid fa-shield-halved text-xl text-slate-700"></i>
            <span className="font-semibold text-slate-500">Safe and Secure Payments. Easy returns. 100% Authentic products. No Upfront Payments.</span>
          </div>
        </div>
      </div>
      <div className="mt-2">
        <hr />
        <div className="px-6 py-4">
          <h1 className="font-medium text-2xl text-slate-900">Similar Books</h1>
          <div className="mt-4">
            <div className="sm:container sm:mx-auto flex flex-wrap justify-center gap-4">
              {
                (books.length !== 0) ?
                  books?.map((book, id) =>
                    <div key={id} className="p-2 flex flex-col items-center space-y-2 rounded-sm border border-slate-400">
                      <img className="w-32 h-48 border duration-150 hover:scale-125" src={book?.bookImage} alt="" />
                      <span className="w-[200px] text-sm text-center">{book?.bookName}</span>
                      <span className="font-medium text-slate-600">~ {book?.author}</span>
                    </div>
                  ) :
                  <span className="text-lg opacity-50">No similar book found</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Book;
