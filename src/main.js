const envelope = document.getElementById("envelope");
const button = document.getElementById("openBtn");

function openEnvelope() {
  envelope.classList.toggle("open");
}

envelope.addEventListener("click", openEnvelope);
button.addEventListener("click", openEnvelope);