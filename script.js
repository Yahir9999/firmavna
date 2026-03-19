// Ubicaciones automáticas por CEDI
const direcciones = {
  "CAMARONES": "Acatl 331, Santa Lucía, 02760 Azcapotzalco, CDMX",
  "CHALCO": "Antiguo Camino a Cocotitlan 150, Zona Industrial, 56600 Chalco de Díaz Covarrubias",
  "TULTEPEC": "C. Prolongación Matamoros 21, 10 de junio, 54980 Santiago Teyahualco, Méx.",
  "TOLUCA": "Santin, 50200 San Nicolás Tolentino, Méx.",
  "IRAPUATO": "Libramiento Nororiente 3651, Revolucion, 36547 Irapuato, Gto.",
  "VILLAHERMOSA": "Villahermosa - Cardenas km 15.5, 86280 Villahermosa, Tab.",
  "VERACRUZ": "Av. Framboyanes 252, Bruno Pagliai, 91697 Valente Díaz, Ver."
};

// Cuando cambie el CEDI → llenar ubicación automáticamente
document.getElementById("cedi").addEventListener("change", () => {
  const cedi = document.getElementById("cedi").value;
  document.getElementById("ubicacion").value = direcciones[cedi] || "";
});



function generarFirma(){
  const nombre = nombreInput("nombre").toUpperCase();
  const puesto = nombreInput("puesto").toUpperCase();
  const ubicacion = nombreInput("ubicacion");
  const correo = nombreInput("correo");
  const telefono = nombreInput("telefono");
  const cedi = document.getElementById("cedi").value.toUpperCase();

  // CEDIs con información larga
  const cedisCompactos = ["TULTEPEC", "CHALCO"];

  const claseDatos = cedisCompactos.includes(cedi)
    ? "firma-datos compacto"
    : "firma-datos";

    // 🔒 VALIDACIÓN
  if(!nombre || !puesto || !ubicacion || !correo || !telefono || !cedi){
    alert("⚠️ Por favor llena todos los campos antes de generar la firma.");
    return; // ⛔ corta la ejecución
  }


  document.getElementById("preview").innerHTML = `
    <div class="signature" id="firma">

     <!-- 🔑 BASE COMO IMG (ESTO ES LO NUEVO) -->
    <img src="base.png" class="firma-base"></img>

      <div class="firma-contenido">
        <div class="firma-nombre">${nombre}</div>
        <div class="firma-puesto">${puesto}</div>
        <div class="firma-cedi">CEDI ${cedi}</div>

        <div class="${claseDatos}">
          <div class="firma-linea">
            <img src="icon-location.png">
            <div class="firma-dato">${ubicacion}</div>
          </div>

          <div class="firma-linea">
            <img src="icon-mail.png">
            <div class="firma-dato">${correo}</div>
          </div>

          <div class="firma-linea">
            <img src="icon-phone.png">
            <div class="firma-dato">${telefono}</div>
          </div>
        </div>

      </div>
    </div>
  `;
}


function nombreInput(id){
  return document.getElementById(id).value || "";
}

function descargarFirma(){
  const firma = document.getElementById("firma");

  html2canvas(firma, {
    backgroundColor: null,
    scale: 3   
  }).then(canvas=>{
    canvas.toBlob(blob=>{
      let link = document.createElement("a");
      link.download = "firma.png";
      link.href = URL.createObjectURL(blob);
      link.click();
    });
  });
}



function mostrarEnvio(){
  document.getElementById("emailSend").classList.remove("d-none");
}

let envioEnProceso = false; // 🔑 bandera global

async function enviarCorreo(){

  if(envioEnProceso) return; // ⛔ evita doble click
  envioEnProceso = true;

  const boton = document.getElementById("btnEnviar");
  boton.disabled = true;
  boton.innerText = "Enviando...";

  const destino = document.getElementById("correoDestino").value;
  const firma = document.getElementById("firma");

  html2canvas(firma, { scale: 3 }).then(canvas => {

    const imgData = canvas.toDataURL("image/png");

    fetch("https://script.google.com/macros/s/AKfycbyppQmOVH9j13tT5a0KifJqRMfvtb6EzrtCvcFHFBC4mryjnXF7LSQqIBxvp8ormz4mRQ/exec", {
      method: "POST",
      body: JSON.stringify({
        email: destino,
        firma: imgData
      })
    })
    .then(() => {
      alert("✅ Firma enviada correctamente");
      boton.innerText = "Enviado";
    })
    .catch(() => {
      alert("❌ Error al enviar, intenta de nuevo");
      boton.disabled = false;
      boton.innerText = "Enviar ahora";
      envioEnProceso = false;
    });

  });
}
