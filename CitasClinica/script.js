"use strict"

//Variable para guardar la fecha y hora actual
let fHoy = new Date();
//Variable donde guardaremos la hora de la cita devuelta
let horaCita = "";
//Variable para guardar la conexión creada
let xmlHttp;
//Variable para guardar la fila
let fila;
//Variable para el dataTable
let dataT;
$(() => {

    //Asignamos los eventos

    //Cuando cambie especialidad creamos los médicos y limpiamos los botones de tramos si los hubiera
    $("#especialidad").on("change", llamarMedico);
    $("#especialidad").on("change", limpiarTramos);
    //Cuando cambiemos la fecha se mostrarán los botones de tramos de esa fecha y médico
    $("#fecha").on("change", mostrarHoraCita);
    //Cuando cambiemos de médico limpiamos los tramos del médico anterior
    $("#medico").on("change", limpiarTramos);
    //Cuando elegimos un médico habilitamos la fecha
    $("#medico").on("change", habilitarFecha);
    //Cuando se pulse cancelar limpiamos los campos
    $("#cancelar").on("click", limpiarFormulario);
    //Deshabilitamos la fecha porque si introducimos una fecha sin meter médico
    //Nos devuelve un error
    $("#fecha").prop('disabled', true);
    //Creamos la conexión para mostrar el paciente
    xmlHttp = crearConexion();
    if (xmlHttp != "undefined") {
        //Asignamos al boton buscar el evento para que llame a mostrarPaciente en caso de que 
        //la petición haya tenido éxito
        $(".buscar").on("click", mostrarPaciente);
    } else {
        //Si la conexión falla mostramos el mensaje
        Swal.fire("Navegador no soporta AJAX. La página no tendrá funcionalidad");
    }
    //Asignamos el evento al boton ver citas
    $("#citas").on("click", mostrarCitas);

    //Función para validar el formulario
    validarForm();
});

//Función para limpiar los botones de los tramos de las citas
function limpiarTramos() {
    $("#horas").find("button").remove();
}

//Función para habilitar la fecha cuando se cambie de médico
function habilitarFecha() {
    //Si no hay médico seleccionado la deshabilitamos
    if ($(this).val() != "") {
        $("#fecha").prop('disabled', false);
    } else {
        //Si hay médico selecciionado la habilitamos
        $("#fecha").prop('disabled', true);
    }
}

//Función que llamará a la función mostrarMédicos
function llamarMedico() {
    //Antes de llamar a la función mostrarMédicos eliminamos los que hubiera
    $("#medico").find("option[value!='']").remove();
    //LLamamos a la función y le pasamos el valor actual que es el id de especialidad elegida
    mostrarMedicos($(this).val());
}

//Función para limpiar todos los campos del formulario
function limpiarFormulario() {
    $("#dni").attr("placeholder", "DNI Paciente").val("");
    $("#nomPac").attr("placeholder", "Nombre y Apellidos del paciente").val("");
    $("#especialidad").find("option[value!='']").remove();
    $("#medico").find("option[value!='']").remove();
    $("#fecha").attr("placeholder", "dd/mm/aaaa").val("");
    $("#horas").find("button").remove();
    $("#fecha").prop('disabled', true);
    $("#citas").prop('disabled', true);
    //Eliminamos la tabla
    $("#table").children().remove();
    //Quitamos la clase para que no nos salga como válidos
    $("input").removeClass("is-valid");
    $("select").removeClass("is-valid");

}

//Funcion que usaremos para llamar a la función que creará los botones de los tramos
function creaBotones() {
    //Eliminamos botones de tramos si existen
    $("#horas").find("button").remove();
    //Guardamos en variables los tramos según id del médico
    let tramoIni = $("#medico").find("option[value='" + $("#medico").val() + "']").attr("data-tramoi");
    let tramoFin = $("#medico").find("option[value='" + $("#medico").val() + "']").attr("data-tramof");
    //Llamamos a la función para crear los botones y le pasamos el tramo del médico elegido
    creaBotonesCita(tramoIni, tramoFin);
}

//Función para mostrar el nombre del paciente
function mostrarPaciente() {
    //Creamos la petición
    xmlHttp.open("POST", "php/pacientes.php", true);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            //Parseamos la respuesta a JSON
            let objeto = JSON.parse(xmlHttp.responseText);
            //Si el array, no está vacío
            if (objeto.data.length != 0) {
                //Lo recorremos
                $(objeto.data).each((ind, ele) => {
                    //Asignamos el valor a nuestro input de nombre
                    $("#nomPac").val(ele.apellidosNombre);
                    //Quitamos el blur para que nos deje quitar el foco
                    $("#dni").blur();
                    //Habilitamos el botón ver citas
                    $("#citas").prop('disabled', false);
                    //Si en especialidades no hay ninguna excepto la que tiene por defecto
                    if ($("#especialidad").children().length == 1) {
                        //Mostramos especialidades
                        mostrarEspecialidad();
                    }
                })
            } else {
                //Si nos devuelve el array vacío
                //Asignamos el valor para informar de que no existe en el campo nombre
                $("#nomPac").val("El paciente no existe");
                //Dejamos el foco en el dni
                $("#dni").focus();
                //Y no permitimos que cambie
                $("#dni").on("blur", function () {
                    $("#dni").focus();
                });
                //Deshabilitamos el botón ver citas
                $("#citas").prop('disabled', true);
                //Eliminamos todas las especialidades menos la que tiene por defecto con valor ""
                $("#especialidad").find("option[value!='']").remove();
                //Hacemos lo mismo con el select de médicos
                $("#medico").find("option[value!='']").remove();
            }
        }
    }
    //Si el campo dni no está vacío
    if ($("#dni").val() != "") {
        //Lo enviamos como parámetro a la petición
        xmlHttp.send("dni=" + $("#dni").val());
    } else {
        //Si está vacío el campo dni 
        $("#nomPac").val("El paciente no existe");
        //Dejamos el foco en el dni
        $("#dni").focus();
        //Y no permitimos que cambie
        $("#dni").on("blur", function () {
            $("#dni").focus();
        });
        //Deshabilitamos el botón ver citas
        $("#citas").prop('disabled', true);
        //Eliminamos todas las especialidades menos la que tiene por defecto con valor ""
        $("#especialidad").find("option[value!='']").remove();
        //Hacemos lo mismo con el select de médicos
        $("#medico").find("option[value!='']").remove();
    }
}

//Función en la que haremos la petición para que nos muestre las especialidades
function mostrarEspecialidad() {
    //Pasamos el parámetro vacío porque en la consulta nos devolverá todos los registros
    let datos = {
        especialidad: ""
    }
    //Esta vez hacemos la petición con jquery
    $.ajax({
            url: "php/especialidades.php",
            type: "GET",
            data: datos
        })
        //Si conecta con éxito
        .done(function (responseText) {
            //Creamos por cada elemento del array devuelto un option con el nombre de la
            //especialidad y con value idEspecialidad 
            $(responseText.data).each((ind, ele) => {
                $("#especialidad").append(`<option value="${ele.idEspecialidad}">${ele.descripcion}</option>`);
            })
        })
        //Si la conexión es fallida mostramos el error
        .fail(function (responseText, textStatus, xhr) {
            Swal.fire({
                icon: "error",
                title: "Error " + xhr.status,
                text: xhr.statusText
            })
        })
}

//Función para mostrar la tabla con las citas de cada paciente
function mostrarCitas() {
    //Vaciamos la tabla si no lo está
    $("#table").empty();
    //Y creamos una tabla
    $("#table").append(
        `<table class="table">
                    <thead class="thead thead-dark">
                        <tr>
                        <th></th>
                            <th>Especialidad</th>
                            <th>Médico</th>
                            <th>Fecha cita</th>
                            <th>Hora cita</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>`);
    //Asignamos a la variable el dataTable
    dataT = $(".table").DataTable({
        //Ralizamos la petición Ajax
        "ajax": {
            url: "php/citas.php",
            type: "POST",
            data: {
                //Le pasamos como parámetro el dni del paciente
                dni: $("#dni").val()
            }
        },
        //Indicamos que datos queremos en las columnas
        "columns": [{
                "data": "idCitas",
                "visible": false
            },
            {
                "data": "especialidad"
            },
            {
                "data": "medico"
            },
            {
                "data": "fecha"
            },
            {
                "data": "hora"
            },
            {
                
                //Quitamos ordenar columna del botón eliminar
                "orderable": false,
                //Row, contiene todos los datos de la fila y se ejecuta cada vez se carga una fila
                "render": function (data, type, row) { 
                    let fecha = row.fecha;
                    let hora = row.hora;
                    //Guardamos fecha y hora
                    let fCitaFormat = fecha + "-" + hora.substring(0, 2) + "-" + hora.substring(3, 5);
                    //Separamos los dígitos de la fecha y hora
                    let datosFInicio = fCitaFormat.split("-");
                    //Damos formato de fecha a nuestros datos de fecha y hora
                    let nuevaFInicio = new Date(datosFInicio[0], datosFInicio[1] - 1, datosFInicio[2], datosFInicio[3], datosFInicio[4]);
                    //Si la fecha es anterior a la actual ponemos un boton deshabilitado
                    
                    if (nuevaFInicio < new Date()) {
                        return "<button type='button' disabled class='del btn btn-danger'><i class='fas fa-trash-alt'></i></button>"
    
                    } else {
                        //Si la fecha es posterior ponemos el botón habilitado
                        return "<button type='button' class='del btn btn-danger'><i class='fas fa-trash-alt'></i></button>"
                    }
                }
            }
        ],
        //Aparecen los botones de principio y final
        "sPaginationType": "full_numbers", 
        "language": {
            "url": "./librerias/DataTables/Spanish.json",
        }

    });
    //Asignamos el evento a los botones eliminar
    $("tbody").on("click", ".del", eliminarCita);

    //**************CON TABLA NORMAL********************/
    // //Le pasamos como parámetro el dni del paciente
    // let datos = $("#dni").val();
    // //Creamos la conexión esta vez con fetch
    // fetch("php/citas.php", {
    //         method: "POST",
    //         headers: { // cabeceras HTTP
    //             'Content-Type': 'application/x-www-form-urlencoded'
    //         },
    //         body: "dni=" + datos
    //     })
    //     .then(function (response) {
    //         //decodificar como texto
    //         if (response.ok) {
    //             return response.json(); //la respuesta del servidor es en JSON
    //         } else {
    //             throw response; //generar un error
    //         }
    //     })
    //     .then(function (datos) {
    //         //Vaciamos la tabla si no lo está
    //         $("#table").empty();
    //         //Y creamos una tabla
    //         $("#table").append(
    //             `<table class="table">
    //                 <thead>
    //                     <tr>
    //                         <th>Especialidad</th>
    //                         <th>Médico</th>
    //                         <th>Fecha cita</th>
    //                         <th>Hora cita</th>
    //                         <th>Acciones</th>
    //                     </tr>
    //                 </thead>
    //                 <tbody>

    //                 </tbody>`);
    //         //Vaciamos el tbody si no lo está
    //         $("tbody").empty();
    //         $(datos.data).each((ind, ele) => {
    //             //Llenamos el tbody con los datos recibidos
    //             $("tbody").append(`<tr id='${ele.cita}' data-fechaHora='${ele.fecha}  ${ele.hora}'><td>${ele.especialidad}</td><td>${ele.medico}</td><td>${ele.fecha}</td><td>${ele.hora}</td><td>${botonEliminar}</td></tr>`)
    //             //Asignamos al id el valor del índice
    //            //Asignamos evento al botón elimnar
    //            $(".eliminar").on("click", eliminarCita);
    //             $("#botonEli").attr("id", "botonEli"+ind);
    //             //Guardamos la fecha y hora
    //             let fCitaFormat = ele.fecha+"-"+ele.hora.substring(0, 2)+"-"+ele.hora.substring(3, 5);
    //             //Separamos los dígitos de la fecha y hora
    //             let datosFInicio = fCitaFormat.split("-");
    //             //Damos formato de fecha a nuestros datos de fecha y hora
    //             let nuevaFInicio = new Date(datosFInicio[0], datosFInicio[1]-1, datosFInicio[2], datosFInicio[3], datosFInicio[4]);
    //             //Si la fecha es anterior a la actual deshabilitamos el botón eliminar
    //             if (nuevaFInicio < fHoy) {
    //                 $("#botonEli"+ind).attr("disabled", true);
    //             } 
    //         })

    //     })
    //     //Si ocurre algún error los mostramos
    //     .catch(function (err) {
    //         Swal.fire("Error: " + err.status + " " + err.statusText);
    //     });

}


//Función para mostrar los médicos
function mostrarMedicos(val) {
    //Le pasamos el valor recibido en la función que era el idEspecialidad
    let datos = val;
    //Realizamos la petición
    fetch("php/medicos.php", {
            method: "POST",
            headers: { // cabeceras HTTP
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "espe=" + datos
        })
        .then(function (response) {
            //decodificar como texto
            if (response.ok) {
                return response.json(); //la respuesta del servidor es en JSON
            } else {
                throw response; //generar un error
            }
        })
        .then(function (datos) {
            //Si todo ha ido bien, creamos los options con cada médico de la especialidad pasada
            $(datos.data).each((ind, ele) => {
                $("#medico").append(`<option class="medico" id="${ele.idMedico}" data-tramoi="${ele.tramoInicial}" data-tramof="${ele.tramoFinal}" value="${ele.idMedico}">${ele.apellidosNombre}</option>`);
            })
        })
        .catch(function (err) {
            //Si ha habido error lo mostramos
            Swal.fire("Error: " + err.status + " " + err.statusText);
        });
}

//Creamos los botones con los datos pasados a la función que es la hora de inicio y la hora final
function creaBotonesCita(tramoIni, tramoFi) {
    //Eliminamos botones de tramos si los hay
    $("#horas").find("button").remove();
    //Creamos un atributo para guardar la hora cada vez que se pulse una
    $("#horas").attr("data-horapulsada", "");
    //Creamos una variable array para guardar los dos valores numéricos, minutos y horas de hora inicio
    let tiempoI = tramoIni.split(/:/);
    //Multiplicamos el primer valor del array(horas) por 60 para pasar las horas a minutos
    let tiempoIMinutos = tiempoI[0] * 60;
    //Creamos una variable array para guardar los dos valores numéricos, minutos y horas de hora final
    let tiempoF = tramoFi.split(/:/);
    //Multiplicamos el primer valor del array(horas) por 60 para pasar las horas a minutos
    let tiempoFMinutos = tiempoF[0] * 60;
    //Restamos los minutos de hora inicial a los de hora final y los dividimos entre 15, y nos saldrá
    //El número de tramos cada 15 min
    let tramos = (tiempoFMinutos - tiempoIMinutos) / 15;
    //Creamos una variable para guardar las horas de cada cita
    let horaCitas = "";
    //Creamos el bucle para crear un botón por cada tramo de 15 min
    for (let i = 0; i < tramos; i++) {
        //Asignamos la hora y minutos
        horaCitas = tiempoI[0] + ":" + tiempoI[1];
        //Creamos los botones
        $("#horas").append("<button type='button' id=" + horaCitas + " value=" + horaCitas + " class='btn btn-primary mr-3 mb-2 botonAzul'>" + horaCitas + "</button>");
        //Sumamos 15 minutos a los minutos por cada iteración
        tiempoI[1] = parseInt(tiempoI[1]) + 15;
        //Si los minutos llegan a 60, los ponemos a cero y sumamos una hora
        if (tiempoI[1] == 60) {
            tiempoI[1] = 0 + "0";
            tiempoI[0] = parseInt(tiempoI[0]) + 1;
        }


    }
    //Asignamos el evento para que se ponga verde a cada botón creado
    //Que son hijos del elemento con id horas
    $("#horas").children().on("click", botonVerde);
}

//Función para que nos devuelva las horas de cada cita
function mostrarHoraCita() {
    //Le pasamos el id del médico y la fecha
    let medico = $("#medico").val();
    let fecha = $("#fecha").val();
    //Creamos la petición
    fetch("php/citasMedicos.php?idMedico=" + medico + "&fecha=" + fecha)
        .then(function (response) {
            //decodificar como texto
            if (response.ok) {
                return response.json();
            } else {
                throw response
            }
        })
        .then(function (data) {
            //Llamamos a la función para crear los botones, lo hacemos aquí, para que la petición de la cita
            //Ocupada haya llegado antes
            creaBotones();
            //Recorremos el array devuelto
            $(data.data).each((ind, ele) => {
                //Extraemos la hora solamente de cada elemento
                let hora = ele.hora.substring(0, 5);
                console.log(ele.hora);
                //Si la hora devuelta es igual a la que tiene algún botón
                //Cambiamos la clase para que lo ponga en rojo
                $(":button[value='" + hora + "']").attr("class", "btn btn-danger mr-3 mb-2 botonRojo");
                //Y deshabilitamos ese botón
                $(":button[value='" + hora + "']").attr('disabled', 'true');
            })
        })
        .catch(function (err) {
            //Si ocurre algún error lo mostramos
            Swal.fire("Error: " + err.status + " : " + err.statusText);
        });
}

//Función que nos cambiará la clase del botón pulsado para que lo ponga en verde
function botonVerde() {
    //Pasamos los botones que estén verdes a azules
    $("#horas").find("button.botonVerde").attr("class", "btn btn-primary mr-3 mb-2 botonAzul");
    //Y ponemos el botón pulsado a verde
    $(this).attr("class", "btn btn-success mr-3 mb-2 botonVerde");
    //Asignamos la hora del boton pulsado al atributo horapulsada de horas
    $("#horas").attr("data-horapulsada", $(this).val());
}

function validarForm() {
    //formulario que vamos a validar
    $(".frm").validate({
        errorElement: "em",
        errorPlacement: function (error, element) {
            error.addClass("invalid-feedback");
            error.insertAfter(element)
        },
        //borde un error
        highlight: function (element, errorClass, validClass) {
            $(element).addClass("is-invalid").removeClass("is-valid");
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).addClass("is-valid").removeClass("is-invalid");
        },
        //reglas
        rules: {

            dni: "required",
            espe: "required",
            med: "required",
            fecha: "required"



        },
        messages: {
            dni: "El dni es requerido",
            espe: "La especialidad es requerida",
            med: "El medico es requerido",
            fecha: "La fecha es requerida"
        },
        submitHandler: function (form) {
            grabarRegistro()
        }
    })

}

function grabarRegistro() {


    //Realizamos la petición
    $.ajax({
            url: "php/grabarcitas.php",
            type: "POST",
            data: {
                //Cogemos los datos del formulario
                dni: $("#dni").val(),
                espe: $("#especialidad").val(),
                med: $("#medico").val(),
                fecha: $("#fecha").val(),
                hora: $("#horas").attr("data-horapulsada")
            }
        })
        //Si todo es correcto...
        .done(function (datos) {
            if ($(datos.mensaje) != "Error") {
                Swal.fire({
                    title: 'La cita ha sido creada',
                    icon: 'success',
                    confirmButtonText: 'ok'
                }).then((result) => {
                    //Añadimos a la tabla el nuevo registro
                    //$("tbody").append(`<tr><td>${$("#especialidad").val()}</td><td>${$("#medico").val()}</td><td>${$("#fecha").val()}</td><td>${$("#horas").attr("data-horapulsada")}</td><td>${botonEliminar}</td></tr>`);
                    //Si se ha grabado limpiamos todo el formulario
                    limpiarFormulario();
                })
            } else {
                //Si no se ha podido insertar mostramos error
                Swal.fire("Registro no insertado", "Error", "error");
            }
        })
        .fail(function () {
            //Si ha fallado la petición mostramos error
            Swal.fire("Registro no insertado", "Error al hacer la peticion", "error")

        })

}

function eliminarCita() {
    fila = $(this).parents("tr");
    Swal.fire({
        title: '¿Desea eliminar la cita?',
        text: "Fecha : " + dataT.row(fila).data().fecha + " Hora de la cita: " + dataT.row(fila).data().hora,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        focusCancel: true
    }).then((result) => {
        if (result.value) {
            //borrar xmlHttpRequest
            let xmlHttp = crearConexion();
            xmlHttp.open("POST", "php/deleteCita.php");
            xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    Swal.fire({
                        title: 'Cita eliminada!',
                        icon: 'success',
                    })
                    //eliminar la fila de la tabla
                    $(fila).remove();
                    //limpiamos los botones de horas de cita y la fecha
                    $("#horas").find("button").remove();
                    $("#fecha").attr("placeholder", "dd/mm/aaaa").val("");
                }
            }
            xmlHttp.send("cita=" + dataT.row(fila).data().idCitas);

        }
    })


}