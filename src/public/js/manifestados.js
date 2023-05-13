
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
    $('#mi-boton-de-busqueda',).click();
    var nombre = $('#nombreManifestado').val().toLowerCase();
    var apellido_paterno = $('#apellidopManifestado').val().toLowerCase();
    var apellido_materno = $('#apellidomManifestado').val().toLowerCase();
    var clave_ine = $('#ineManifestado').val().toLowerCase();
    var fierro = $('#fierro_manifestado').val().toLowerCase();

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
        success: function (response) {
            var datos = JSON.parse(response);
            var resultados = datos.filter(function (item) {
                var item_nombre = typeof item.nombre === 'string' ? item.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
                var item_apellido_paterno = typeof item.apellido_paterno === 'string' ? item.apellido_paterno.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
                var item_apellido_materno = typeof item.apellido_materno === 'string' ? item.apellido_materno.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
                var item_clave_ine = typeof item.clave_ine === 'string' ? item.clave_ine.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
                var item_fierro = typeof item.fierro === 'string' ? item.fierro.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() : '';
                // Compara la búsqueda con los campos
                return (nombre === '' || item_nombre.includes(nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) &&
                    (apellido_paterno === '' || item_apellido_paterno.includes(apellido_paterno.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) &&
                    (apellido_materno === '' || item_apellido_materno.includes(apellido_materno.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) &&
                    (clave_ine === '' || item_clave_ine.includes(clave_ine.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) &&
                    (fierro === '' || item_fierro.includes(fierro.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) &&
                    ($('#fecha_inicio').val() === '' || new Date(item.fecha_inscripcion) >= new Date($('#fecha_inicio').val())) &&
                    ($('#fecha_fin').val() === '' || new Date(item.fecha_inscripcion) <= new Date($('#fecha_fin').val()));
            });

            // Guarda el valor del campo de entrada antes de destruir la tabla
            var valor_anterior = $('#mi-input-de-busqueda').val();

            // Verifica si la tabla ya ha sido inicializada
            if ($.fn.DataTable.isDataTable('#manifestados')) {
                // Si la tabla ya ha sido inicializada, destruye la instancia existente
                $('#manifestados').DataTable().destroy();
            }

            // Inicializa la tabla de DataTables con los resultados filtrados
            $(document).ready(function () {
                var table = $('#manifestados').DataTable({
                    searching: false,
                    data: resultados,
                    dom: 'Blftrip',
                    buttons: [{ extend: 'excel' }],
                    order: [[0, 'desc'], [0, 'asc']],
                    language: {
                        url: 'https://cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'
                    },
                    columns: [

                        { "data": "id_contribuyente", "className": "fondo" }, { "data": "nombre" }, { "data": "apellido_paterno" },
                        { "data": "apellido_materno" }, { "data": "clave_ine" }, { "data": "domicilio_ine" },
                        { "data": "domicilio_parcelario" }, { "data": "fecha_inscripcion" },
                        {
                            "data": "perfil",
                            "render": function (data) {
                                return '<div style="width:100px; height:100px;"> <img src="' + data + '" alt="' + data + '" style="width:100%; height:100%;"> </div>';
                            },
                            "className": 'ocultar_ID'
                        },
                        {
                            "data": "fierro",
                            "render": function (data, type, row) {
                                return '<div style="width:100px; height:100px;"> <img  src="' + row.fierro + '" alt="' + row.fierro + '"  style="width:100%; height:100%;" > </div>' + " " + '<span >' + row.iniciales + '';
                            }
                        }, { "data": "libro", "className": 'ocultar_ID' }, { "data": "foja", "className": 'ocultar_ID' },
                        { "data": "numero_registro", "className": 'ocultar_ID' }, { "data": "estado" }, { "data": "iniciales", "className": 'ocultar_ID' },
                        { "data": "folio", "className": 'ocultar_ID' }, { "data": "concepto", "className": 'ocultar_ID' }, {
                            "data": "fecha",
                            "className": 'ocultar_ID'
                        }
                        ,
                        {
                            "data": "folio_finanzas",
                            "className": 'ocultar_ID'
                        },
                        {
                            "data": "notas",
                            "className": 'ocultar_ID'
                        },
                        {
                            "data": "tipo",
                            "className": 'ocultar_ID'
                        },
                        {
                            "data": "telefono",
                            "className": 'ocultar_ID'
                        },
                        {
                            'defaultContent':
                                '<div style="margin-top: 5px;"> <button class="btn btn-success btn-sm  btnEditar" ><i class="fa-solid fa-file"></i></button> ' +
                                '<button class="btn btn-success btn-sm Perfil_"><i class="fa-solid fa-user"> </i></button></div> ' +
                                '<div style="margin-top: 5px;"> <button class="btn btn-success btn-sm imgedit"><i class="fa-solid fa-square-pen"></i></button> ' +
                                '<button class="btn btn-success btn-sm cancelar"><i class="fa-solid fa-square-xmark"></i></button></div> ' +
                                '<div style="margin: 5px 0px 0px 15px; "> <button class="btn btn-success btn-sm busqueda"><i class="fa-solid fa-square-check"></i></button> </div> '

                        },
                    ],

                });


                table.buttons().container()
                    .appendTo('#manifestados_wrapper .col-md-6:eq(0)');
            });
            $('#mi-input-de-busqueda').val(valor_anterior);
        }
    });
}


