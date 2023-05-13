$(function () {
    $("#busqueda-tramites").autocomplete({
        name: 'busqueda-tramites',
        source: '/ticket-search?key=%QUERY',
        focus: function (event, ui) {
            event.preventDefault();
            $("#busqueda-tramites").val(ui.item.label);
        },
        select: function (event, ui) {
            const id = uuid.v4();

            let fecha1 = document.getElementById('fecha_inscripcion').value;

            let fecha2 = document.getElementById('fecha').value;

            let actual_fe = document.getElementById('fecha_actual').innerText;
            const row = `
                    <tr id="${id}" class="registro">
                        <td class="columna1" data-label="Clave">
                        <input type="hidden" value="${id}" class="identificadores">
                        <input type="hidden" value="${ui.item.value.costo}" id="${id}-costo">
                        <span hidden  id="${id}-id_tramites">${ui.item.value.id}</span>
                        <span  id="${id}-clave">${ui.item.value.clave}</span>
                    </td>
                    <td class="columna2">
                            <input  id="${id}-unidades" value="1" onchange="sumarImporte('${id}')" data-v-8a398dfb="" class=" tamaño-ticke tx-textinput box md borde texto"
                                type="text" autocomplete="" name="" autocapitalize="true"
                                style="text-align: center; color: var(--color-primary);  border-width: 0px; width: 40px;" >
                        </td>
                        <td class="columna3"  >
                        <span id="${id}-concepto">${ui.item.value.concepto}${ui.item.value.concepto === 'Rezago de fierro' ? (fecha2 === 2022 ? '' : ' ' + (fecha1 || fecha2) + actual_fe) : ''}${ui.item.value.concepto === 'Revalidación de fierro' ? ' ' + '2023' : ''}</span>
                        </td>
                        <td class="columna4">
                        <span id="${id}-uma">${ui.item.value.uma}</span>
                        </td>
                        <td class="columna5">
                         <span>$</span> <span  id="${id}-importe">${ui.item.value.costo}</span>
                        </td>
                        
                        <td class="div-oculto" data-label="eliminar">
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGNsYXNzPSJpb25pY29uIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZD0iTTI5NiA2NGgtODBhNy45MSA3LjkxIDAgMDAtOCA4djI0aDk2VjcyYTcuOTEgNy45MSAwIDAwLTgtOHoiIGNsYXNzPSJpb25pY29uLWZpbGwtbm9uZSIvPjxwYXRoIGQ9Ik0yOTIgNjRoLTcyYTQgNCAwIDAwLTQgNHYyOGg4MFY2OGE0IDQgMCAwMC00LTR6IiBjbGFzcz0iaW9uaWNvbi1maWxsLW5vbmUiLz48cGF0aCBkPSJNNDQ3LjU1IDk2SDMzNlY0OGExNiAxNiAwIDAwLTE2LTE2SDE5MmExNiAxNiAwIDAwLTE2IDE2djQ4SDY0LjQ1TDY0IDEzNmgzM2wyMC4wOSAzMTRBMzIgMzIgMCAwMDE0OSA0ODBoMjE0YTMyIDMyIDAgMDAzMS45My0yOS45NUw0MTUgMTM2aDMzek0xNzYgNDE2bC05LTI1NmgzM2w5IDI1NnptOTYgMGgtMzJWMTYwaDMyem0yNC0zMjBoLTgwVjY4YTQgNCAwIDAxNC00aDcyYTQgNCAwIDAxNCA0em00MCAzMjBoLTMzbDktMjU2aDMzeiIvPjwvc3ZnPg=="
                                class="icon-eliminar" onclick="deleteRow('${id}')" >
                        </td>
                    </tr>
                `;

            $("#rows").append(row);
            $("#busqueda-tramites").val(ui.item.label);

            calcularTotal()
            return false;
        },

        limit: 4
    });
});


// ELIMINAR PRODUCTO
function deleteRow(id) {
    $("#" + id).remove();
    calcularTotal();
}

// TOTAL DE UN UNICO PRODUCTO
function sumarImporte(id) {
    const costo = $(`#${id}-costo`).val();
    const unidades = $(`#${id}-unidades`).val()
    const cantidad = costo * unidades
    $(`#${id}-importe`).text(cantidad.toFixed(2))
    calcularTotal();
}

// TOTAL DE TODOS LOS PRODUCTOS
function calcularTotal() {
    registros = $(".identificadores")
    let suma = 0;
    Array.from(registros).forEach(registro => {
        const id = registro.value;
        const importe = $(`#${id}-importe`).text();
        suma += parseFloat(importe);
    });
    $(`#total`).val("$" + suma.toFixed(2));
    if (suma == 0) {
        $(`#total`).val("0.00");
    }
}

/* BUSCAR CONTRIBUYENTE */
$(function () {
    $("#clave_ine").autocomplete({
        name: 'clave_ine',

        source: function (request, response) {
            $.ajax({
                url: "/search-contribuyente?",
                type: "GET",
                dataType: "json",
                data: { term: request.term },

                success: function (data) {
                    var results = $.ui.autocomplete.filter(data, request.term);
                    response(results.slice(0, 6));
                }
            });
        },
        select: function (event, ui) {
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
                var partes1 = fecha_contribuyente.split("/");
                var anio1 = parseInt(partes1[2]) + 1;
                document.getElementById("fecha_inscripcion").value = anio1;
                document.getElementById("fecha_inscripcion").removeAttribute("hidden");

                var fechaActual = new Date();
                var anioActual = fechaActual.getFullYear() - 1;
                document.getElementById("fecha_actual").innerText += "- " + anioActual;
            }
            return false;
        },
    });
});


$(document).ready(function () {
    $('form #enviar-contribuyente').click(function (e) {
        let $form = $(this).closest('form');

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
        })

        swalWithBootstrapButtons.fire({
            title: '¿Deseas registrar al contribuyente?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'OK', 
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                swalWithBootstrapButtons.fire({
                    icon: 'success',
                    title: 'Contribuyente registrados',
                    showConfirmButton: false,
                    timer: 1000
                }).then(function () {
                    $form.submit();
                })

            } else if (
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swalWithBootstrapButtons.fire(
                    {
                        icon: 'error',
                        title: 'Contribuyente no registrado',
                        showConfirmButton: false,
                        timer: 1000
                    }
                );
            }
        });
    })
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
  var strFechaHora = dia + '/' + mes + '/' + anio + ' ' + horas + ':' + minutos + ':' + segundos +' ' + ampm;
  document.getElementById("fecha-hora").innerHTML = strFechaHora;
}
actualizarFechaHora();
setInterval(actualizarFechaHora, 1000); 

function TramitesInsert() {
    registros = $(".identificadores")
    Array.from(registros).forEach(registro => {
        const id = registro.value;
        const id_tramites = $(`#${id}-id_tramites`).text()
        const clave = $(`#${id}-clave`).text()
        const concepto = $(`#${id}-concepto`).text()
        const uma = $(`#${id}-uma`).text()
        const importe = $(`#${id}-importe`).text()
        const cantidad = $(`#${id}-unidades`).val()
        const clave_ine = document.getElementById("clave_ine").value
        const folio = document.getElementById("folio").value
        const hora = $(`#HoraActual`).text()
        const id_contribuyente = document.getElementById("id_contribuyente").value

        const params = {
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

        }
        const options = {
            method: 'GET',
        }
        const url = '/insertar_tramites?';
        const getParams = (new URLSearchParams(params)).toString()

        fetch(url + getParams, options).then((error, data) => {
          
        });
    });
}

function FolioInsert() {
    var suma = 1
    var cambio = document.getElementById("folio").value
    var folio = parseInt(cambio) + suma
    const params = {
        folio: folio
    }
    const options = {
        method: 'post',
    }
    const url = '/cambiar_folio?';
    const getParams = (new URLSearchParams(params)).toString()

    fetch(url + getParams, options).then((error, data) => {
        console.log('ingresado correctamente');
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const $boton = document.getElementById("enviarTramites");
    $boton.addEventListener("click", () => {
        document.getElementById("enviarTramites").disabled = true;
        $.ajax({
            url: '/obtener-datos?',
            method: 'GET',
            success: function (data) {
                document.getElementById("folio").value = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error al obtener los datos: ' + textStatus);
            }
        }).then(function () {
            TramitesInsert();
            FolioInsert();
        }).then(function () {
            window.print();
            location.reload();
        })
    });
});