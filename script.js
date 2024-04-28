

const numberField = document.querySelector('#numberField');
const oppDisplay = document.querySelector('#opp');
const resultDisplay = document.querySelector('#result');

numberField.addEventListener(('click'), event => {
    if (event.target.tagName === 'BUTTON') {
        const buttonText = event.target.dataset.value;
        return processInput(buttonText);
    }

});



function processInput(buttonValue) {
    if (buttonValue !== '$gleich') {
        outputInput(buttonValue);
        return
    }
     calculate();


}


function outputInput(buttonValue) {

    if (buttonValue.includes("$")) {
        buttonValue = buttonValue.slice(1);
        switch (buttonValue) {
            case "del":
                oppDisplay.textContent = '';
                break;
            case "back":
                let oppDisplayText = oppDisplay.textContent;
                oppDisplayText = oppDisplayText.slice(0, -1);
                oppDisplay.textContent = oppDisplayText;
                break;
            default:
                oppDisplay.textContent += ` ${buttonValue} `;
        }

    }else{
        oppDisplay.textContent += buttonValue;
    }
}


function calculate(){
    const oppDisplayText = oppDisplay.textContent;
    let result = eval(oppDisplayText);


    resultDisplay.textContent = result; 
}