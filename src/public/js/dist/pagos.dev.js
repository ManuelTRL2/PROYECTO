"use strict";

$('#buscar_operacion, #buscar_nombre, #buscar_apellidop, #buscar_apellidom, #buscar_concepto, #fecha_inicio, #fecha_fin').on('keydown', function (e) {
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
  var folio_finanzas = $('#buscar_operacion').val().toLowerCase();
  var nombre = $('#buscar_nombre').val().toLowerCase();
  var apellido_paterno = $('#buscar_apellidop').val().toLowerCase();
  var apellido_materno = $('#buscar_apellidom').val().toLowerCase();
  var concepto = $('#buscar_concepto').val().toLowerCase();
  var fecha_inicio = $('#fecha_inicio').val();
  var fecha_fin = $('#fecha_fin').val();
  $.ajax({
    url: '/obtener-fierros-pagos?',
    method: 'GET',
    data: {
      folio_finanzas: $('#buscar_operacion').val(),
      nombre: $('#buscar_nombre').val(),
      apellido_paterno: $('#buscar_apellidop').val(),
      apellido_materno: $('#buscar_apellidom').val(),
      concepto: $('#buscar_concepto').val(),
      fecha_inicio: $('#fecha_inicio').val(),
      fecha_fin: $('#fecha_fin').val()
    },
    success: function success(response) {
      var datos = JSON.parse(response);
      var resultados = datos.filter(function (item) {
        var item_folio_finanzas = typeof item.folio_finanzas === 'string' ? item.folio_finanzas.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_apellido_paterno = typeof item.apellido_paterno === 'string' ? item.apellido_paterno.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_apellido_materno = typeof item.apellido_materno === 'string' ? item.apellido_materno.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_nombre = typeof item.nombre === 'string' ? item.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_concepto = typeof item.concepto === 'string' ? item.concepto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
        var item_fecha = new Date(item.fecha).getTime();
        var fecha_inicio_timestamp = fecha_inicio ? new Date(fecha_inicio).getTime() : 0;
        var fecha_fin_timestamp = fecha_fin ? new Date(fecha_fin).getTime() : Number.MAX_SAFE_INTEGER; // Compara la búsqueda con los campos

        return (folio_finanzas === '' || item_folio_finanzas.includes(folio_finanzas.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && (nombre === '' || item_nombre.includes(nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && (apellido_paterno === '' || item_apellido_paterno.includes(apellido_paterno.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && (apellido_materno === '' || item_apellido_materno.includes(apellido_materno.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && (concepto === '' || item_concepto.includes(concepto.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) && item_fecha >= fecha_inicio_timestamp && item_fecha <= fecha_fin_timestamp;
      }); // Guarda el valor del campo de entrada antes de destruir la tabla

      var valor_anterior = $('#mi-input-de-busqueda').val(); // Verifica si la tabla ya ha sido inicializada

      if ($.fn.DataTable.isDataTable('#pagos')) {
        // Si la tabla ya ha sido inicializada, destruye la instancia existente
        $('#pagos').DataTable().destroy();
      } // Inicializa la tabla de DataTables con los resultados filtrados


      $(document).ready(function () {
        var table = $('#pagos').DataTable({
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
            "data": "id_ticket",
            "className": "fondo"
          }, {
            "data": "clave"
          }, {
            "data": "folio_finanzas"
          }, {
            "data": "folio"
          }, {
            "data": "fecha"
          }, {
            "data": "nombre"
          }, {
            "data": "apellido_paterno"
          }, {
            "data": "apellido_materno"
          }, {
            "data": "concepto"
          }, {
            "data": "uma"
          }, {
            "data": "cantidad"
          }, {
            "data": "importe"
          }, {
            "data": "id_contribuyente",
            "className": 'ocultar_ID'
          }, {
            "data": "id_usuario"
          }, {
            "defaultContent": "<button type='button' class='btn btn-confirmar btnEditar'><i class='fa-solid fa-circle-plus'></i></button>",
            "visible": user != "Administrador"
          }],
          columnDefs: [{
            targets: 4,
            // Índice de la columna "fecha" (empezando desde 0)
            render: function render(data) {
              var fecha = moment(data);
              return fecha.format('DD/MM/YYYY');
            }
          }]
        });
        $(document).on("click", ".btnEditar", function () {
          opcion = 'editar';
          fila = $(this).closest("tr");
          id = parseInt(fila.find('td:eq(0)').text());
          folio_finanzas = fila.find('td:eq(2)').text();
          folio = fila.find('td:eq(3)').text();
          id_contribuyente = fila.find('td:eq(12)').text();
          concepto = fila.find('td:eq(8)').text();
          $("#id").val(id);
          $("#folio_finanzas").val(folio_finanzas);
          $("#folio").val(folio);
          $("#id_contribuyente").val(id_contribuyente);
          $("#concepto").val(concepto);
          $('#Modal-folio').modal('show');
        });
        $('#update_finanzas').submit(function (e) {
          e.preventDefault();
          id = $('#id').val();
          folio_finanzas = $('#folio_finanzas').val();
          var params = {
            id: id,
            folio_finanzas: folio_finanzas
          };
          var options = {
            method: 'POST'
          };
          var url = '/finanzas_update?';
          var getParams = new URLSearchParams(params).toString();
          fetch(url + getParams, options).then(function (error, data) {
            var rowIndex = table.row(fila).index();
            var rowData = table.row(rowIndex).data();
            rowData.folio_finanzas = folio_finanzas;
            table.row(rowIndex).data(rowData);
            $('#Modal-folio').modal('hide');
          });
        });
        table.buttons().container().appendTo('#pagos_wrapper .col-md-6:eq(0)');
      }); // Vuelve a insertar el valor anterior del campo de entrada después de volver a crear la tabla

      $('#mi-input-de-busqueda').val(valor_anterior);
    }
  });
}