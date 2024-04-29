

const numberField = document.querySelector('#numberField');
const oppDisplay = document.querySelector('#opp');
const resultDisplay = document.querySelector('#result');
const container = document.querySelector('.container');
let memory = 0;
let indexColor = 0;

numberField.addEventListener(('click'), event => {
    if (event.target.tagName === 'BUTTON') {
        const buttonValue = event.target.dataset.value;
        return processInput(buttonValue);
    };
});



function processInput(buttonValue) {
    if (buttonValue !== '$gleich') {
        outputInput(buttonValue);
        return
    }
    calculate();
}

// processes the input on shows numbers and operators on the UI display 
function outputInput(buttonValue) {

    let oppDisplayText = oppDisplay.textContent;

    // delete old result if more input
    if (oppDisplayText !== '=' && buttonValue !== 'M+' && buttonValue !== 'M-')
        resultDisplay.textContent = '=';

    // if input isNaN
    if (isNaN(buttonValue)) {
        switch (buttonValue) {
            case "del":
                oppDisplay.textContent = '';
                resultDisplay.textContent = '=';
                break;
            case "back":
                if (oppDisplayText.slice(-1) === ' ') {
                    oppDisplay.textContent = oppDisplayText.slice(0, -3);
                    break;
                }
                oppDisplay.textContent = oppDisplayText.slice(0, -1);
                resultDisplay.textContent = '=';
                break;
            case "Mdel":
                memory = 0;
                break;
            case "M":
                oppDisplay.textContent += memory;
                break;
            case "M+":
                if (resultDisplay.textContent !== "=")
                    memory += memory + Number(resultDisplay.textContent);
                break;
            case "M-":
                if (resultDisplay.textContent !== "=")
                    memory += memory - Number(resultDisplay.textContent);
                break;
            case "-":
                if (oppDisplayText === '' || oppDisplayText.slice(-1) === ' ') {
                    oppDisplay.textContent += '-'
                    break;
                }
                oppDisplay.textContent += ' - ';
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
                if (oppDisplayText === '' || oppDisplayText.slice(-1) === ' ')
                    break;
                oppDisplay.textContent += ',';
                break;
            default:
                // check if first input an operation, then break
                if (oppDisplayText === '')
                    break;
                // check if last char a ' ', then last input was operation and should be overwritten
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