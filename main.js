document.addEventListener("DOMContentLoaded", function () {
    const tdElements = document.querySelectorAll("td");
    const targetSpan = document.getElementById("target");
    const leftAmountSpan = document.getElementById("left-amount");
    const totalAmountSpan = document.getElementById("total-amount");
    const resetButton = document.getElementById("reset-button");
    const modal = document.getElementById("myModal");
    const resetYesButton = document.getElementById("reset-yes");
    const resetNoButton = document.getElementById("reset-no");
    const congratsMessage = document.getElementById("congrats-message");
    const calculationContainer = document.getElementById("calculation-container");

    let targetAmount = parseInt(targetSpan.textContent);
    let totalAmount = parseInt(localStorage.getItem("totalAmount")) || 0;
    let remainingAmount = parseInt(localStorage.getItem("remainingAmount")) || targetAmount;
    let clickedIndexes = JSON.parse(localStorage.getItem("clickedIndexes")) || [];
    let congratsShown = localStorage.getItem("congratsShown") === "true";
    let calculateShown = localStorage.getItem("calculateShown") === "true";

    function updateLocalStorage() {
        localStorage.setItem("totalAmount", totalAmount);
        localStorage.setItem("remainingAmount", remainingAmount);
        localStorage.setItem("clickedIndexes", JSON.stringify(clickedIndexes));
        localStorage.setItem("congratsShown", congratsShown);
        localStorage.setItem("calculateShown", calculateShown);
    }

    function updateAmounts() {
        leftAmountSpan.textContent = Math.max(remainingAmount, 0);
        totalAmountSpan.textContent = totalAmount;
    }

    function toggleCongratsMessage(show) {
        congratsMessage.style.display = show ? "block" : "none";
        calculationContainer.classList.toggle("calculation-content", !show);
    }

    function handleClick(index) {
        const value = parseInt(tdElements[index].textContent);
        const isClicked = tdElements[index].classList.toggle("clicked");

        totalAmount += isClicked ? value : -value;
        remainingAmount = targetAmount - totalAmount;
        clickedIndexes = isClicked ? [...clickedIndexes, index] : clickedIndexes.filter(i => i !== index);

        if (totalAmount === 850) {
            congratsShown = true;
            calculateShown = false;
        } else {
            congratsShown = false;
            calculateShown = true;
        }

        updateAmounts();
        toggleCongratsMessage(congratsShown);
        updateLocalStorage();
    }

    tdElements.forEach((td, index) => {
        td.addEventListener("click", () => handleClick(index));
        if (clickedIndexes.includes(index)) {
            td.classList.add("clicked");
        }
    });

    resetButton.addEventListener("click", () => modal.style.display = "block");

    resetYesButton.addEventListener("click", () => {
        localStorage.clear();
        totalAmount = 0;
        remainingAmount = targetAmount;
        clickedIndexes = [];
        congratsShown = false;
        calculateShown = true;
        tdElements.forEach(td => td.classList.remove("clicked"));
        updateAmounts();
        toggleCongratsMessage(false);
        modal.style.display = "none";
    });

    resetNoButton.addEventListener("click", () => modal.style.display = "none");

    updateAmounts();
    toggleCongratsMessage(congratsShown);
});
