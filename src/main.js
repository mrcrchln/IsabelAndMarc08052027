const envelope = document.getElementById("envelopeToggle");
const skipButton = document.getElementById("skipIntro");
const invitationTitle = document.getElementById("invitationTitle");

function setEnvelopeState(open) {
  envelope.classList.toggle("open", open);
  envelope.setAttribute("aria-expanded", String(open));
  envelope.setAttribute("aria-label", open ? "Close invitation" : "Open invitation");
}

function toggleEnvelope() {
  const isOpen = envelope.classList.contains("open");
  setEnvelopeState(!isOpen);
}

envelope.addEventListener("click", toggleEnvelope);

envelope.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleEnvelope();
  }
});

skipButton.addEventListener("click", () => {
  setEnvelopeState(true);
  invitationTitle.focus();
});
