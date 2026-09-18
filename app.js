const form = document.querySelector("#name-form");
const nicknameInput = document.querySelector("#nickname");
const reactionInput = document.querySelector("#reaction");
const submitButton = document.querySelector("#submit-button");
const message = document.querySelector("#form-message");

function setMessage(text, type = "error") {
  message.textContent = text;
  message.classList.toggle("is-visible", Boolean(text));
  message.classList.toggle("is-success", type === "success");
}

[nicknameInput, reactionInput].forEach((input) => {
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    setMessage("");
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nicknameIsEmpty = nicknameInput.value.trim() === "";
  const reactionIsEmpty = reactionInput.value.trim() === "";

  nicknameInput.toggleAttribute("aria-invalid", nicknameIsEmpty);
  reactionInput.toggleAttribute("aria-invalid", reactionIsEmpty);

  if (nicknameIsEmpty || reactionIsEmpty) {
    setMessage(nicknameIsEmpty ? "Enter a nickname." : "Enter your reaction.");
    (nicknameIsEmpty ? nicknameInput : reactionInput).focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  setMessage("");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("could not accept the response.");
    }

    form.reset();
    setMessage("Success", "success");
  } catch {
    setMessage("Please try again.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Sucess";
  }
});
