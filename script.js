import { getData } from "./dataContext.js";
// html elements
const valueSlider = document.getElementById('valueSlider');
const valueDisplay = document.getElementById('valueDisplay');
const imageInput = document.getElementById('imageInput');
const imageContainer = document.getElementById('imageContainer');
const imageHeader = document.getElementById('imageHeader');
let dbData;
// Variables
let GRID_SIZE = valueSlider.value;
const GRID_PIECES = GRID_SIZE ** 2;
let imageArray = [GRID_PIECES];
let chosenImageOne;
let chosenImageTwo;

displayData();

// Event listeners
imageInput.addEventListener('change', handleImageUpload);

valueSlider.addEventListener('input', function () {
    GRID_SIZE = valueSlider.value;
    valueDisplay.textContent = `Value: ${GRID_SIZE}`;
});

async function displayData() {
    dbData = await getData();
    dbData.forEach(element => {
        const image = document.createElement('img');
        image.src = element['imgBase64'];
        image.id = 'dbImages';
        image.addEventListener('click', function(event) {
            const image = new Image();
            image.src = event.currentTarget.src;
            image.onload = function () {
                sliceAndDisplayImage(image);
            };
        });
        imageHeader.appendChild(image);
    });
}

function handleImageUpload(event) {
    console.log("handeling image upload");
    imageContainer.innerHTML = '';
    imageArray = [];
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                sliceAndDisplayImage(image);
            };
        };
        imageInput.value = '';
        reader.readAsDataURL(file);
    }
}

function sliceAndDisplayImage(image) {

    // Grid variables
    let pieceSizeHeight = image.height / GRID_SIZE;
    let pieceSizeWidth = image.width / GRID_SIZE;
    let currentPieceHeight = 0;
    let currentPieceWidth = 0;
    let columnNum = 1;

    let imageId = 0;

    // Not allowing user to go past 50, even if they try changing it in the console
    if (GRID_SIZE > 50) {
        alert('Grid to big')
        return;
    }
    for (let row = 0; row < GRID_SIZE; row++) {
        imageContainer.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 0fr)`;
        for (let column = 0; column < GRID_SIZE; column++) {

            const imageItem = document.createElement('div');
            imageItem.id = imageId;
            imageItem.classList.add('image-item');
            applyEventListener(imageItem);

            const canvas = document.createElement('canvas');
            var scale = 1;
            canvas.style.width = pieceSizeWidth + 'px';
            canvas.style.height = pieceSizeHeight + 'px';
            canvas.width = pieceSizeWidth * scale;
            canvas.height = pieceSizeHeight * scale;
            const context = canvas.getContext('2d');

            context.drawImage(image, currentPieceWidth, currentPieceHeight, pieceSizeWidth, pieceSizeHeight, 0, 0, pieceSizeWidth, pieceSizeHeight);
            currentPieceWidth += pieceSizeWidth;
            imageItem.appendChild(canvas);
            imageArray[imageId] = imageItem;
            imageId++;
        }
        currentPieceHeight += pieceSizeHeight;
        currentPieceWidth = 0;
        columnNum++;
    }
    mixImageArray();
    paintImage();
}

function mixImageArray() {
    for (let i = 0; i < imageArray.length; i++) {
        const j = Math.floor(Math.random() * (i + 1));
        [imageArray[i], imageArray[j]] = [imageArray[j], imageArray[i]]; // Swap elements
    }
}

function paintImage() {

    imageContainer.innerHTML = '';
    for (let i = 0; i < imageArray.length; i++) {
        imageContainer.appendChild(imageArray[i]);

    }
}

function applyEventListener(imageItem) {
    imageItem.addEventListener('click', function (event) {
        
        if (!chosenImageOne) {
            chosenImageOne = event.currentTarget.id;
        }
        else if (!chosenImageTwo) {
            chosenImageTwo = event.currentTarget.id;
        }
        if (chosenImageOne && chosenImageTwo) {
            const indexOne = imageArray.findIndex(image => image.id === chosenImageOne);
            const indexTwo = imageArray.findIndex(image => image.id === chosenImageTwo);
            
            [imageArray[indexOne], imageArray[indexTwo]] = [imageArray[indexTwo], imageArray[indexOne]]; // Swap elements
            
            checkMove(indexOne, indexTwo, event);
            paintImage(imageArray);
            chosenImageOne = null;
            chosenImageTwo = null;
        }
    });
}

function checkMove(arrayPosOne, arrayPosTwo, event) {
    paintImage();
    console.log(arrayPosOne + "and" + chosenImageOne);
    console.log(arrayPosTwo +"and" + chosenImageTwo);
    if (chosenImageOne == arrayPosTwo) {
        // matched a piece
    }

    if (chosenImageTwo == arrayPosOne) {
        // matched  a a piece
    }
}