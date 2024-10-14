const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 100;
 
// set by default value
let drawing = false;  
let brushSize = 2;
let color = '#000000';
let bgColor = '#ffffff'; 

// local storage 
let undoStack = JSON.parse(localStorage.getItem('undoStack')) || [];
let redoStack = JSON.parse(localStorage.getItem('redoStack')) || [];


function updateLocalStorage() {
    localStorage.setItem('undoStack', JSON.stringify(undoStack));
    localStorage.setItem('redoStack', JSON.stringify(redoStack));
}

// apply event on canvas 
canvas.addEventListener('mousedown', (e) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.closePath();
    saveState();
});

canvas.addEventListener('mousemove', (e) => {
    if (drawing) {
        ctx.lineWidth = brushSize;
        ctx.strokeStyle = color;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }
});

// get value from button and input and update default value 
document.getElementById('colorPicker').addEventListener('input', (e) => {
    color = e.target.value;
    // alert(color)
});

document.getElementById('bgColorPicker').addEventListener('input', (e) => {
    bgColor = e.target.value;
    canvas.style.backgroundColor = bgColor;
});

document.getElementById('eraserBtn').addEventListener('click', () => {
    color = bgColor; // Set color to background color to "erase"
});

document.getElementById('clearBtn').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.backgroundColor = bgColor;
    undoStack = [];
    redoStack = [];
    updateLocalStorage();
});

document.getElementById('saveBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `my_painting_${Math.floor(Math.random()*100)}.png`;
    link.href = canvas.toDataURL();
    link.click();
});

document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);

document.getElementById('brushSize').addEventListener('change', (e) => {
    brushSize = e.target.value;
});

function saveState() {
    undoStack.push(canvas.toDataURL());
    redoStack = []; // Clear redo stack after a new action
    updateLocalStorage();
} 

function undo() {
    if (undoStack.length > 0) {
        const lastState = undoStack.pop();
        redoStack.push(canvas.toDataURL());
        const img = new Image();
        img.src = lastState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
            ctx.drawImage(img, 0, 0);
            updateLocalStorage();
        };
    }
}

function redo() {
    if (redoStack.length > 0) {
        const nextState = redoStack.pop();
        undoStack.push(canvas.toDataURL()); // toDataURL()  method returns a data URL containing a representation of the image
        const img = new Image();
        img.src = nextState;
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing
            ctx.drawImage(img, 0, 0);
            updateLocalStorage();
        };
    }
}

 
