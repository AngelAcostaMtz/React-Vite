import React, { useState, useEffect } from 'react';
import axios from 'axios';  
import '@fortawesome/fontawesome-free/css/all.css'
import Agregar_libro from './acciones';
import {Dialog} from 'primereact/dialog';

function BookList() {
  const [books, setBooks] = useState([]);
  const [libroNuevo, setLibroNuevo] = useState({ Titulo: "", Autor: "" });
  const [editBook, setEditBook] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/libros")
      .then((response) => {
        console.log(response);
        setBooks(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleInputLibro = (event) => {
    const { name, value } = event.target;
    setLibroNuevo({ ...libroNuevo, [name]: value });
  };

  const handleAgregarLibro = () => {
    console.log("llegue al post");
    axios
      .post("http://localhost:5000/api/libros", libroNuevo)
      .then((response) => {
        console.log(response);
        setBooks([...books, response.data]);
        setLibroNuevo({ Titulo: "", Autor: "" });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const EliminarLibro = (id) => {
    axios
      .delete(`http://localhost:5000/api/libros/${id}`)
      .then((response) => {
        console.log(response);
        setBooks(books.filter((book) => book.Id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleGuardarCambios = (book) => {
    axios
      .put(`http://localhost:5000/api/libros/${book.Id}`, book)
      .then((response) => {
        console.log(response);
        setBooks(books.map((b) => (b.Id === book.Id ? response.data : b)));
        setEditBook(null);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <head>
        {/* <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap" rel="stylesheet"/> */}
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Bruno+Ace+SC&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <a href="http://#">
        <h1 className="neon-title">FLENIX</h1>
      </a>
      <div className="flex-line">
        <div>
          <div>
            <label>Título: </label>
            <input
              type="text"
              name="Titulo"
              value={libroNuevo.Titulo}
              onChange={handleInputLibro}
            />
          </div>
          <div>
            <label>Autor: </label>
            <input
              type="text"
              name="Autor"
              value={libroNuevo.Autor}
              onChange={handleInputLibro}
            />
          </div>
        </div>

        <div>
          <Agregar_libro onClick={handleAgregarLibro} />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Autor</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={book.Id}>
              <td>{book.Titulo}</td>
              <td>{book.Autor}</td>
              <td>
                <div className="edit-container">
                  <i
                    className="fas fa-edit neon"
                    onClick={() => handleGuardarCambios(book)}
                  ></i>
                  <span className="edit-text">Editar</span>
                </div>
                <div className="delete-container">
                  <i
                    className="fas fa-trash neon"
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Estás seguro de que deseas eliminar este libro?"
                        )
                      ) {
                        EliminarLibro(book.Id);
                      }
                    }}
                  ></i>
                  <span className="delete-text">Eliminar</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
    </div>
  );
}

export default BookList;