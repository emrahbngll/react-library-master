import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';
import Modal from '../components/Modal';
import { useSelector, useDispatch } from 'react-redux';

const ListBooks = (props) => {
  const dispatch = useDispatch();
  const { categoriesState, booksState } = useSelector((state) => state);
  console.log(categoriesState);
  console.log('booksState', booksState);

  const [filteredBooks, setFilteredBooks] = useState(null);
  //const [categories, setCategories] = useState(null);
  const [didUpdate, setDidUpdate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [silinecekKitap, setSilinecekKitap] = useState(null);
  const [silinecekKitapIsmi, setSilinecekKitapIsmi] = useState('');
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    const filtered = booksState.books.filter((item) =>
      item.name.toLowerCase().includes(searchText)
    );
    setFilteredBooks(filtered);
  }, [searchText]);
  const kitapSil = (id) => {
    console.log(`http://localhost:3004/books/${id}`);
    axios
      .delete(`http://localhost:3004/books/${id}`)
      .then((res) => {
        console.log('delete res', res);
        dispatch({ type: 'DELETE_BOOK', payload: id });
        setDidUpdate(!didUpdate);
        setShowModal(false);
      })
      .catch((err) => console.log(err));
  };
  if (
    booksState.success !== true ||
    categoriesState.success !== true ||
    filteredBooks === null
  ) {
    return <Loading />;
  }
  return (
    <div className="container my-5">
      <div className="my-3 d-flex justify-content-between">
        <div className="w-75">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search book name..."
            type="text"
            className="form-control"
            id="exampleInputEmail1"
          />
        </div>
        <Link to="/add-book" className="btn btn-primary">
          Add Book
        </Link>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Book Name</th>
            <th scope="col">Author</th>
            <th scope="col">Category</th>
            <th className="text-center" scope="col">
              ISBN
            </th>
            <th className="text-center" scope="col">
              Process
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.map((book) => {
            const category = categoriesState.categories.find(
              (cat) => cat.id == book.categoryId
            );
            return (
              <tr key={book.id}>
                <td>{book.name}</td>
                <td>{book.author}</td>
                <td>{category.name}</td>
                <td className="text-center">
                  {book.isbn === '' ? '-' : book.isbn}
                </td>
                <td>
                  <div className="btn-group" role="group">
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => {
                        setShowModal(true);
                        //kitapSil(book.id);
                        setSilinecekKitap(book.id);
                        setSilinecekKitapIsmi(book.name);
                      }}>
                      Delete
                    </button>
                    <Link
                      to={`/edit-book/${book.id}`}
                      className="btn btn-sm btn-outline-secondary">
                      Edit
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {showModal === true && (
        <Modal
          aciklama={`Silmek istediğinize emin misiniz?`}
          title={silinecekKitapIsmi}
          onConfirm={() => kitapSil(silinecekKitap)}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ListBooks;
