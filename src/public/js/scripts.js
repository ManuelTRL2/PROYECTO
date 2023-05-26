$('#subirimg1').click(function () {
    $('#img_fierro').click();
});

/* PREVISUALIZAR IMAGEN DE GESTOR DE ARCHIVOS */
const imgInput = document.getElementById('img_fierro');
const imgPreview = document.getElementById('subirimg1');

imgInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imgPreview.src = e.target.result;
        }
        reader.readAsDataURL(this.files[0]);
    } else {
        imgPreview.src = './img/fierro.png';
    }
});


/* VALIDAR ANTES DE MANDAR FORMULARIO */
function validarFormulario() {
    // Validar que todas las casillas estén llenas
    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].hasAttribute("required") && inputs[i].value === "") {
            Swal.fire("Error", "Por favor, complete todas las casillas", "error");
            return false;
        }
    }

    // Confirmar si se desea enviar los datos
    Swal.fire({
        position: 'top-end',
        title: '¿Estás seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Sí, estoy seguro!'
    })
        .then((result) => {
            if (result.isConfirmed) {
                // Si se confirma, enviar los datos
                document.querySelector(".updateModal").submit();
                Swal.fire({
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                // Si se cancela, no hacer nada
                return false;
            }
        });
}