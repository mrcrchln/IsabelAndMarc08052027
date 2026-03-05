const envelope = document.getElementById("envelopeToggle");
const skipButton = document.getElementById("skipIntro");
const invitationTitle = document.getElementById("invitationTitle");

const STATES = Object.freeze({
  CLOSED: "closed",
  OPENING: "opening",
  OPEN: "open",
  CLOSING: "closing",
});

const OPEN_TOTAL_MS = 1360;
const CLOSE_TOTAL_MS = 1180;

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = reducedMotionQuery.matches;

let state = STATES.CLOSED;
let phaseTimer = null;

function clearPhaseTimer() {
  if (phaseTimer !== null) {
    window.clearTimeout(phaseTimer);
    phaseTimer = null;
  }
}

function setState(nextState) {
  state = nextState;
  envelope.dataset.state = nextState;
}

function syncAria(isExpanded) {
  envelope.setAttribute("aria-expanded", String(isExpanded));
  envelope.setAttribute(
    "aria-label",
    isExpanded ? "Close invitation" : "Open invitation",
  );
}

function applyClosedInstant() {
  clearPhaseTimer();
  envelope.classList.remove("state-opening", "state-open", "state-closing");
  setState(STATES.CLOSED);
  syncAria(false);
}

function applyOpenInstant({ focusTitle = false } = {}) {
  clearPhaseTimer();
  envelope.classList.remove("state-opening", "state-closing");
  envelope.classList.add("state-open");
  setState(STATES.OPEN);
  syncAria(true);

  if (focusTitle) {
    invitationTitle.focus({ preventScroll: true });
  }
}

function openEnvelopeAnimated() {
  if (state !== STATES.CLOSED) {
    return;
  }

  clearPhaseTimer();
  envelope.classList.remove("state-open", "state-closing", "state-opening");

  // Restart keyframes cleanly.
  void envelope.offsetWidth;

  envelope.classList.add("state-opening");
  setState(STATES.OPENING);
  syncAria(true);

  phaseTimer = window.setTimeout(() => {
    envelope.classList.remove("state-opening");
    envelope.classList.add("state-open");
    setState(STATES.OPEN);
    syncAria(true);
    phaseTimer = null;
  }, OPEN_TOTAL_MS);
}

function closeEnvelopeAnimated() {
  if (state !== STATES.OPEN) {
    return;
  }

  clearPhaseTimer();
  envelope.classList.remove("state-opening");
  envelope.classList.add("state-open", "state-closing");
  setState(STATES.CLOSING);
  syncAria(false);

  phaseTimer = window.setTimeout(() => {
    envelope.classList.remove("state-closing", "state-open");
    setState(STATES.CLOSED);
    syncAria(false);
    phaseTimer = null;
  }, CLOSE_TOTAL_MS);
}

function toggleEnvelope() {
  if (reducedMotion) {
    applyOpenInstant();
    return;
  }

  if (state === STATES.OPENING || state === STATES.CLOSING) {
    return;
  }

  if (state === STATES.CLOSED) {
    openEnvelopeAnimated();
    return;
  }

  closeEnvelopeAnimated();
}

function handleReducedMotionChange(event) {
  reducedMotion = event.matches;

  if (reducedMotion) {
    applyOpenInstant();
  }
}

if (typeof reducedMotionQuery.addEventListener === "function") {
  reducedMotionQuery.addEventListener("change", handleReducedMotionChange);
} else if (typeof reducedMotionQuery.addListener === "function") {
  reducedMotionQuery.addListener(handleReducedMotionChange);
}

envelope.addEventListener("click", toggleEnvelope);

envelope.addEventListener("keydown", (event) => {
  if (event.repeat) {
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    toggleEnvelope();
  }
});

skipButton.addEventListener("click", () => {
  applyOpenInstant({ focusTitle: true });
});

if (reducedMotion) {
  applyOpenInstant();
} else {
  applyClosedInstant();
}
