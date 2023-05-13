"use strict";

$(function () {
  $("#clave_ine").autocomplete({
    name: 'clave_ine',
    source: '/search-manifestar?key=%QUERY',
    focus: function focus(event, ui) {
      event.preventDefault();
      $("#clave_ine").val(ui.item.label);
    },
    select: function select(event, ui) {
      $("#id_contribuyente").val(ui.item.value.id_contribuyente);
      $("#clave_ine").val(ui.item.label);
      $("#nombre").val(ui.item.value.nombre);
      $("#apellido_paterno").val(ui.item.value.apellido_paterno);
      $("#apellido_materno").val(ui.item.value.apellido_materno);
      $("#domicilio_parcelario").val(ui.item.value.domicilio_parcelario);
      return false;
    },
    limit: 4
  });
});
$('#subirimg1').click(function () {
  $('#img_fierro').click();
});
/* PREVISUALIZAR IMAGEN DE GESTOR DE ARCHIVOS */

var imgInput = document.getElementById('img_fierro');
var imgPreview = document.getElementById('subirimg1');
imgInput.addEventListener('change', function () {
  if (this.files && this.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      imgPreview.src = e.target.result;
    };

    reader.readAsDataURL(this.files[0]);
  } else {
    imgPreview.src = './img/fierro.png';
  }
});
/* VALIDAR ANTES DE MANDAR FORMULARIO */

function validarFormulario() {
  // Validar que todas las casillas estén llenas
  var inputs = document.getElementsByTagName("input");

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].hasAttribute("required") && inputs[i].value === "") {
      Swal.fire("Error", "Por favor, complete todas las casillas", "error");
      return false;
    }
  } // Confirmar si se desea enviar los datos


  Swal.fire({
    position: 'top-end',
    title: '¿Estás seguro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '¡Sí, estoy seguro!'
  }).then(function (result) {
    if (result.isConfirmed) {
      // Si se confirma, enviar los datos
      document.querySelector(".div-info").submit();
      Swal.fire({
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });
    } else {
      // Si se cancela, no hacer nada
      return false;
    }
  });
}