const form = document.querySelector("#contact-form");
const emailInput = document.querySelector("#email");
const usernameInput = document.querySelector("#username");
const submitButton = document.querySelector("#submit-button");
const message = document.querySelector("#form-message");

function setMessage(text, type = "error") {
  message.textContent = text;
  message.classList.toggle("is-visible", Boolean(text));
  message.classList.toggle("is-success", type === "success");
}

function formIsReady() {
  return emailInput.validity.valid && usernameInput.value.trim().length >= 3;
}

function updateSubmitButton() {
  submitButton.disabled = !formIsReady();
}

[emailInput, usernameInput].forEach((input) => {
  input.addEventListener("input", () => {
    input.removeAttribute("aria-invalid");
    setMessage("");
    updateSubmitButton();
  });
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const emailIsInvalid = !emailInput.validity.valid;
  const usernameIsInvalid = usernameInput.value.trim().length < 3;

  emailInput.toggleAttribute("aria-invalid", emailIsInvalid);
  usernameInput.toggleAttribute("aria-invalid", usernameIsInvalid);

  if (emailIsInvalid || usernameIsInvalid) {
    setMessage(
      emailIsInvalid ? "Enter a valid email address." : "Enter a username with at least 3 characters.",
    );
    (emailIsInvalid ? emailInput : usernameInput).focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  setMessage("");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Formspree could not accept the submission.");
    }

    form.reset();
    setMessage("Thanks — your email and username were sent successfully.", "success");
  } catch {
    setMessage("Your details could not be sent. Please try again in a moment.");
  } finally {
    submitButton.textContent = "Continue";
    updateSubmitButton();
  }
});
