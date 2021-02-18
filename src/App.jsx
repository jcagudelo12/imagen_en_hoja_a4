import React, { useState } from "react";
import { useForm } from "react-hook-form";

function App() {
  const widthA4 = 796;
  const heigthA4 = 1123;
  const { register, handleSubmit } = useForm();

  const [upload, setUpload] = useState(false);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);
  const [ratio, setRatio] = useState(0);
  const [newWidth, setNewWidth] = useState(0);
  const [newHeight, setNewHeight] = useState(0);
  const [shape, setShape] = useState("");

  async function rate(width, height) {
    setOriginalWidth(width);
    setOriginalHeight(height);
    var auxShape;
    if (width > height) {
      setRatio(width / height);
      auxShape = "Horizontal";
    } else {
      setRatio(height / width);
      auxShape = "Vertical";
    }
    return await auxShape;
  }
  async function reSizeImg() {
    if (originalHeight > originalWidth) {
      if (originalHeight > heigthA4) {
        setNewHeight(heigthA4);
        setNewWidth(Math.round(heigthA4 / ratio));
      } else if (originalWidth > widthA4) {
        setNewWidth(widthA4);
        setNewHeight(Math.round(widthA4 * ratio));
      } else {
        setNewWidth(originalWidth);
        setNewHeight(originalHeight);
      }
    } else if (originalWidth > originalHeight) {
      if (originalWidth > heigthA4) {
        setNewWidth(heigthA4);
        setNewHeight(Math.round(heigthA4 / ratio));
      } else if (originalHeight > widthA4) {
        setNewHeight(widthA4);
        setNewWidth(Math.round(widthA4 * ratio));
      } else {
        setNewWidth(originalWidth);
        setNewHeight(originalHeight);
      }
    } else {
      if (originalWidth > widthA4) {
        setNewHeight(widthA4);
        setNewWidth(widthA4);
        return;
      } else {
        setNewHeight(originalHeight);
        setNewWidth(originalWidth);
      }
    }
  }

  const addImage = (e) => {
    if (e.picture.length === 0) {
      console.log("No ha seleccionado ninguna imagen.");
      return;
    }

    getBase64(e.picture[0])
      .then((base64) => {
        localStorage.setItem("imgData", JSON.stringify(base64));
      })
      .then(() => {
        const imageA = new Image();
        imageA.src = JSON.parse(localStorage.getItem("imgData"));

        rate(imageA.width, imageA.height).then((res) => {
          setShape(res);
        });
        reSizeImg();

        setUpload(true);
      });
  };

  async function getBase64(fileNew) {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(fileNew);
    });
  }
  const imageA = new Image();
  imageA.src = JSON.parse(localStorage.getItem("imgData"));

  const clearImage = () => {
    setUpload(false);
    localStorage.clear();
  };

  return (
    <div className="container mt-2">
      <h1 className="text-center">Procesar el tamaño de la imagen.</h1>
      <hr />
      <div className="row">
        <h4 className="text-center mt-5">
          A continuación podrá procesar la imagen para ajustarla al tamaño de
          hoja A4.
        </h4>
        <div className="col-md-6">
          <form
            className="mt-5 text-center"
            onSubmit={
              upload ? handleSubmit(clearImage) : handleSubmit(addImage)
            }
          >
            <input
              type="file"
              className="form-control mb-2"
              placeholder="Ingrese la tarea..."
              name="picture"
              accept="image/jpeg"
              ref={register}
            />
            <button
              type="submit"
              className={
                upload
                  ? "btn btn-warning btn-block btn-lg mt-2 mx-3"
                  : "btn btn-dark btn-block btn-lg mt-2"
              }
            >
              {upload ? (
                <i className="fas fa-trash-alt"> Limpiar</i>
              ) : (
                <i className="fas fa-share-square"> Procesar</i>
              )}
            </button>
          </form>
        </div>
        <div className="col-md-6 text-center">
          <img
            alt="imagen"
            src={imageA.src}
            className={upload ? "w-50" : "d-none"}
          />
        </div>
        <div className={upload ? "col-12 mt-5 text-center" : "d-none"}>
          {/* <h4>
            {shape === "Horizontal"
              ? "Ancho de la imagen: " + newWidth
              : "Alto de la imagen: " + newHeight}
          </h4>
          <h4>
            {shape === "Vertical"
              ? "Ancho de la imagen: " + newHeight
              : "Alto de la imagen: " + newWidth}
          </h4> */}
          <h4>{"Ancho de la imagen: " + newWidth + " px"}</h4>
          <h4>{"Alto de la imagen: " + newHeight + " px"}</h4>
          <h4>{"Orientación: " + shape}</h4>
        </div>
      </div>
    </div>
  );
}

export default App;
