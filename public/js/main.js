function saludo() {
  alert("Bienvenido a mi web site con Boostrap y JS");
}

function suma() {
  //Declaramos las variables necesesarias
  let A = 0;
  let B = 0;
  let s = 0;

  //Solicitar los valores
  A = parseInt(prompt("Ingrese el primer valor a sumar: "));
  B = parseInt(prompt("Ingrese el segundo valor a sumar: "));

  //Realizamos los procesos
  s = A + B;

  //Monstrar el resultado en pantalla
  alert("El resultado de la suma es: " + s);
}

function resta() {
  let A = 0;
  let B = 0;
  let S = 0;

  A = parseInt(prompt("Ingrese el primer valor a restar: "));
  B = parseInt(prompt("Ingrese el segundo valor a restar: "));
  S = A - B;

  alert("El resultado de la resta es: " + S);
}

function mayor() {
  alert("Algoritmo que determinara el número mayor de los ingresados.");
  let n1 = 0;
  let n2 = 0;

  n1 = parseInt(prompt("Ingresar el primer valor: "));
  n2 = parseInt(prompt("Ingresar el segundo valor: "));
  if (n1 == n2) {
    alert("Los números ingresados son iguales.");
  } else if (n1 > n2) {
    alert("El número 1 es mayor que el número 2" + n1);
  } else {
    alert("El número 2 es mayor " + n2);
  }
}

//El colegio ABC requiere un algoritmo o un sistema que permita a los diferentes estudiantes,
//ingresar su nombre, materia y siete calificaciones, y este le indique si aprobo o reprobo la materia
//teniendo en cuenta que se aprueba que el puntaje es mayor o igual que 6

function promedio() {
  let estudiante = 0;
  let materia = 0;
  let n1 = 0;
  let n2 = 0;
  let n3 = 0;
  let n4 = 0;
  let n5 = 0;
  let n6 = 0;
  let n7 = 0;
  let nf = 0;

  estudiante = prompt("Ingrese su nombre: ");
  materia = prompt("Ingrese la materia a calificar: ");
  n1 = parseInt(prompt("Ingrese la primera calificación: "));
  n2 = parseInt(prompt("Ingrese la segunda calificación: "));
  n3 = parseInt(prompt("Ingrese la tercera calificación: "));
  n4 = parseInt(prompt("Ingrese la cuarta calificación: "));
  n5 = parseInt(prompt("Ingrese la quinta calificación: "));
  n6 = parseInt(prompt("Ingrese la sexta calificación: "));
  n7 = parseInt(prompt("Ingrese la septima calificación: "));

  nf = (n1 + n2 + n3 + n4 + n5 + n6 + n7) / 7;

  if (nf >= 6) {
    alert("El estudiante aprobo la materia con nota final de: " + nf);
  } else if (nf <= 6) {
    alert("El estudiante reprobo la materia con: " + nf);
  } else {
    alert("Ingreso de datos incorrecto");
  }

  alert(
    "El resultado final es: Nombre " +
      estudiante +
      "Materia" +
      materia +
      "Nota final" +
      nf
  );
}

function promediofor() {
  let estudiante = prompt("Ingrese su nombre: ");
  let materia = prompt("Ingrese la materia a calificar: ");
  let numCalificaciones = 7;
  let sumaCalificaciones = 0;

  for (let i = 1; i <= numCalificaciones; i++) {
    let calificacion = parseInt(prompt("Ingrese la calificación #" + i + ": "));

    if (isNaN(calificacion) || calificacion < 0 || calificacion > 10) {
      alert("Ingrese una calificación válida entre 0 y 10.");
      return; // Termina la función si se ingresa una calificación inválida.
    }

    sumaCalificaciones += calificacion;
  }

  let nf = sumaCalificaciones / numCalificaciones;

  if (nf >= 6) {
    alert("El estudiante aprobó la materia con una nota final de: " + nf);
  } else {
    alert("El estudiante reprobó la materia con una nota final de: " + nf);
  }

  alert(
    "Resultado final:\nNombre: " +
      estudiante +
      "\nMateria: " +
      materia +
      "\nNota final: " +
      nf
  );
}

//Se requiere un algoritmo que al ingresar el valor en dolares nos indique a cuantos pesos colombianos equivale,
//euros y soles

function conversion() {
  let dolares = 0;

  dolares = parseFloat(prompt("Ingrese la cantidad de dólares a convertir: "));

  if (isNaN(dolares) || dolares <= 0) {
    alert("Ingrese una cantidad válida de dólares.");
  } else {
    let sol = 3.72;
    let euro = 0.92;
    let peso = 3900;

    let soles = dolares * sol;
    let euros = dolares * euro;
    let pesos = dolares * peso;

    alert("El valor en dólares es: " + dolares);
    alert("El valor en euros es: " + euros);
    alert("El valor en soles es: " + soles);
    alert("El valor en pesos colombianos es: " + pesos);
  }
}

function CDT() {
  // Obtener el monto de inversión del usuario
  let montoInvertido = parseFloat(
    prompt("Por favor, ingresa el monto de inversión en dólares:")
  );

  // Verificar si el monto ingresado es válido
  if (isNaN(montoInvertido) || montoInvertido <= 0) {
    alert("Por favor, ingresa un monto de inversión válido.");
  } else {
    // Tasas de interés para los diferentes tipos de CDTs
    let tasaNormal = 0.05; // 5%
    let tasaPremium = 0.07; // 7%
    let tasaVIP = 0.1; // 10%

    // Calcular los intereses para cada tipo de CDT
    let interesNormal = montoInvertido * tasaNormal;
    let interesPremium = montoInvertido * tasaPremium;
    let interesVIP = montoInvertido * tasaVIP;

    // Mostrar opciones de inversión al usuario
    alert(
      "Opciones de inversión disponibles:\n\n" +
        `1. CDT Normal - Interés: $${interesNormal.toFixed(2)}\n` +
        `2. CDT Premium - Interés: $${interesPremium.toFixed(2)}\n` +
        `3. CDT VIP - Interés: $${interesVIP.toFixed(2)}`
    );

    // Solicitar al usuario que elija una opción
    let eleccion = parseInt(prompt("Por favor, elige una opción (1, 2 o 3):"));

    // Determinar el tipo de CDT basado en la elección del usuario
    let tipoCDT = "";
    let interes = 0;

    switch (eleccion) {
      case 1:
        tipoCDT = "CDT Normal";
        interes = interesNormal;
        break;
      case 2:
        tipoCDT = "CDT Premium";
        interes = interesPremium;
        break;
      case 3:
        tipoCDT = "CDT VIP";
        interes = interesVIP;
        break;
      default:
        alert("Opción no válida.");
    }

    // Mostrar el resultado
    if (tipoCDT !== "") {
      alert(`Has elegido ${tipoCDT} con un interés de $${interes.toFixed(2)}.`);
    } else {
      alert("No se realizó una elección válida.");
    }
  }
}

function panellateral() {
  const panel = document.getElementById("panel-lateral");
  panel.classList.toggle("active");
}

function circulo() {
  //capturamos en una constnte el elemento html
  //que deseeamos manipular
  const figura = document.getElementById("figura");
  figura.classList.toggle("circulo");
}
function Rombo() {
  const figura = document.getElementById("figura");
  figura.classList.toggle("Rombo");
}
function Triangulo() {
  const figura = document.getElementById("figura");
  figura.classList.toggle("Triangulo");
}

function hor() {
  const figura = document.getElementById("figura");
  figura.classList.toggle("hor");
}

function ver() {
  const figura = document.getElementById("figura");
  figura.classList.toggle("ver");
}

function moveTop() {
  const figura = document.querySelector("#figura");
  figura.classList.toggle("top");
}

function moveButton() {
  const figura = document.querySelector("#figura");
  figura.classList.toggle("Button");
}

function moveRight() {
  const figura = document.querySelector("#figura");
  figura.classList.toggle("Right");
}

function moveLeft() {
  const figura = document.querySelector("#figura");
  figura.classList.toggle("Left");
}

function Gif() {
  const figura = document.getElementById("figura");
  figura.classList.toggle("Gif");
}

function Degradado() {
  const figura = document.getElementById("figura");
  figura.classList.toggle("Degradado");
}
