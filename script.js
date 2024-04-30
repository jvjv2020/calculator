

const numberField = document.querySelector('#numberField');
const oppDisplay = document.querySelector('#opp');
const resultDisplay = document.querySelector('#result');
const container = document.querySelector('.container');
let memoryValue = 0;   // memorystorage in calculator
let indexColor = 0;  // index for colorchanger

numberField.addEventListener(('click'), event => {
    if (event.target.tagName === 'BUTTON') {
        const buttonValue = event.target.dataset.value;
        return processInput(buttonValue);
    };
});

window.addEventListener('keydown', (e) => {
    const key = document.querySelector(`button[data-value='${e.key}']`);
    if (key) {
        key.click();
    }
});



function processInput(buttonValue) {
    if (buttonValue !== 'Enter') {
        outputInput(buttonValue);
        return
    }
    calculate();
}

// processes the input on shows numbers and operators on the UI display 
function outputInput(buttonValue) {

    let oppDisplayText = oppDisplay.textContent;

    // delete old result if more input
    if (oppDisplayText !== '=' && buttonValue !== 'Memory+' && buttonValue !== 'Memory-')
        resultDisplay.textContent = '=';

    // if input isNaN
    if (isNaN(buttonValue)) {
        //check if last input was '-' for making a number negativ, so number is expected
        if (buttonValue.length < 3 && oppDisplayText.slice(-1) === '-')
            return;

        switch (buttonValue) {
            case "Delete":
                oppDisplay.textContent = '';
                resultDisplay.textContent = '=';
                kommaCheck = false;
                break;
            case "Backspace":
                if (oppDisplayText.slice(-1) === ' ') {
                    oppDisplay.textContent = oppDisplayText.slice(0, -3);
                    break;
                }
                if (oppDisplayText.slice(-1) === ',')
                    kommaCheck = false;
                oppDisplay.textContent = oppDisplayText.slice(0, -1);
                resultDisplay.textContent = '=';
                break;
            case "MemoryDel":
                memoryValue = 0;
                break;
            case "Memory":
                if (oppDisplayText.slice(-1) === '' || oppDisplayText.slice(-1) === ' ' || oppDisplayText.slice(-1) === '-')
                    oppDisplay.textContent += memoryValue;
                break;
            case "Memory+":
                if (resultDisplay.textContent !== "=")
                    memoryValue += Number(resultDisplay.textContent);
                break;
            case "Memory-":
                if (resultDisplay.textContent !== "=")
                    memoryValue -= Number(resultDisplay.textContent);
                break;
            case "-":
                if (oppDisplayText === '' || (oppDisplayText.slice(-1) === ' ')) {
                    oppDisplay.textContent += '-'
                    break;
                }
                oppDisplay.textContent += ' - ';
                kommaCheck = false;
                break;
            case "color":
                let remove = indexColor;
                indexColor++;
                if (indexColor === 3)
                    indexColor = 0;
                container.classList.add(`colored${indexColor}`);
                container.classList.remove(`colored${remove}`);
                break;
            case ",":
                if (oppDisplayText === '' || oppDisplayText.slice(-1) === ' ' || kommaCheck)
                    break;
                kommaCheck = true;
                oppDisplay.textContent += ',';
                break;
            default:
                // check if first input an operation, then break
                if (oppDisplayText === '')
                    break;
                // check if last char a ' ', then last input was operation and should be overwritten
                kommaCheck = false;
                if (oppDisplayText.slice(-1) === ' ') {
                    oppDisplay.textContent = `${oppDisplayText.slice(0, -3)} ${buttonValue} `;
                } else
                    oppDisplay.textContent += ` ${buttonValue} `;
        }
        // if input is a number
    } else {
        oppDisplay.textContent += buttonValue;
    }
}


function calculate() {
    const oppDisplayText = oppDisplay.textContent.replace(/,/g, '.');
    // let result = eval(oppDisplayText);

    calculation = oppDisplayText.split(' ');
    let interimCalc;


    // calculate X^y and y root of X
    while (true) {

        let foundIndex = calculation.findIndex(item => item === '**' || item === 'rt');
        if (foundIndex === -1) break;

        switch (calculation[foundIndex]) {
            case ('**'):
                interimCalc = calculation[foundIndex - 1] ** calculation[foundIndex + 1];
                break;
            case ('rt'):
                interimCalc = calculation[foundIndex - 1] ** (1 / calculation[foundIndex + 1]);

        }
        calculation.splice(foundIndex - 1, 3, interimCalc)

    }


    // calculate *,/
    while (true) {

        let foundIndex = calculation.findIndex(item => item === '*' || item === '/');
        if (foundIndex === -1) break;

        switch (calculation[foundIndex]) {
            case ('*'):
                interimCalc = calculation[foundIndex - 1] * calculation[foundIndex + 1];
                break;
            case ('/'):
                interimCalc = calculation[foundIndex - 1] / calculation[foundIndex + 1];

        }
        calculation.splice(foundIndex - 1, 3, interimCalc)

    }

    // calculate +,-
    while (true) {

        let foundIndex = calculation.findIndex(item => item === '+' || item === '-');
        if (foundIndex === -1) break;

        switch (calculation[foundIndex]) {
            case ('+'):
                interimCalc = parseFloat(calculation[foundIndex - 1]) + parseFloat(calculation[foundIndex + 1]);
                break;
            case ('-'):
                interimCalc = calculation[foundIndex - 1] - calculation[foundIndex + 1];

        }
        calculation.splice(foundIndex - 1, 3, interimCalc)

    }



    resultDisplay.textContent = calculation[0];
}