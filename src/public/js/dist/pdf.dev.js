"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Escuchamos el click del botón
  var $boton = document.querySelector("#manifestar");
  $boton.addEventListener("click", function () {
    var $elementoParaConvertir = document.querySelector("#manifestante"); // <-- Aquí puedes elegir cualquier elemento del DOM

    html2pdf().set({
      margin: 0.2,
      filename: 'Validación.pdf',
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 3,
        // A mayor escala, mejores gráficos, pero más peso
        letterRendering: false
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: 'portrait' // landscape o portrait

      }
    }).from($elementoParaConvertir).save()["catch"](function (err) {
      return console.log(err);
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Escuchamos el click del botón
  var $boton = document.querySelector("#historial");
  $boton.addEventListener("click", function () {
    var div = document.getElementById("salto");
    div.classList.add("topHistorial");
    var $elementoParaConvertir = document.querySelector("#perfil"); // <-- Aquí puedes elegir cualquier elemento del DOM

    html2pdf().set({
      margin: [0.5, 0.2, 0.2, 0.2],
      //top, left, button, right
      filename: 'Historial.pdf',
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 3,
        // A mayor escala, mejores gráficos, pero más peso
        letterRendering: false
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: 'portrait' // landscape o portrait

      }
    }).from($elementoParaConvertir).save().then(function () {
      div.classList.remove("topHistorial");
    })["catch"](function (err) {
      return console.log(err);
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Escuchamos el click del botón
  var $boton = document.querySelector("#cancelarCedu");
  $boton.addEventListener("click", function () {
    var $elementoParaConvertir = document.querySelector("#cancelar"); // <-- Aquí puedes elegir cualquier elemento del DOM

    html2pdf().set({
      margin: 0.2,
      filename: 'Cancelación.pdf',
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 3,
        // A mayor escala, mejores gráficos, pero más peso
        letterRendering: false
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: 'portrait' // landscape o portrait

      }
    }).from($elementoParaConvertir).save()["catch"](function (err) {
      return console.log(err);
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  // Escuchamos el click del botón
  var $boton = document.querySelector("#certificacion");
  $boton.addEventListener("click", function () {
    var div = document.getElementById("addinput");
    div.classList.add("hidden");
    var $elementoParaConvertir = document.querySelector("#cer_id"); // <-- Aquí puedes elegir cualquier elemento del DOM

    html2pdf().set({
      margin: [0, 0.5, 0, 0.5],
      //top, left, button, right
      filename: 'Certificación.pdf',
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 3,
        // A mayor escala, mejores gráficos, pero más peso
        letterRendering: false
      },
      jsPDF: {
        unit: "in",
        format: "letter",
        orientation: 'portrait' // landscape o portrait

      }
    }).from($elementoParaConvertir).save().then(function () {
      document.getElementById("addinput").classList.remove("hidden");
    })["catch"](function (err) {
      return console.log(err);
    });
  });
});