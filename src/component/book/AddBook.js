import React, { useContext, useEffect, useState } from "react";
import Helmet from "react-helmet";
import { useNavigate } from "react-router-dom";
import { authorizedAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";
import { stringToHTML } from "../../util/stringToHTML";
import LoadToaster from "../../component/toaster/LoadToaster";

function AddBook() {
  const navigate = useNavigate();
  const context = useContext(RootContext);
  const [book, setBook] = useState({
    bookName: '',
    pageCount: undefined,
    price: undefined,
    stock: undefined,
    bookImage: ''
  });
  const [firstAuthor, setFirstAuthor] = useState({
    authorId: '',
    authorName: '',
    authorEmail: ''
  });
  const [totalAuthors, setTotalAuthors] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const addAuthorField = () => {
    const element = `
    <div class="author mb-4 flex flex-col space-y-4">
      <hr />
      <input type="text" name="aname${totalAuthors + 1}" id="aname${totalAuthors + 1}" placeholder="Author Name" />
      <input type="text" name="aemail${totalAuthors + 1}" id="aemail${totalAuthors + 1}" placeholder="Author Email" />
      <span class="text-xl font-medium uppercase text-center">OR</span>
      <input type="text" name="aid${totalAuthors + 1}" id="aid${totalAuthors + 1}" placeholder="Author ID" />
    </div>
    `;
    setTotalAuthors(e => e + 1);
    document.getElementsByClassName("more-authors")[0].appendChild(stringToHTML(element));
  }

  const addBook = async payload => {
    try {
      const res = await authorizedAxios(context.secretToken).post("/book/add", payload);
      console.log("res:", res);
      setIsLoading(false);
      setSuccessMessage(`Successfully Added Book - '${payload.bookName}'`);
    } catch (err) {
      console.log("err:", err);
      setIsLoading(false);
      setErrorMessage("Server Error");
    }
  }

  const addNewBook = (e) => {
    setIsLoading(true);
    const newBook = book;
    newBook.authors = [];

    if (firstAuthor.authorName === '') {
      newBook.authors = newBook.authors.concat({
        authorId: firstAuthor.authorId
      });
    } else {
      newBook.authors = newBook.authors.concat({
        authorName: firstAuthor.authorName,
        authorEmail: firstAuthor.authorEmail
      });
    }

    Array.from(document.getElementsByClassName("author")).forEach(e => {
      if (e.childNodes[9].value === '') {
        newBook.authors = newBook.authors.concat({
          authorName: e.childNodes[3].value,
          authorEmail: e.childNodes[5].value
        });
      } else {
        newBook.authors = newBook.authors.concat({
          authorId: e.childNodes[9].value
        });
      }
    });

    console.log(newBook);
    addBook(newBook);
    e.preventDefault();
  }

  useEffect(() => {
    if (!context.isAdmin) {
      navigate('/');
    }
  });

  return (
    <div>
      <Helmet><title>Add Some Books | BookWorm</title></Helmet>

      <LoadToaster
        isLoading={isLoading}
        loadingMessage={"Adding New Book"}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />

      <form className="w-[30%] p-4 flex flex-col space-y-4 bg-red-400" onSubmit={addNewBook}>
        <span className="text-xl font-medium">Add Book</span>
        <input type="text" name="bname" id="bname" value={book.bookName} onChange={(e) => setBook({ ...book, bookName: e.target.value })} placeholder="Book Name" />
        <input type="text" name="url" id="url" value={book.bookImage} onChange={(e) => setBook({ ...book, bookImage: e.target.value })} placeholder="Book Image URL" />
        <input type="number" name="pages" id="pages" value={book.pageCount} onChange={(e) => setBook({ ...book, pageCount: Number(e.target.value) })} placeholder="Pages" />
        <input type="number" name="price" id="price" value={book.price} onChange={(e) => setBook({ ...book, price: Number(e.target.value) })} placeholder="Price" />
        <input type="number" name="stock" id="stock" value={book.stock} onChange={(e) => setBook({ ...book, stock: Number(e.target.value) })} placeholder="Stock" />
        <span className="text-xl font-medium">Add Author Details</span>
        <input type="text" name="aname" id="aname" value={firstAuthor.authorName} onChange={(e) => setFirstAuthor({ ...firstAuthor, authorName: e.target.value })} placeholder="Author Name" />
        <input type="text" name="aemail" id="aemail" value={firstAuthor.authorEmail} onChange={(e) => setFirstAuthor({ ...firstAuthor, authorEmail: e.target.value })} placeholder="Author Email" />
        <span className="text-xl font-medium uppercase text-center">OR</span>
        <input type="text" name="aid" id="aid" value={firstAuthor.authorId} onChange={(e) => setFirstAuthor({ ...firstAuthor, authorId: e.target.value })} placeholder="Author ID" />

        <span className="more-authors"></span>

        <button type="button" className="px-2 self-start rounded border border-slate-950" onClick={addAuthorField}>+ Add Author</button>
        <button className="px-6 py-1.5 rounded font-medium text-yellow-400 bg-indigo-600">Add Book</button>
      </form>
    </div>
  );
}

export default AddBook;
