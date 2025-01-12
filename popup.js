document.addEventListener("DOMContentLoaded", () => {
  const openPopupButton = document.getElementById("openPopup");
  const closePopupButton = document.getElementById("closePopup");
  const popup = document.getElementById("popup");
  const overlay = document.getElementById("overlay");

  openPopupButton.addEventListener("click", async () => {
      const questionInput = document.getElementById("typeQ"); // Moved inside event listener
      const question = questionInput.value.trim();

      if (!question) {
          alert("Please enter a question.");
          return;
      }

      const popupText = popup.querySelector("p");
      popupText.textContent = "Loading..."; // Show loading message

      try {
          const answer = await answerQuestion(question);
          popupText.textContent = answer; // Display the answer in the popup
      } catch (error) {
          popupText.textContent = "Error fetching response.";
      }

      popup.classList.add("active");
      overlay.classList.add("active");
  });

  closePopupButton.addEventListener("click", () => {
      popup.classList.remove("active");
      overlay.classList.remove("active");
  });

  overlay.addEventListener("click", () => {
      popup.classList.remove("active");
      overlay.classList.remove("active");
  });
});
