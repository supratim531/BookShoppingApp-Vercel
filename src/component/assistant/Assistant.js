import React, { useContext, useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition/lib/SpeechRecognition";
import VoiceToaster from "../toaster/VoiceToaster";
import sound from "../../assets/accept.mp3";
import { createSearchParams, useNavigate } from "react-router-dom";
import { recommenderAxios } from "../../axios/axios";
import RootContext from "../../context/RootContext";
import useSpeechSynthesis from "react-speech-kit/dist/useSpeechSynthesis";

function Assistant() {
  const { speak } = useSpeechSynthesis();
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const navigate = useNavigate();
  const context = useContext(RootContext);
  const [voiceOver, setVoiceOver] = useState(true);

  const isItemExistInCart = bookId => {
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

  const addBookToCart = book => {
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

  const goToBookOrder = (bookId, bookName, bookImage, price, book) => {
    const params = { bookId, bookName, bookImage, price };

    navigate({
      pathname: "/place-order",
      search: `?${createSearchParams(params)}`
    }, { state: book });
  }

  const takeAction = (query, result) => {
    let random = 0;
    let responses = [];

    console.log("TAG:", result);

    if (query.match("bye") || query.match("buy") || query.match("order") || result === "order-action") {
      if (context.isLogin) {
        if (context.user.customer.addresses.length === 0) {
          navigate("/account-profile/address");
          speak({ text: "You have to have at least one address to place order." });
        } else {
          const foundedBooks = context.books.filter(book => {
            return query.toLowerCase().match(book.bookName.toLowerCase().split('(')[0].trim());
          });
          const foundedBook = foundedBooks[0];
          console.log("FOUND:", foundedBook);

          if (foundedBook) {
            goToBookOrder(foundedBook.bookId, foundedBook.bookName, foundedBook.bookImage, foundedBook.price, foundedBook);
            speak({ text: `Almost there, now select the quantity and buy ${foundedBook.bookName.split('(')[0].trim()} for free.` });
          } else {
            speak({ text: `It seems the book is not available to buy, please provide accurate book name.` });
          }
        }
      } else {
        navigate("/login");
        speak({ text: "Please login first to place your order." });
      }
    } else if (query.match("add") || query.match("save") || query.match("to cart") || result === "cart-action") {
      if (context.isLogin) {
        const foundedBooks = context.books.filter(book => {
          return query.toLowerCase().match(book.bookName.toLowerCase().split('(')[0].trim());
        });
        const foundedBook = foundedBooks[0];
        console.log("FOUND:", foundedBook);

        if (foundedBook) {
          if (!isItemExistInCart(foundedBook.bookId)) {
            addBookToCart(foundedBook);
            speak({ text: `Added ${foundedBook.bookName.split('(')[0].trim()} inside cart.` });
          } else {
            speak({ text: `${foundedBook.bookName.split('(')[0].trim()} is already present inside cart.` });
          }
        } else {
          speak({ text: `Sorry couldn't find the book. Could you provide more accurate name of the book?` });
        }
      } else {
        navigate("/login");
        speak({ text: "Please login first to use cart." });
      }
    } else if (result === "harry-potter") {
      if (query.toLowerCase().match("rowling") || query.toLowerCase().match("jk rowling")) {
        responses = [
          "Here is a book of J. K. Rowling.",
          "I have found this one of J. K. Rowling.",
          "Here is your search result of J. K. Rowling."
        ];
        random = Math.floor(Math.random() * responses.length);
      } else {
        responses = [
          "Here is your result.",
          "Here it is, check this once.",
          "I have got this one for you.",
          "Here is a book of Harry Potter.",
          "Here is some results of Harry Potter.",
          "I have found this, hope you will like it.",
          "I have tried to find some of Harry Potter."
        ]
        random = Math.floor(Math.random() * responses.length);
      }

      const foundedBooks = context.books.filter(book => {
        return query.toLowerCase().match(book.bookName.toLowerCase().split('(')[0].trim());
      });
      const foundedBook = foundedBooks[0];
      console.log("FOUND:", foundedBook);

      if (foundedBook) {
        navigate(`/book/${foundedBook.bookName.replaceAll(' ', '-')}?bookId=${foundedBook.bookId}`);
      } else {
        navigate("/book/Harry-Potter-and-the-Sorcerer's-Stone-(Book-1)?bookId=BWBK17601");
      }

      speak({ text: responses[random] });
    } else if (result === "the-dark-tower") {
      if (query.toLowerCase().match("stephen king") || query.toLowerCase().match("stephen")) {
        responses = [
          "Here is a book of Stephen King.",
          "I have found this one of Stephen King.",
          "Here is your search result of Stephen King."
        ];
        random = Math.floor(Math.random() * responses.length);
      } else {
        responses = [
          "Here is your result.",
          "Here it is, check this once.",
          "I have got this one for you.",
          "Here is a book of The Dark Tower.",
          "Here is some results of The Dark Tower.",
          "I have found this, hope you will like it.",
          "I have tried to find some of The Dark Tower."
        ]
        random = Math.floor(Math.random() * responses.length);
      }

      const foundedBooks = context.books.filter(book => {
        return query.toLowerCase().match(book.bookName.toLowerCase().split('(')[0].trim());
      });
      const foundedBook = foundedBooks[0];
      console.log("FOUND:", foundedBook);

      if (foundedBook) {
        navigate(`/book/${foundedBook.bookName.replaceAll(' ', '-')}?bookId=${foundedBook.bookId}`);
      } else {
        navigate("/book/The-Drawing-of-the-Three-(The-Dark-Tower,-Book-2)?bookId=BWBK17602");
      }

      speak({ text: responses[random] });
    } else {
      const responses = [
        "I don't understand, please repeat once.",
        "Please say again, I couldn't understand.",
        "I haven't understood, please repeat once."
      ];
      const random = Math.floor(Math.random() * responses.length);

      speak({ text: responses[random] });
    }
  }

  const fetchAssistantAnswer = async query => {
    try {
      const res = await recommenderAxios.get(`/assistant-response?query=${query}`);
      console.log("res:", res);
      const result = res.data.data;
      setVoiceOver(true);
      takeAction(query, result);
    } catch (err) {
      console.log("err:", err);
      setVoiceOver(true);
    }
  }

  useEffect(() => {
    console.log("Mic supported:", browserSupportsSpeechRecognition);

    if (!browserSupportsSpeechRecognition) {
      alert("Your Browser doesn't support Speech To Text");
    }
  }, []);

  useEffect(() => {
    if (!listening && !voiceOver) {
      const acceptanceSound = new Audio(sound);
      acceptanceSound.play();
      fetchAssistantAnswer(transcript);
    }
  }, [listening]);

  return (
    <div>
      {
        listening &&
        <VoiceToaster input={transcript} listening={listening} />
      }

      <button className="px-3.5 py-2 fixed bottom-[50%] right-10 rounded-full shadow shadow-slate-600 bg-white" onClick={() => {
        setVoiceOver(false);
        SpeechRecognition.startListening();
      }}>
        <i className="fa-solid fa-microphone text-2xl text-blue-800"></i>
      </button>
    </div>
  );
}

export default Assistant;
