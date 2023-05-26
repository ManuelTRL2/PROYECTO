"use strict";

$(function () {
  $("#busqueda-tramites").autocomplete({
    name: 'busqueda-tramites',
    source: '/ticket-search?key=%QUERY',
    focus: function focus(event, ui) {
      event.preventDefault();
      $("#busqueda-tramites").val(ui.item.label);
    },
    select: function select(event, ui) {
      var id = uuid.v4();
      var fecha1 = document.getElementById('fecha_inscripcion').value;
      var fecha2 = document.getElementById('fecha').value;
      var actual_fe = document.getElementById('fecha_actual').innerText;
      var row = "\n                    <tr id=\"".concat(id, "\" class=\"registro\">\n                        <td class=\"columna1\" data-label=\"Clave\">\n                        <input type=\"hidden\" value=\"").concat(id, "\" class=\"identificadores\">\n                        <input type=\"hidden\" value=\"").concat(ui.item.value.costo, "\" id=\"").concat(id, "-costo\">\n                        <span hidden  id=\"").concat(id, "-id_tramites\">").concat(ui.item.value.id, "</span>\n                        <span  id=\"").concat(id, "-clave\">").concat(ui.item.value.clave, "</span>\n                    </td>\n                    <td class=\"columna2\">\n                            <input  id=\"").concat(id, "-unidades\" value=\"1\" onchange=\"sumarImporte('").concat(id, "')\" data-v-8a398dfb=\"\" class=\" tama\xF1o-ticke tx-textinput box md borde texto\"\n                                type=\"text\" autocomplete=\"\" name=\"\" autocapitalize=\"true\"\n                                style=\"text-align: center; color: var(--color-primary);  border-width: 0px; width: 40px;\" >\n                        </td>\n                        <td class=\"columna3\"  >\n                        <span id=\"").concat(id, "-concepto\">").concat(ui.item.value.concepto).concat(ui.item.value.concepto === 'Rezago de fierro' ? fecha2 === 2022 ? '' : ' ' + (fecha1 || fecha2) + actual_fe : '').concat(ui.item.value.concepto === 'Revalidación de fierro' ? ' ' + '2023' : '', "</span>\n                        </td>\n                        <td class=\"columna4\">\n                        <span id=\"").concat(id, "-uma\">").concat(ui.item.value.uma, "</span>\n                        </td>\n                        <td class=\"columna5\">\n                         <span>$</span> <span  id=\"").concat(id, "-importe\">").concat(ui.item.value.costo, "</span>\n                        </td>\n                        \n                        <td class=\"div-oculto\" data-label=\"eliminar\">\n                            <img src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJpb25pY29uIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTI5NiA2NGgtODBhNy45MSA3LjkxIDAgMDAtOCA4djI0aDk2VjcyYTcuOTEgNy45MSAwIDAwLTgtOHoiIGNsYXNzPSJpb25pY29uLWZpbGwtbm9uZSIvPjxwYXRoIGQ9Ik0yOTIgNjRoLTcyYTQgNCAwIDAwLTQgNHYyOGg4MFY2OGE0IDQgMCAwMC00LTR6IiBjbGFzcz0iaW9uaWNvbi1maWxsLW5vbmUiLz48cGF0aCBkPSJNNDQ3LjU1IDk2SDMzNlY0OGExNiAxNiAwIDAwLTE2LTE2SDE5MmExNiAxNiAwIDAwLTE2IDE2djQ4SDY0LjQ1TDY0IDEzNmgzM2wyMC4wOSAzMTRBMzIgMzIgMCAwMDE0OSA0ODBoMjE0YTMyIDMyIDAgMDAzMS45My0yOS45NUw0MTUgMTM2aDMzek0xNzYgNDE2bC05LTI1NmgzM2w5IDI1NnptOTYgMGgtMzJWMTYwaDMyem0yNC0zMjBoLTgwVjY4YTQgNCAwIDAxNC00aDcyYTQgNCAwIDAxNCA0em00MCAzMjBoLTMzbDktMjU2aDMzeiIvPjwvc3ZnPg==\"\n                                class=\"icon-eliminar\" onclick=\"deleteRow('").concat(id, "')\" >\n                        </td>\n                    </tr>\n                ");
      $("#rows").append(row);
      $("#busqueda-tramites").val(ui.item.label);
      calcularTotal();
      return false;
    },
    limit: 4
  });
}); // ELIMINAR PRODUCTO

function deleteRow(id) {
  $("#" + id).remove();
  calcularTotal();
} // TOTAL DE UN UNICO PRODUCTO


function sumarImporte(id) {
  var costo = $("#".concat(id, "-costo")).val();
  var unidades = $("#".concat(id, "-unidades")).val();
  var cantidad = costo * unidades;
  $("#".concat(id, "-importe")).text(cantidad.toFixed(2));
  calcularTotal();
} // TOTAL DE TODOS LOS PRODUCTOS


function calcularTotal() {
  registros = $(".identificadores");
  var suma = 0;
  Array.from(registros).forEach(function (registro) {
    var id = registro.value;
    var importe = $("#".concat(id, "-importe")).text();
    suma += parseFloat(importe);
  });
  $("#total").val("$" + suma.toFixed(2));

  if (suma == 0) {
    $("#total").val("0.00");
  }
}
/* BUSCAR CONTRIBUYENTE */


$(function () {
  $("#clave_ine").autocomplete({
    name: 'clave_ine',
    source: function source(request, response) {
      $.ajax({
        url: "/search-contribuyente?",
        type: "GET",
        dataType: "json",
        data: {
          term: request.term
        },
        success: function success(data) {
          var results = $.ui.autocomplete.filter(data, request.term);
          response(results.slice(0, 6));
        }
      });
    },
    focus: function focus(event, ui) {
      event.preventDefault();
      $("#clave_ine").val(ui.item.label);
    },
    select: function select(event, ui) {
      $("#nombre").text(ui.item.value.nombre);
      $("#apellido_paterno1").text(ui.item.value.apellido_paterno);
      $("#apellido_materno1").text(ui.item.value.apellido_materno);
      $("#domicilio_parcelario").text(ui.item.value.domicilio_parcelario);
      $("#clave_ine").val(ui.item.label);
      $("#id_contribuyente").val(ui.item.value.id_contribuyente);
      fecha_tramite = ui.item.value.fecha;
      fecha_contribuyente = ui.item.value.fecha_inscripcion;

      if (fecha_tramite) {
        var partes = fecha_tramite.split("-");
        var anio = parseInt(partes[0]) + 1;

        if (anio < 2022) {
          document.getElementById("fecha").value = anio;
          document.getElementById("fecha").removeAttribute("hidden");
          var fechaActual = new Date();
          var anioActual = fechaActual.getFullYear() - 1;
          document.getElementById("fecha_actual").innerText += "- " + anioActual;
        } else if (anio == 2022) {
          document.getElementById("fecha").value = anio;
          document.getElementById("fecha").removeAttribute("hidden");
        }
      } else if (fecha_contribuyente) {
        console.log(fecha_contribuyente);
        var partes1 = fecha_contribuyente.split("-");
        var anio1 = parseInt(partes1[0]) + 1;
        document.getElementById("fecha_inscripcion").value = anio1;
        document.getElementById("fecha_inscripcion").removeAttribute("hidden");
        var fechaActual = new Date();
        var anioActual = fechaActual.getFullYear() - 1;
        document.getElementById("fecha_actual").innerText += "- " + anioActual;
      }

      return false;
    }
  });
});
$(document).ready(function () {
  $('form #enviar-contribuyente').click(function (e) {
    var $form = $(this).closest('form');
    swal.fire({
      title: '¿Deseas registrar al contribuyente?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      reverseButtons: true
    }).then(function (result) {
      if (result.value) {
        swal.fire({
          icon: 'success',
          title: 'Contribuyente registrados',
          showConfirmButton: false,
          timer: 1000
        }).then(function () {
          $form.submit();
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swal.fire({
          icon: 'error',
          title: 'Contribuyente no registrado',
          showConfirmButton: false,
          timer: 1000
        });
      }
    });
  });
});

function actualizarFechaHora() {
  var fechaHora = new Date();
  var dia = fechaHora.getDate();
  var mes = fechaHora.getMonth() + 1;
  var anio = fechaHora.getFullYear();
  var horas = fechaHora.getHours();
  var minutos = fechaHora.getMinutes();
  var segundos = fechaHora.getSeconds();
  if (segundos < 10) segundos = "0" + segundos;
  if (dia < 10) dia = "0" + dia;
  if (mes < 10) mes = "0" + mes;
  var ampm = horas >= 12 ? 'p.m.' : 'a.m.';
  horas = horas % 12;
  horas = horas ? horas : 12; // El reloj en formato de 12 horas

  minutos = minutos < 10 ? '0' + minutos : minutos;
  var strFechaHora = dia + '/' + mes + '/' + anio + ' ' + horas + ':' + minutos + ':' + segundos + ' ' + ampm;
  document.getElementById("fecha-hora").innerHTML = strFechaHora;
}

actualizarFechaHora();
setInterval(actualizarFechaHora, 1000);

function TramitesInsert() {
  registros = $(".identificadores");
  Array.from(registros).forEach(function (registro) {
    var id = registro.value;
    var id_tramites = $("#".concat(id, "-id_tramites")).text();
    var clave = $("#".concat(id, "-clave")).text();
    var concepto = $("#".concat(id, "-concepto")).text();
    var uma = $("#".concat(id, "-uma")).text();
    var importe = $("#".concat(id, "-importe")).text();
    var cantidad = $("#".concat(id, "-unidades")).val();
    var clave_ine = document.getElementById("clave_ine").value;
    var folio = document.getElementById("folio").value;
    var hora = $("#HoraActual").text();
    var id_contribuyente = document.getElementById("id_contribuyente").value;
    var params = {
      id_tramites: id_tramites,
      clave: clave,
      concepto: concepto,
      uma: uma,
      importe: importe,
      cantidad: cantidad,
      clave_ine: clave_ine,
      folio: folio,
      hora: hora,
      id_contribuyente: id_contribuyente
    };
    var options = {
      method: 'GET'
    };
    var url = '/insertar_tramites?';
    var getParams = new URLSearchParams(params).toString();
    fetch(url + getParams, options).then(function (error, data) {});
  });
}

function FolioInsert() {
  var suma = 1;
  var cambio = document.getElementById("folio").value;
  var folio = parseInt(cambio) + suma;
  var params = {
    folio: folio
  };
  var options = {
    method: 'post'
  };
  var url = '/cambiar_folio?';
  var getParams = new URLSearchParams(params).toString();
  fetch(url + getParams, options).then(function (error, data) {
    console.log('ingresado correctamente');
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var $boton = document.getElementById("enviarTramites");
  var table = document.getElementById("rows");
  $boton.addEventListener("click", function (event) {
    if (table.rows.length > 0 && document.getElementById("clave_ine").value.trim() !== "") {
      document.getElementById("enviarTramites").disabled = true;
      $.ajax({
        url: '/obtener-datos?',
        method: 'GET',
        success: function success(data) {
          document.getElementById("folio").value = data;
        },
        error: function error(jqXHR, textStatus, errorThrown) {
          console.log('Error al obtener los datos: ' + textStatus);
        }
      }).then(function () {
        TramitesInsert();
        FolioInsert();
      }).then(function () {
        window.print();
        location.reload();
      });
      return true;
    } else {
      // Prevenir el envío del formulario
      event.preventDefault(); // Mostrar un mensaje de error

      Swal.fire({
        icon: 'error',
        title: 'El ticket debe de contener todos los datos.',
        showConfirmButton: false,
        timer: 1000
      });
      return false;
    }
  });
});