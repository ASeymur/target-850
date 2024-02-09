const tableBody = document.getElementById('table-body');

const rows = 10;
const columns = 20;

let sum = 0;

const valueCounts = {
    1: 0,
    5: 0,
    10: 0
};

let cellValues = [];

let storedCellValues = localStorage.getItem('cellValues');

if (storedCellValues) {
    cellValues = JSON.parse(storedCellValues);
} else {
    for (let i = 0; i < rows * columns; i++) {
        let value;
        if (valueCounts[1] < 100) {
            value = 1;
        } else if (valueCounts[5] < 50) {
            value = 5;
        } else {
            value = 10;
        }
        sum += value;
        valueCounts[value]++;
        cellValues.push(value);
    }
    shuffleArray(cellValues);
    localStorage.setItem('cellValues', JSON.stringify(cellValues));
}

let tableHTML = '';

for (let i = 0; i < rows; i++) {
    let rowHTML = '<tr>';
    for (let j = 0; j < columns; j++) {
        let value = cellValues[i * columns + j];
        rowHTML += `<td>${value}</td>`;
    }
    rowHTML += '</tr>';
    tableHTML += rowHTML;
}

tableBody.innerHTML = tableHTML;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
