"use strict";

$('#nombreManifestado, #apellidopManifestado, #apellidomManifestado, #ineManifestado, #fierro_manifestado, #fecha_inicio, #fecha_fin').on('keydown', function (e) {
  // Si se presionó la tecla enter, realiza la búsqueda
  if (e.keyCode === 13) {
    buscarPagos();
  }
});
$('#fecha_inicio, #fecha_fin').on('change', function () {
  buscarPagos();
});

function buscarPagos() {
  $('#mi-boton-de-busqueda').click();
  var nombre = $('#nombreManifestado').val().toLowerCase();
  var apellido_paterno = $('#apellidopManifestado').val().toLowerCase();
  var apellido_materno = $('#apellidomManifestado').val().toLowerCase();
  var clave_ine = $('#ineManifestado').val().toLowerCase();
  var fierro = $('#fierro_manifestado').val().toLowerCase();
  var fecha_inicio = $('#fecha_inicio').val();
  var fecha_fin = $('#fecha_fin').val();
  $.ajax({
    url: '/obtener-fierros-manifestados?',
    method: 'GET',
    data: {
      nombre: $('#nombreManifestado').val(),
      apellido_paterno: $('#apellidopManifestado').val(),
      apellido_materno: $('#apellidomManifestado').val(),
      clave_ine: $('#ineManifestado').val(),
      fierro: $('#fierro_manifestado').val(),
      fecha_inicio: $('#fecha_inicio').val(),
      fecha_fin: $('#fecha_fin').val()
    },
    success: function success(response) {
      var datos = JSON.parse(response);
      var resultados = datos.filter(function (item) {
        var item_nombre = typeof item.nombre === 'string' ? item.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_apellido_paterno = typeof item.apellido_paterno === 'string' ? item.apellido_paterno.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_apellido_materno = typeof item.apellido_materno === 'string' ? item.apellido_materno.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_clave_ine = typeof item.clave_ine === 'string' ? item.clave_ine.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_fierro = typeof item.fierro === 'string' ? item.fierro.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_fecha_inscripcion = new Date(item.fecha_inscripcion).getTime();
        var fecha_inicio_timestamp = fecha_inicio ? new Date(fecha_inicio).getTime() : 0;
        var fecha_fin_timestamp = fecha_fin ? new Date(fecha_fin).getTime() : Number.MAX_SAFE_INTEGER; // Compara la búsqueda con los campos

        return (nombre === '' || item_nombre.includes(nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && (apellido_paterno === '' || item_apellido_paterno.includes(apellido_paterno.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && (apellido_materno === '' || item_apellido_materno.includes(apellido_materno.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && (clave_ine === '' || item_clave_ine.includes(clave_ine.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && (fierro === '' || item_fierro.includes(fierro.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && item_fecha_inscripcion >= fecha_inicio_timestamp && item_fecha_inscripcion <= fecha_fin_timestamp;
      }); // Guarda el valor del campo de entrada antes de destruir la tabla

      var valor_anterior = $('#mi-input-de-busqueda').val(); // Verifica si la tabla ya ha sido inicializada

      if ($.fn.DataTable.isDataTable('#manifestados')) {
        // Si la tabla ya ha sido inicializada, destruye la instancia existente
        $('#manifestados').DataTable().destroy();
      } // Inicializa la tabla de DataTables con los resultados filtrados


      $(document).ready(function () {
        var table = $('#manifestados').DataTable({
          searching: false,
          data: resultados,
          dom: 'Blftrip',
          buttons: [{
            extend: 'excel'
          }],
          order: [[0, 'desc'], [0, 'asc']],
          language: {
            url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'
          },
          columns: [{
            "data": "id_contribuyente",
            "className": "fondo"
          }, {
            "data": "nombre"
          }, {
            "data": "apellido_paterno"
          }, {
            "data": "apellido_materno"
          }, {
            "data": "clave_ine"
          }, {
            "data": "domicilio_ine"
          }, {
            "data": "domicilio_parcelario"
          }, {
            "data": "fecha_inscripcion"
          }, {
            "data": "perfil",
            "className": 'ocultarColum'
          }, {
            "data": "fierro",
            "render": function render(data, type, row) {
              return '<div style="width:100px; height:100px;"> <img  src="' + row.fierro + '" alt="' + row.fierro + '"  style="width:100%; height:100%;" > </div>' + " " + '<span >' + row.iniciales + '';
            }
          }, {
            "data": "libro",
            "className": 'ocultarColum'
          }, {
            "data": "foja",
            "className": 'ocultarColum'
          }, {
            "data": "numero_registro",
            "className": 'ocultarColum'
          }, {
            "data": "estado"
          }, {
            "data": "iniciales",
            "className": 'ocultarColum'
          }, {
            "data": "folio",
            "className": 'ocultarColum'
          }, {
            "data": "concepto",
            "className": 'ocultarColum'
          }, {
            "data": "fecha",
            "className": 'ocultarColum'
          }, {
            "data": "folio_finanzas",
            "className": 'ocultarColum'
          }, {
            "data": "notas",
            "className": 'ocultarColum'
          }, {
            "data": "tipo",
            "className": 'ocultarColum'
          }, {
            "data": "telefono",
            "className": 'ocultarColum'
          }, {
            'defaultContent': '<div style="margin-top: 5px;"> <button class="btn btn-success btn-sm  btnEditar" ><i class="fa-solid fa-file"></i></button> ' + '<button class="btn btn-success btn-sm perfil"><i class="fa-solid fa-user"> </i></button></div> ' + '<div style="margin-top: 5px;"> <button class="btn btn-success btn-sm imgedit"><i class="fa-solid fa-square-pen"></i></button> ' + '<button class="btn btn-success btn-sm cancelar"><i class="fa-solid fa-square-xmark"></i></button></div> ' + '<div style="margin: 5px 0px 0px 15px; "> <button class="btn btn-success btn-sm certficacion"><i class="fa-solid fa-square-check"></i></button> </div> '
          }],
          columnDefs: [{
            targets: 7,
            // Índice de la columna "fecha" (empezando desde 0)
            render: function render(data) {
              if (data) {
                var fecha = moment(data);

                if (fecha.isValid()) {
                  return fecha.format('DD/MM/YYYY');
                } else {
                  return 'Fecha inválida';
                }
              } else {
                return '';
              }
            }
          }, {
            targets: 17,
            // Índice de la columna "fecha" (empezando desde 0)
            render: function render(data) {
              if (data) {
                var fecha_finanzas = moment(data);

                if (fecha_finanzas.isValid()) {
                  return fecha_finanzas.format('DD/MM/YYYY');
                } else {
                  return 'Fecha inválida';
                }
              } else {
                return '';
              }
            }
          }]
        });
        $(document).on("click", ".btnEditar", function () {
          opcion = 'editar';
          fila = $(this).closest("tr");
          $("#nombre_registro").val(fila.children()[1].textContent);
          $("#apellido_paterno_registro").val(fila.children()[2].textContent);
          $("#apellido_materno_registro").val(fila.children()[3].textContent);
          $("#clave_ine_registro").val(fila.children()[4].textContent);
          $("#domicilio_ine_registro").val(fila.children()[5].textContent);
          $("#domicilio_parcelario_registro").val(fila.children()[6].textContent);
          $("#fecha_inscripcion_registro").val(fila.children()[7].textContent);
          $("#fierro_registro").attr('src', fila.find('td:eq(9) img').attr('src'));
          $("#libro_registro").val(fila.children()[10].textContent);
          $("#foja_registro").val(fila.children()[11].textContent);
          $("#numero_registro_registro").val(fila.children()[12].textContent);
          $("#estado_registro").val(fila.children()[13].textContent);
          $("#folio_registro").val(fila.children()[15].textContent);
          $("#concepto_registro").val(fila.children()[16].textContent);
          $("#fecha_finanzas_registro").val(fila.children()[17].textContent);
          $("#folio_finanzas_registro").val(fila.children()[18].textContent);
          $('#validacion').modal('show');
        });
        $(document).on("click", ".perfil", function () {
          opcion = 'editar1';
          fila = $(this).closest("tr");
          $("#id_contribuyente").val(fila.children()[0].textContent);
          $("#nombre_perfil").val(fila.children()[1].textContent);
          $("#apellido_paterno_perfil").val(fila.children()[2].textContent);
          $("#pellido_m_perfil").val(fila.children()[3].textContent);
          $("#clave_ine_perfil").val(fila.children()[4].textContent);
          $("#domicilio_ine_perfil").val(fila.children()[5].textContent);
          $("#domicilio_parcelario_perfil").val(fila.children()[6].textContent);
          $("#fecha_inscripcion_perfil").val(fila.children()[7].textContent);
          $("#fierro_perfil").attr('src', fila.find('td:eq(9) img').attr('src'));
          $("#libro_perfil").val(fila.children()[10].textContent);
          $("#foja_perfil").val(fila.children()[11].textContent);
          $("#numero_registro_perfil").val(fila.children()[12].textContent);
          $("#estado_perfil").val(fila.children()[13].textContent);
          $("#folio_perfil").val(fila.children()[15].textContent);
          $("#concepto_perfil").val(fila.children()[16].textContent);
          $("#fecha_finanzas_perfil").val(fila.children()[17].textContent);
          $("#folio_finanzas_perfil").val(fila.children()[18].textContent);
          $('#modalHistorial').modal('show');
          var id_contribuyente = $("#id_contribuyente").val();
          console.log(id_contribuyente);
          $(document).ready(function () {
            var tablaPagos = $('#id_pagos').DataTable();
            tablaPagos.destroy();
            var tabla = $('#id_pagos').DataTable({
              searching: false,
              bLengthChange: false,
              info: false,
              bPaginate: false,
              "ajax": {
                "type": "POST",
                "crossDomain": true,
                "dataType": 'json',
                "url": "/obtener-tramites-contribuyente?id_contribuyente=" + id_contribuyente,
                "dataSrc": "",
                "contentType": "application/jsonp"
              },
              "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json"
              },
              "columns": [{
                "data": "id_ticket"
              }, {
                "data": "concepto"
              }, {
                "data": "folio"
              }, {
                "data": "fecha"
              }, {
                "data": "hora"
              }, {
                "data": "cantidad"
              }, {
                "data": "importe"
              }, {
                "data": "folio_finanzas"
              }],
              columnDefs: [{
                targets: 3,
                // Índice de la columna "fecha" (empezando desde 0)
                render: function render(data) {
                  if (data) {
                    var fecha = moment(data);

                    if (fecha.isValid()) {
                      return fecha.format('DD/MM/YYYY');
                    } else {
                      return 'Fecha inválida';
                    }
                  } else {
                    return '';
                  }
                }
              }]
            });
          });
        });
        $(document).on("click", ".imgedit", function () {
          opcion = 'imgedit';
          fila = $(this).closest("tr");
          $("#id_contribuyente").val(fila.children()[0].textContent);
          $("#nombre").val(fila.children()[1].textContent);
          $("#apellido_paterno").val(fila.children()[2].textContent);
          $("#apellido_materno").val(fila.children()[3].textContent);
          $("#clave_ine").val(fila.children()[4].textContent);
          $("#domicilio_ine").val(fila.children()[5].textContent);
          $("#domicilio_parcelario").val(fila.children()[6].textContent);
          $("#fecha_inscripcion").val(fila.children()[7].textContent);
          $("#subirimg1").attr('src', fila.find('td:eq(9) img').attr('src'));
          $("#libro").val(fila.children()[10].textContent);
          $("#foja").val(fila.children()[11].textContent);
          $("#numero_registro").val(fila.children()[12].textContent);
          $("#estado").val(fila.children()[13].textContent);
          $("#iniciales").val(fila.children()[14].textContent);
          $("#tipo").val(fila.children()[20].textContent);
          $("#telefono").val(fila.children()[21].textContent);
          $("#notas").val(fila.children()[19].textContent);
          $('#modalEdit').modal('show');
        });
        $(document).on("click", ".cancelar", function () {
          opcion = 'cancelar';
          fila = $(this).closest("tr");
          $("#folio_cancela").val(fila.children()[15].textContent);
          $("#fecha_finanzas_cancela").val(fila.children()[17].textContent);
          $("#folio_finanzas_cancela").val(fila.children()[18].textContent);
          $("#libro_cancela").val(fila.children()[10].textContent);
          $("#foja_cancela").val(fila.children()[11].textContent);
          $("#numero_registro_cancela").val(fila.children()[12].textContent);
          $("#fierro_cancela").attr('src', fila.find('td:eq(9) img').attr('src'));
          $('#modalcancelar').modal('show');
        });
        $(document).on("click", ".certficacion", function () {
          opcion = 'certficacion';
          fila = $(this).closest("tr");
          $("#id_contribuyente").val(fila.children()[0].textContent);
          $("#nombre_cer").text(fila.children()[1].textContent);
          $("#apellido_paterno_cer").text(fila.children()[2].textContent);
          $("#apellido_materno_cer").text(fila.children()[3].textContent);
          $("#clave_ine_cer").text(fila.children()[4].textContent);
          $("#domicilio_ine_cer").val(fila.children()[5].textContent);
          $("#domicilio_parcelario_cer").text(fila.children()[6].textContent);
          $("#fecha_inscripcion_cer").text(fila.children()[7].textContent);
          $("#fierro_cer").attr('src', fila.find('td:eq(9) img').attr('src'));
          $("#libro_cer").text(fila.children()[10].textContent);
          $("#foja_cer").text(fila.children()[11].textContent);
          $("#numero_registro_cer").text(fila.children()[12].textContent);
          $("#estado_cer").val(fila.children()[13].textContent);
          $("#iniciales_cer").val(fila.children()[14].textContent);
          $("#tipo_cer").val(fila.children()[20].textContent);
          $(".modal-header").css("background-color", "rgba(147,116,52,255)");
          $(".modal-header").css("color", "white");
          $(".modal-title").text("NO. OPERACIÓN");
          $('#modalbusqueda').modal('show');
          var fechaOriginal = $("#fecha_inscripcion_cer").text();
          var fechaPartes = fechaOriginal.split("/");
          var dia = parseInt(fechaPartes[0]);
          var mes = parseInt(fechaPartes[1]) - 1;
          var anio = parseInt(fechaPartes[2]);
          var opcionesFecha = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          };
          var fechaFormateada = new Date(anio, mes, dia).toLocaleDateString('es-ES', opcionesFecha);
          document.getElementById('formateada').innerHTML = "".concat(fechaFormateada); // Crear objeto Date con la fecha actual

          var fecha = new Date(); // Obtener el día del mes

          var dia1 = fecha.getDate(); // Obtener el nombre del mes

          var opciones = {
            month: 'long'
          };
          var mes1 = new Intl.DateTimeFormat('es-ES', opciones).format(fecha); // Obtener el año

          var año = fecha.getFullYear(); // Unir los elementos de la fecha en una cadena con el formato deseado

          if (dia1 == 1) {
            var fechaFormateada1 = "a ".concat(dia1, " d\xEDa del mes de ").concat(mes1, " del a\xF1o ").concat(año, ".");
            document.getElementById('diactual').innerHTML = "".concat(fechaFormateada1);
          } else {
            var _fechaFormateada = "a los ".concat(dia1, " d\xEDas del mes de ").concat(mes1, " del a\xF1o ").concat(año, ".");

            document.getElementById('diactual').innerHTML = "".concat(_fechaFormateada);
          }
        });
        table.buttons().container().appendTo('#manifestados_wrapper .col-md-6:eq(0)');
      });
      $('#mi-input-de-busqueda').val(valor_anterior);
    }
  });
}

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