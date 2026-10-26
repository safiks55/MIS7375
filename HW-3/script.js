/*
  Program name: script.js
  Author: Safik
  Date created: 09/19/2026
  Date last edited: 10/22/2026
  Version: 3.1
  Description: External JavaScript for AuraMed Patient Registration Form
  Note: HW3 updates include:
        - Implemented validation across all form fields using name attributes.
        - Enforced advanced username, password, name, city, and ZIP character constraints.
        - Added form review tab for users to review their information before submission.
        References:
        - MDN Web Docs, W3Schools
        - AI assistant for syntax debugging and code optimization suggestions.
*/

document.addEventListener("DOMContentLoaded", function () {
  const formEl = document.getElementById("patientForm");

  // ==========================================
  // 1. HEADER DATE & RANGE SLIDER SETUP
  // ==========================================
  const today = new Date();
  const dateOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const currentDateEl = document.getElementById("current-date");
  if (currentDateEl) {
    currentDateEl.innerText = today.toLocaleDateString("en-US", dateOptions);
  }

  // Activity level range slider displayupdate
  const activitySlider = formEl
    ? formEl.elements["activityLevel"]
    : document.querySelector('[name="activityLevel"]');
  const rangeDisplay = document.getElementById("rangeValue");

  if (activitySlider && rangeDisplay) {
    activitySlider.addEventListener("input", function () {
      rangeDisplay.innerText = this.value;
    });

    // Reset slider text back to 5 when the form is reset
    if (formEl) {
      formEl.addEventListener("reset", function () {
        setTimeout(function () {
          rangeDisplay.innerText = "5";
        }, 10);
      });
    }
  }

  // ==========================================
  // 2. SSN AUTO-FORMATTING
  // ==========================================
  const ssnInput = formEl
    ? formEl.elements["socialSecurityNumber"]
    : document.querySelector('[name="socialSecurityNumber"]');
  if (ssnInput) {
    ssnInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
      if (value.length > 9) {
        value = value.slice(0, 9);
      }
      // Auto-insert dashes: 000-00-0000
      if (value.length > 5) {
        value =
          value.slice(0, 3) + "-" + value.slice(3, 5) + "-" + value.slice(5);
      } else if (value.length > 3) {
        value = value.slice(0, 3) + "-" + value.slice(3);
      }
      e.target.value = value;
      validateSSN();
    });
  }

  // ==========================================
  // 3. DYNAMIC FIELD VALIDATION
  // ==========================================

  // --- First/Middle/Last Name Validation ---
  const firstNameInput = formEl
    ? formEl.elements["firstName"]
    : document.querySelector('[name="firstName"]');
  const middleInitialInput = formEl
    ? formEl.elements["middleInitial"]
    : document.querySelector('[name="middleInitial"]');
  const lastNameInput = formEl
    ? formEl.elements["lastName"]
    : document.querySelector('[name="lastName"]');
  const nameError = document.getElementById("nameError");

  function validateNames() {
    let isValid = true;
    const nameRegex = /^[A-Za-z' -]{1,30}$/;
    const miRegex = /^[A-Za-z]?$/; // Optional single letter

    const fVal = firstNameInput ? firstNameInput.value.trim() : "";
    const mVal = middleInitialInput ? middleInitialInput.value.trim() : "";
    const lVal = lastNameInput ? lastNameInput.value.trim() : "";

    if (!fVal || !lVal) {
      nameError.innerText = "First and Last name are required.";
      isValid = false;
    } else if (!nameRegex.test(fVal) || !nameRegex.test(lVal)) {
      nameError.innerText =
        "Names must contain only letters, apostrophes, and dashes (max 30 chars).";
      isValid = false;
    } else if (!miRegex.test(mVal)) {
      nameError.innerText =
        "Middle initial must be a single letter (optional).";
      isValid = false;
    } else {
      nameError.innerText = "";
    }
    return isValid;
  }

  [firstNameInput, middleInitialInput, lastNameInput].forEach(function (el) {
    if (el) {
      el.addEventListener("input", validateNames);
      el.addEventListener("blur", validateNames);
    }
  });

  // --- Date of Birth Validation ---
 const dobInput = formEl
    ? formEl.elements["dateOfBirth"]
    : document.querySelector('[name="dateOfBirth"]');
  const dobError = document.getElementById("dobError");

  function validateDOB() {
    if (!dobInput.value) {
      dobError.innerText = "Date of birth is required.";
      return false;
    }

    // Get today's date in local YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0];

    // Direct string comparison for future dates (avoids UTC timezone bugs)
    if (dobInput.value > today) {
      dobError.innerText = "Date of birth cannot be in the future.";
      return false;
    }

    const dobDate = new Date(dobInput.value);
    const currentDate = new Date();
    const minDate = new Date();
    minDate.setFullYear(currentDate.getFullYear() - 120);

    if (dobDate < minDate) {
      dobError.innerText = "Date of birth cannot be more than 120 years ago.";
      return false;
    } else {
      dobError.innerText = "";
      return true;
    }
  }

  if (dobInput) {
    dobInput.addEventListener("input", validateDOB);
    dobInput.addEventListener("change", validateDOB);
    dobInput.addEventListener("blur", validateDOB);
  }

  // --- SSN Validation ---
  const ssnError = document.getElementById("ssnError");

  function validateSSN() {
    const ssnRegex = /^\d{3}-\d{2}-\d{4}$/;
    if (!ssnInput.value) {
      ssnError.innerText = "Social Security Number is required.";
      return false;
    } else if (!ssnRegex.test(ssnInput.value)) {
      ssnError.innerText = "SSN must be in 000-00-0000 format.";
      return false;
    } else {
      ssnError.innerText = "";
      return true;
    }
  }

  if (ssnInput) {
    ssnInput.addEventListener("input", validateSSN);
    ssnInput.addEventListener("blur", validateSSN);
  }

  // --- Address Lines & Location Validation ---
  const address1Input = formEl
    ? formEl.elements["addressLine1"]
    : document.querySelector('[name="addressLine1"]');
  const address2Input = formEl
    ? formEl.elements["addressLine2"]
    : document.querySelector('[name="addressLine2"]');
  const cityInput = formEl
    ? formEl.elements["city"]
    : document.querySelector('[name="city"]');
  const zipInput = formEl
    ? formEl.elements["zipCode"]
    : document.querySelector('[name="zipCode"]');
  const stateInput = formEl
    ? formEl.elements["state"]
    : document.querySelector('[name="state"]');
  const address1Error = document.getElementById("address1Error");
  const address2Error = document.getElementById("address2Error");
  const locationError = document.getElementById("locationError");

  function validateAddress1() {
    if (!address1Input.value.trim() || address1Input.value.length < 2) {
      address1Error.innerText =
        "Address Line 1 is required (at least 2 characters).";
      return false;
    }
    address1Error.innerText = "";
    return true;
  }

  function validateAddress2() {
    const val = address2Input ? address2Input.value.trim() : "";
    if (val !== "" && val.length < 2) {
      address2Error.innerText = "Address Line 2 must be at least 2 characters.";
      return false;
    }
    address2Error.innerText = "";
    return true;
  }

  function validateLocation() {
    let valid = true;
    let msg = "";

    const cityVal = cityInput ? cityInput.value.trim() : "";
    const cityRegex = /^[A-Za-z\s'-]{2,30}$/;

    if (!cityVal) {
      msg += "City is required. ";
      valid = false;
    } else if (!cityRegex.test(cityVal)) {
      msg +=
        "City must contain only letters, spaces, hyphens, and apostrophes. ";
      valid = false;
    }

    if (!stateInput.value) {
      msg += "Please select a State. ";
      valid = false;
    }

    const zipVal = zipInput ? zipInput.value.trim() : "";
    const zipNumericRegex = /^\d+$/;
    const zipExactRegex = /^\d{5}$/;

    if (!zipVal) {
      msg += "ZIP code is required. ";
      valid = false;
    } else if (!zipNumericRegex.test(zipVal)) {
      msg += "ZIP code must contain only numbers. ";
      valid = false;
    } else if (!zipExactRegex.test(zipVal)) {
      msg += "ZIP code must be exactly 5 digits. ";
      valid = false;
    }

    locationError.innerText = msg;
    return valid;
  }

  if (address1Input) {
    address1Input.addEventListener("input", validateAddress1);
    address1Input.addEventListener("blur", validateAddress1);
  }
  if (address2Input) {
    address2Input.addEventListener("input", validateAddress2);
    address2Input.addEventListener("blur", validateAddress2);
  }
  if (cityInput) {
    cityInput.addEventListener("input", validateLocation);
    cityInput.addEventListener("blur", validateLocation);
  }
  if (stateInput) {
    stateInput.addEventListener("change", validateLocation);
    stateInput.addEventListener("blur", validateLocation);
  }
  if (zipInput) {
    zipInput.addEventListener("input", validateLocation);
    zipInput.addEventListener("blur", validateLocation);
  }

  // --- Email Validation ---
  const emailInput = formEl
    ? formEl.elements["email"]
    : document.querySelector('[name="email"]');
  const emailError = document.getElementById("emailError");

  function validateEmail() {
    if (emailInput.value) {
      emailInput.value = emailInput.value.toLowerCase();
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailInput.value) {
      emailError.innerText = "Email address is required.";
      return false;
    } else if (!emailRegex.test(emailInput.value)) {
      emailError.innerText = "Email must be in format name@domain.tld";
      return false;
    } else {
      emailError.innerText = "";
      return true;
    }
  }

  if (emailInput) {
    emailInput.addEventListener("input", function () {
      this.value = this.value.toLowerCase();
      validateEmail();
    });
    emailInput.addEventListener("blur", validateEmail);
  }

  // --- Username/Passwords Validation ---
  const usernameInput = formEl
    ? formEl.elements["username"]
    : document.querySelector('[name="username"]');
  const passwordInput = formEl
    ? formEl.elements["password"]
    : document.querySelector('[name="password"]');
  const confirmPasswordInput = formEl
    ? formEl.elements["confirmPassword"]
    : document.querySelector('[name="confirmPassword"]');
  const usernameError = document.getElementById("usernameError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  function validateUsername() {
    const val = usernameInput.value;
    const userRegex = /^[A-Za-z][A-Za-z0-9_.-]{4,19}$/;

    if (!val) {
      usernameError.innerText = "User ID is required.";
      return false;
    } else if (!/^[A-Za-z]/.test(val)) {
      usernameError.innerText =
        "User ID cannot start with a number or special character.";
      return false;
    } else if (val.length < 5 || val.length > 20) {
      usernameError.innerText = "User ID must be between 5 and 20 characters.";
      return false;
    } else if (!userRegex.test(val)) {
      usernameError.innerText =
        "User ID can only contain letters, numbers, dashes, dots, and underscores.";
      return false;
    } else {
      usernameError.innerText = "";
      return true;
    }
  }

  function validatePassword() {
    const pwd = passwordInput ? passwordInput.value : "";
    const user = usernameInput ? usernameInput.value : "";
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    if (!pwd) {
      passwordError.innerText = "Password is required.";
      return false;
    } else if (pwd.length < 8) {
      passwordError.innerText = "Password must be at least 8 characters long.";
      return false;
    } else if (!pwdRegex.test(pwd)) {
      passwordError.innerText =
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit.";
      return false;
    } else if (user && pwd === user) {
      passwordError.innerText = "Password cannot equal your User ID.";
      return false;
    } else {
      passwordError.innerText = "";
      return true;
    }
  }

  function validateConfirmPassword() {
    const pwd = passwordInput ? passwordInput.value : "";
    const confirmPwd = confirmPasswordInput ? confirmPasswordInput.value : "";

    if (!confirmPwd) {
      if (pwd) {
        confirmPasswordError.innerText = "Passwords do not match.";
      } else {
        confirmPasswordError.innerText = "Please re-enter your password.";
      }
      return false;
    } else if (confirmPwd !== pwd) {
      confirmPasswordError.innerText = "Passwords do not match.";
      return false;
    } else {
      confirmPasswordError.innerText = "";
      return true;
    }
  }

  if (usernameInput) {
    usernameInput.addEventListener("input", validateUsername);
    usernameInput.addEventListener("blur", validateUsername);
  }
  if (passwordInput) {
    passwordInput.addEventListener("input", validatePassword);
    passwordInput.addEventListener("blur", validatePassword);
  }
  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", validateConfirmPassword);
    confirmPasswordInput.addEventListener("blur", validateConfirmPassword);
  }

  // ==========================================
  // 4. REVIEW BUTTON LOGIC
  // ==========================================
  const reviewBtn = document.getElementById("reviewBtn");
  const reviewArea = document.getElementById("reviewArea");
  const reviewContent = document.getElementById("reviewContent");

  // Helper function to dynamically pull label
  function getDynamicLabelText(fieldName, fallbackText) {
    const inputEl = formEl
      ? formEl.elements[fieldName]
      : document.querySelector(`[name="${fieldName}"]`);
    if (inputEl && inputEl.id) {
      const labelEl = document.querySelector(`label[for="${inputEl.id}"]`);
      if (labelEl) {
        return labelEl.innerText.replace(":", "").trim();
      }
    }
    return fallbackText;
  }

  // Helper function to format value with (Pass) or (Error: ...) and SSN masking
  function formatReviewField(inputEl, errorEl, fallbackLabel, fieldName) {
    let label = getDynamicLabelText(fieldName, fallbackLabel);
    let val = inputEl ? inputEl.value.trim() : "";
    let errText = errorEl ? errorEl.innerText.trim() : "";

    if (errText !== "") {
      let displayVal = val
        ? `<span class="review-val-invalid-input">${val}</span> `
        : "";
      return `<p><strong>${label}:</strong> ${displayVal}<span class="review-val-error">(Error: ${errText})</span></p>`;
    } else if (!val) {
      return `<p><strong>${label}:</strong> <span class="review-val-error">(Error: ${label} is required)</span></p>`;
    } else {
      let displayVal = val;
      if (fieldName === "socialSecurityNumber" && val.length >= 4) {
        displayVal = `***-**-${val.slice(-4)}`; // only show last 4 digits of SSN
      }
      return `<p><strong>${label}:</strong> ${displayVal} <span class="review-val-success">(Pass)</span></p>`;
    }
  }

  if (reviewBtn) {
    reviewBtn.addEventListener("click", function () {
      validatePassword();
      validateConfirmPassword();

      const firstName = firstNameInput ? firstNameInput.value.trim() : "";
      const mi = middleInitialInput ? middleInitialInput.value.trim() : "";
      const lastName = lastNameInput ? lastNameInput.value.trim() : "";
      const fullNameVal = (
        firstName +
        (mi ? " " + mi + " " : " ") +
        lastName
      ).trim();
      const nameErr = nameError ? nameError.innerText.trim() : "";
      const fullNameLabel = getDynamicLabelText("firstName", "Full Name");

      let nameDisplayHtml = "";
      if (!firstName || !lastName) {
        nameDisplayHtml = `<p><strong>${fullNameLabel}:</strong> <span class="review-val-error">(Error: First and Last name are required)</span></p>`;
      } else if (nameErr !== "") {
        nameDisplayHtml = `<p><strong>${fullNameLabel}:</strong> <span class="review-val-invalid-input">${fullNameVal}</span> <span class="review-val-error">(Error: ${nameErr})</span></p>`;
      } else {
        nameDisplayHtml = `<p><strong>${fullNameLabel}:</strong> ${fullNameVal} <span class="review-val-success">(Pass)</span></p>`;
      }

      // Address Line 1 & 2 handling
      const addr1Label = getDynamicLabelText("addressLine1", "Address Line 1");
      const addr2Label = getDynamicLabelText("addressLine2", "Address Line 2");
      const addr1Val = address1Input ? address1Input.value.trim() : "";
      const addr2Val = address2Input ? address2Input.value.trim() : "";
      const addr1Err = address1Error ? address1Error.innerText.trim() : "";
      const addr2Err = address2Error ? address2Error.innerText.trim() : "";

      let addr1DisplayHtml = "";
      if (addr1Err !== "" || !addr1Val) {
        let displayVal = addr1Val
          ? `<span class="review-val-invalid-input">${addr1Val}</span> `
          : "";
        let finalErr = addr1Err || "Address Line 1 is required.";
        addr1DisplayHtml = `<p><strong>${addr1Label}:</strong> ${displayVal}<span class="review-val-error">(Error: ${finalErr})</span></p>`;
      } else {
        addr1DisplayHtml = `<p><strong>${addr1Label}:</strong> ${addr1Val} <span class="review-val-success">(Pass)</span></p>`;
      }

      let addr2DisplayHtml = "";
      if (addr2Err !== "") {
        addr2DisplayHtml = `<p><strong>${addr2Label}:</strong> <span class="review-val-invalid-input">${addr2Val}</span> <span class="review-val-error">(Error: ${addr2Err})</span></p>`;
      } else if (addr2Val !== "") {
        addr2DisplayHtml = `<p><strong>${addr2Label}:</strong> ${addr2Val} <span class="review-val-success">(Pass)</span></p>`;
      } else {
        addr2DisplayHtml = `<p><strong>${addr2Label}:</strong> <span class="review-val-optional">[Not Provided / Optional]</span></p>`;
      }

      // Location handling
      const locLabel = getDynamicLabelText("city", "City, State, Zip");
      let locDisplayHtml = "";
      const locErr = locationError ? locationError.innerText.trim() : "";
      const cityVal = cityInput ? cityInput.value.trim() : "";
      const stateVal = stateInput ? stateInput.value : "";
      const zipVal = zipInput ? zipInput.value.trim() : "";

      if (locErr !== "" || !cityVal || !stateVal || !zipVal) {
        let currentLocStr =
          cityVal || stateVal || zipVal
            ? `<span class="review-val-invalid-input">${cityVal}, ${stateVal} ${zipVal}</span> `
            : "";
        let finalLocErr = locErr || "City, State, and ZIP Code are required.";
        locDisplayHtml = `<p><strong>${locLabel}:</strong> ${currentLocStr}<span class="review-val-error">(Error: ${finalLocErr})</span></p>`;
      } else {
        locDisplayHtml = `<p><strong>${locLabel}:</strong> ${cityVal}, ${stateVal} ${zipVal} <span class="review-val-success">(Pass)</span></p>`;
      }

      // Password Review Logic
      const pwdLabel = getDynamicLabelText("password", "Password");
      const pwdVal = passwordInput ? passwordInput.value : "";
      const confirmPwdVal = confirmPasswordInput
        ? confirmPasswordInput.value
        : "";
      const pwdErr = passwordError ? passwordError.innerText.trim() : "";

      let pwdDisplayHtml = "";

      if (!pwdVal && !confirmPwdVal) {
        pwdDisplayHtml = `<p><strong>${pwdLabel}:</strong> <span class="review-val-error">(Error: Password is required)</span></p>`;
      } else if (!pwdVal || !confirmPwdVal || pwdVal !== confirmPwdVal) {
        pwdDisplayHtml = `<p><strong>${pwdLabel}:</strong> <span class="review-val-error">(Error: Passwords do not match)</span></p>`;
      } else if (pwdErr !== "") {
        pwdDisplayHtml = `<p><strong>${pwdLabel}:</strong> <span class="review-val-error">(Error: ${pwdErr})</span></p>`;
      } else {
        pwdDisplayHtml = `<p><strong>${pwdLabel}:</strong> ******** <span class="review-val-success">(Pass)</span></p>`;
      }

      // Assemble review box 
      reviewContent.innerHTML =
        nameDisplayHtml +
        formatReviewField(dobInput, dobError, "Date of Birth", "dateOfBirth") +
        formatReviewField(
          ssnInput,
          ssnError,
          "Social Security Number",
          "socialSecurityNumber",
        ) +
        addr1DisplayHtml +
        addr2DisplayHtml +
        locDisplayHtml +
        formatReviewField(emailInput, emailError, "Email Address", "email") +
        formatReviewField(
          usernameInput,
          usernameError,
          "Desired User ID",
          "username",
        ) +
        pwdDisplayHtml;

      reviewArea.style.display = "block";
    });
  }

  // ==========================================
  // 5. VALIDATE BUTTON/CONDITIONAL SUBMIT
  // ==========================================
  const validateBtn = document.getElementById("validateBtn");
  const submitBtn = document.getElementById("submitBtn");

  if (validateBtn) {
    validateBtn.addEventListener("click", function () {
      const isNameValid = validateNames();
      const isDobValid = validateDOB();
      const isSsnValid = validateSSN();
      const isAddrValid = validateAddress1();
      const isAddr2Valid = validateAddress2();
      const isLocValid = validateLocation();
      const isEmailValid = validateEmail();
      const isUserValid = validateUsername();
      const isPwdValid = validatePassword();
      const isConfirmValid = validateConfirmPassword();

      if (
        isNameValid &&
        isDobValid &&
        isSsnValid &&
        isAddrValid &&
        isAddr2Valid &&
        isLocValid &&
        isEmailValid &&
        isUserValid &&
        isPwdValid &&
        isConfirmValid
      ) {
        alert(
          "Validation Successful! All entries are correct. You may now submit your registration.",
        );
        submitBtn.style.display = "inline-block";
      } else {
        alert("Please correct the highlighted errors before submitting.");
        submitBtn.style.display = "none";
      }
    });
  }

  // Hide submit button if any field is edited/changed afterwards
  if (formEl) {
    formEl.addEventListener("input", function () {
      if (submitBtn) submitBtn.style.display = "none";
    });
    formEl.addEventListener("change", function () {
      if (submitBtn) submitBtn.style.display = "none";
    });
  }
});
