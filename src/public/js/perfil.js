function validarFormulario() {
    document.getElementById("formulario").addEventListener("submit", function (event) {
        event.preventDefault(); // Detiene el envío predeterminado del formulario

        var passActual = document.getElementById('pass').value;
        var passNueva = document.getElementById('passNueva').value;
        var passConfirmar = document.getElementById('passConfirmar').value;

        // Validar que ningún campo esté vacío
        if (passActual === '' || passNueva === '' || passConfirmar === '') {
            swal.fire(
                {
                    icon: 'error', text: 'Por favor, completa todos los campos.', showConfirmButton: false, timer: 1500
                });
            return false; // Detener el envío del formulario
        }

        // Validar que la contraseña nueva no sea igual a la actual
        if (passNueva === passActual) {
            swal.fire(
                {
                    icon: 'error', text: 'La contraseña nueva debe ser diferente a la actual.', showConfirmButton: false, timer: 1500
                });
            return false; // Detener el envío del formulario
        }

        // Validar que la nueva contraseña y la confirmación sean iguales
        if (passNueva !== passConfirmar) {
            swal.fire(
                {
                    icon: 'error', text: 'La nueva contraseña y la confirmación no coinciden.', showConfirmButton: false, timer: 1500
                });
            return false; // Detener el envío del formulario
        }
        // Validar la contraseña tenga al menos 8 caracteres y contenga al menos un número
        if (passNueva.length < 8 || !/\d/.test(passNueva)) {
            swal.fire(
                {
                    icon: 'error', text: 'Debe tener al menos 8 caracteres y al menos un número.', showConfirmButton: false, timer: 1500
                });
            return false; // Detener el envío del formulario
        }

        swal.fire({
            icon: 'success',
            text: 'Contraseña cambiada exitosamente.',
            showConfirmButton: false,
            timer: 1500
        }).then(function () {
            // Enviar el formulario
            document.getElementById('formulario').submit();
        });

    });

}


 
