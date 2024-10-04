document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById('table-body');
    const targetSpan = document.getElementById("target");
    const leftAmountSpan = document.getElementById("left-amount");
    const totalAmountSpan = document.getElementById("total-amount");
    const resetButton = document.getElementById("reset-button");
    const modal = document.getElementById("myModal");
    const resetYesButton = document.getElementById("reset-yes");
    const resetNoButton = document.getElementById("reset-no");
    const congratsMessage = document.getElementById("congrats-message");
    const calculationContainer = document.getElementById("calculation-container");

    let rows = window.innerWidth <= 630 ? 20 : 10;
    let columns = window.innerWidth <= 630 ? 10 : 20;
    const totalCells = 200;
    const valueCounts = { 1: 0, 5: 0, 10: 0 };
    
    let cellValues = JSON.parse(localStorage.getItem('cellValues')) || [];
    let targetAmount = parseInt(targetSpan.textContent);
    let totalAmount = parseInt(localStorage.getItem("totalAmount")) || 0;
    let remainingAmount = parseInt(localStorage.getItem("remainingAmount")) || targetAmount;
    let clickedIndexes = JSON.parse(localStorage.getItem("clickedIndexes")) || [];
    let congratsShown = localStorage.getItem("congratsShown") === "true";
    
    if (!cellValues.length) {
        for (let i = 0; i < totalCells; i++) {
            let value = valueCounts[1] < 100 ? 1 : (valueCounts[5] < 50 ? 5 : 10);
            valueCounts[value]++;
            cellValues.push(value);
        }
        shuffleArray(cellValues);
        localStorage.setItem('cellValues', JSON.stringify(cellValues));
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function buildTable() {
        tableBody.innerHTML = '';
        let tableHTML = '';
        cellValues.forEach((value, index) => {
            if (index % columns === 0) tableHTML += '<tr>';
            const isClickedClass = clickedIndexes.includes(index) ? 'clicked' : '';
            tableHTML += `<td class="${isClickedClass}" data-index="${index}">${value}</td>`;
            if (index % columns === columns - 1) tableHTML += '</tr>';
        });
        tableBody.innerHTML = tableHTML;
    }

    function updateLocalStorage() {
        localStorage.setItem("totalAmount", totalAmount);
        localStorage.setItem("remainingAmount", remainingAmount);
        localStorage.setItem("clickedIndexes", JSON.stringify(clickedIndexes));
        localStorage.setItem("congratsShown", congratsShown);
    }

    function updateAmounts() {
        leftAmountSpan.textContent = Math.max(remainingAmount, 0);
        totalAmountSpan.textContent = totalAmount;
    }

    function toggleCongratsMessage(show) {
        congratsMessage.style.display = show ? "block" : "none";
        calculationContainer.classList.toggle("calculation-content", !show);
    }

    function handleClick(index, td) {
        const value = parseInt(td.textContent);
        const isClicked = td.classList.toggle("clicked");

        totalAmount += isClicked ? value : -value;
        remainingAmount = targetAmount - totalAmount;
        clickedIndexes = isClicked ? [...clickedIndexes, index] : clickedIndexes.filter(i => i !== index);

        congratsShown = totalAmount === targetAmount;
        updateAmounts();
        toggleCongratsMessage(congratsShown);
        updateLocalStorage();
    }

    tableBody.addEventListener("click", (event) => {
        if (event.target.tagName === 'TD') {
            handleClick(parseInt(event.target.dataset.index), event.target);
        }
    });

    resetButton.addEventListener("click", () => modal.style.display = "flex");

    resetYesButton.addEventListener("click", () => {
        localStorage.clear();
        totalAmount = 0;
        remainingAmount = targetAmount;
        clickedIndexes = [];
        congratsShown = false;
        cellValues = [];
        valueCounts[1] = 0;
        valueCounts[5] = 0;
        valueCounts[10] = 0;
        for (let i = 0; i < totalCells; i++) {
            let value = valueCounts[1] < 100 ? 1 : (valueCounts[5] < 50 ? 5 : 10);
            valueCounts[value]++;
            cellValues.push(value);
        }
        shuffleArray(cellValues);
        localStorage.setItem('cellValues', JSON.stringify(cellValues));
        buildTable();
        updateAmounts();
        toggleCongratsMessage(false);
        modal.style.display = "none";
    });

    resetNoButton.addEventListener("click", () => modal.style.display = "none");

    window.addEventListener('resize', () => {
        rows = window.innerWidth <= 768 ? 20 : 10;
        columns = window.innerWidth <= 768 ? 10 : 20;
        buildTable();
    });

    buildTable();
    updateAmounts();
    toggleCongratsMessage(congratsShown);
});
