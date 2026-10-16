const display = document.getElementById('display');
const allButtons = document.querySelectorAll('button');
 

let expression = '';      
let showingResult = false;  
 
const operators = ['+', '−', '×', '÷'];
 
function isOperator(character) {
    return operators.includes(character);
}
 

function updateDisplay() {
    if (expression === '') {
        display.textContent = '0';
    } else {
        display.textContent = expression;
    }
    
    display.classList.toggle('small', display.textContent.length > 10);
}
 

function appendValue(value) {
    if (showingResult && !isOperator(value)) {
        expression = '';
    }
    showingResult = false;
 
    const lastCharacter = expression.slice(-1);
 
    if (isOperator(value)) {
      
        if (expression === '' && value !== '−') return;
 
        if (isOperator(lastCharacter)) {
            if (expression.length === 1) return;
            expression = expression.slice(0, -1);
        }
    }
 
    if (value === '.') {
        const numbers = expression.split(/[+−×÷]/);
        const currentNumber = numbers[numbers.length - 1];
        if (currentNumber.includes('.')) return;
    }
 
    expression = expression + value;
    updateDisplay();
}
 

function calculate() {
    
    const pieces = expression.match(/\d+\.?\d*|\.\d+|[+−×÷]/g);
    if (!pieces) return;
 
   
    if (isOperator(pieces[pieces.length - 1])) {
        pieces.pop();
    }
    if (pieces.length === 0) return;
 
    
    if (pieces[0] === '−') {
        pieces.shift();
        pieces[0] = '-' + pieces[0];
    }
 
    let i = 0;
    while (i < pieces.length) {
        if (pieces[i] === '×' || pieces[i] === '÷') {
            const left = Number(pieces[i - 1]);
            const right = Number(pieces[i + 1]);
 
            if (pieces[i] === '÷' && right === 0) {
                showError();
                return;
            }
 
            const answer = pieces[i] === '×' ? left * right : left / right;
            
            pieces.splice(i - 1, 3, answer);
        } else {
            i++;
        }
    }
 
  
    i = 0;
    while (i < pieces.length) {
        if (pieces[i] === '+' || pieces[i] === '−') {
            const left = Number(pieces[i - 1]);
            const right = Number(pieces[i + 1]);
 
            const answer = pieces[i] === '+' ? left + right : left - right;
            pieces.splice(i - 1, 3, answer);
        } else {
            i++;
        }
    }
 

    const result = Math.round(Number(pieces[0]) * 1e10) / 1e10;
 
    expression = String(result);
    showingResult = true;
    updateDisplay();
}
 
function showError() {
    expression = '';
    display.textContent = 'Error';
}
 
function clearDisplay() {
    expression = '';
    showingResult = false;
    updateDisplay();
}
 
function deleteLast() {
    if (showingResult) {
        clearDisplay();
        return;
    }
    expression = expression.slice(0, -1);
    updateDisplay();
}
 

allButtons.forEach(function (button) {
    button.addEventListener('click', function () {
        const value = button.dataset.value;   
        const action = button.dataset.action; 
 
        if (value) {
            appendValue(value);
        } else if (action === 'equals') {
            calculate();
        } else if (action === 'clear') {
            clearDisplay();
        } else if (action === 'delete') {
            deleteLast();
        }
    });
});
 

document.addEventListener('keydown', function (event) {
    const key = event.key;
 
    if (key >= '0' && key <= '9') {
        appendValue(key);
    } else if (key === '.') {
        appendValue('.');
    } else if (key === '+') {
        appendValue('+');
    } else if (key === '-') {
        appendValue('−');
    } else if (key === '*') {
        appendValue('×');
    } else if (key === '/') {
        event.preventDefault();
        appendValue('÷');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
        clearDisplay();
    }
});
 
updateDisplay();