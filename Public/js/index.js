// Obtener todos los elementos del DOM basados en tu HTML
const nombre = document.getElementById("nombre");
const a_paterno = document.getElementById("a_paterno");
const a_materno = document.getElementById("a_materno");
const fecha_nacimiento = document.getElementById("fecha_nacimiento");
const genero = document.getElementById("genero");
const estado = document.getElementById("estado");
const resultado_curp = document.getElementById("resultadoCURP");

let curp_generada = "";

// Función para quitar acentos, espacios extra al inicio/final y convertir a mayúsculas
function limpiar_texto(texto){
    let texto_limpio = texto.toUpperCase();
    texto_limpio = texto_limpio.trim();
    texto_limpio = texto_limpio.replace(/Á/g, "A");
    texto_limpio = texto_limpio.replace(/É/g, "E");
    texto_limpio = texto_limpio.replace(/Í/g, "I");
    texto_limpio = texto_limpio.replace(/Ó/g, "O");
    texto_limpio = texto_limpio.replace(/Ú/g, "U");
    return texto_limpio;
}

// Función para buscar la primera consonante interna
function buscar_consonante(texto) {
    for (let i = 1; i < texto.length; i++) {
        let letra = texto.charAt(i);
        if (letra !== "A" && letra !== "E" && letra !== "I" && letra !== "O" && letra !== "U" && letra !== " ") {
            return letra;
        }
    }
    return "X";
}

// Función para validar que solo haya letras, la Ñ y espacios
function esTextoValido(texto) {
    for (let i = 0; i < texto.length; i++) {
        let letra = texto.charAt(i);
        // Si no es una letra de la A a la Z, no es Ñ y no es espacio, es inválido
        if (!(letra >= 'A' && letra <= 'Z') && letra !== 'Ñ' && letra !== ' ') {
            return false; 
        }
    }
    return true; 
}

// Funcion para validar campos
function validarCampos(nombre_limpio, apellido_paterno, apellido_materno, fecha, valor_genero, valor_estado){

    let fecha_hoy = new Date();
    let anio_actual = fecha_hoy.getFullYear();
    let partes = fecha.split("-");
    let anio_usuario = parseInt(partes[0]);

    let olinombre = !esTextoValido(nombre_limpio);
    let olipaterno = !esTextoValido(apellido_paterno);
    let olimaterno = !esTextoValido(apellido_materno);

    if (!nombre_limpio || !apellido_paterno || !apellido_materno || !fecha || !valor_genero  || !valor_estado) {
        Swal.fire({
            icon:"warning",
            title:"Error!",
            text:"Todos los campos son obligatorios!",
            confirmButtonColor: '#d8b4e2', 
            background: '#fff0f5', 
            customClass: {
            popup: 'border-radius-15'}});
        return false;
    }
    else if(olinombre){
        Swal.fire({
            icon:"warning",
            title:"Error!",
            text:"Nombre no valido!",
            confirmButtonColor: '#d8b4e2', 
            background: '#fff0f5', 
            customClass: {
            popup: 'border-radius-15'}});
        return false;
    }else if(olipaterno){
        Swal.fire({
            icon:"warning",
            title:"Error!",
            text:"Apellido Paterno no valido",
            confirmButtonColor: '#d8b4e2', 
            background: '#fff0f5', 
            customClass: {
            popup: 'border-radius-15'}});
        return false;
    }else if(olimaterno){
        Swal.fire({
            icon:"warning",
            title:"Error!",
            text:"Apellido Materno no valido",
            confirmButtonColor: '#d8b4e2', 
            background: '#fff0f5', 
            customClass: {
            popup: 'border-radius-15'}});
        return false;
    }else if(anio_usuario > (anio_actual) || anio_usuario < (anio_actual-110)){ 
        Swal.fire({
            icon:"warning",
            title:"Error!",
            text:"Fecha no valida, Tu fecha de nacimiento no debe de ser mayor al año actual y no tener mas de 110 años!",
            confirmButtonColor: '#d8b4e2', 
            background: '#fff0f5', 
            customClass: {
            popup: 'border-radius-15'}}); 
        return false;
    }
    return true;
}


// Función principal

function calcularCURP(){

    // 1. Limpiamos los valores de los inputs con function limpiar_texto(texto)
    let nombre_limpio = limpiar_texto(nombre.value);
    let apellido_paterno = limpiar_texto(a_paterno.value);
    let apellido_materno = limpiar_texto(a_materno.value);
    let fecha = fecha_nacimiento.value; 
    let valor_genero = genero.value;
    let valor_estado = estado.value;

    if(!validarCampos(nombre_limpio, apellido_paterno, apellido_materno, fecha, valor_genero, valor_estado)){
        return;
    }

    // 2. Extraer partes de los apellidos y nombre (Primeros 4 caracteres)
    let inicial_paterno = apellido_paterno.charAt(0); 
    let vocal_interna_paterno = "X";

    for (let i = 1; i < apellido_paterno.length; i++) {
        let letra_actual = apellido_paterno.charAt(i);
        if (letra_actual === "A" || letra_actual === "E" || letra_actual === "I" || letra_actual === "O" || letra_actual === "U") {
            vocal_interna_paterno = letra_actual;
            break; // Nos detenemos al encontrar la primera vocal
        }
    }
    
    let inicial_materno = apellido_materno.charAt(0);
        
    let nombres_array = nombre_limpio.split(" ");
    let nombre_usar = nombre_limpio;
    if(nombres_array.length > 1 && (nombres_array[0] === "JOSE" || nombres_array[0] === "MARIA")){
        nombre_usar = nombres_array[1];
    }
    let inicial_nombre = nombre_usar.charAt(0);

    // 3. Formatear la fecha (AAMMDD)
    let detalles_fecha = fecha.split('-');
    let anio_completo = detalles_fecha[0]; 
    let anio_dos_digitos = anio_completo.charAt(2) + anio_completo.charAt(3);
    let mes_nacimiento = detalles_fecha[1];
    let dia_nacimiento = detalles_fecha[2]; 

    // 4. Buscar consonantes internas con function buscar_consonante(texto)
    let consonante_paterno = buscar_consonante(apellido_paterno);
    let consonante_materno = buscar_consonante(apellido_materno);
    let consonante_nombre = buscar_consonante(nombre_usar);

    // 5. Armar los 16 caracteres base sumando las variables
    let curpBase = inicial_paterno + vocal_interna_paterno + inicial_materno + inicial_nombre + anio_dos_digitos + mes_nacimiento + dia_nacimiento + valor_genero + valor_estado + consonante_paterno + consonante_materno + consonante_nombre;

    curpBase = curpBase.replace(/Ñ/g, "X");

    // 6. Simular Homoclave
    let homoclave = "";
    let anio_nacimiento_numero = parseInt(detalles_fecha[0]);
    if (anio_nacimiento_numero < 2000) {
        homoclave = "0";
    } else {
        homoclave = "A";
    }
    let digitoVerificador = Math.floor(Math.random() * 10); 

    curp_generada = curpBase + homoclave + digitoVerificador;

    Swal.fire({
        icon: "success",
        title: "¡CURP Generada con éxito!",
        text: ""
    });
        
    // 7. Mostrar en el HTML
    resultado_curp.innerText = curp_generada;    
}