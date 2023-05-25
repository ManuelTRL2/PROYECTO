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