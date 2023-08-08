const imageInput = document.getElementById('imageInput');
const imageContainer = document.getElementById('imageContainer');


imageInput.addEventListener('change', handleImageUpload);

function handleImageUpload(event) {
    imageContainer.innerHTML = '';
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
        reader.readAsDataURL(file);
    }
}

const image = new Image();
image.src = 'assets/Shaqi_jrvej.jpg';
image.onload = function () {
    sliceAndDisplayImage(image);
}

const GRID_SIZE = 3    ;
const GRID_PIECES = GRID_SIZE ** 2;

function sliceAndDisplayImage(image) {

    let pieceSizeHeight = image.height / GRID_SIZE;
    let pieceSizeWidth = image.width / GRID_SIZE;
    let currentPieceHeight = 0;
    let currentPieceWidth = 0;
    let columnNum = 1;

    console.log(`
                                Image info   
    -----------------------------------------------------------------
     Height: ${image.height}
     Width: ${image.width}
     Grid piece Height x Width ${image.width / GRID_SIZE} - ${image.height / GRID_SIZE}
    -----------------------------------------------------------------
    `);

    for (let row = 0; row < GRID_SIZE; row++) {
        imageContainer.style.gridTemplateColumns =`repeat(${GRID_SIZE}, 0fr)`;
        for (let column = 0; column < GRID_SIZE; column++) {

            const imageItem = document.createElement('div');
            imageItem.classList.add('image-item');
            imageContainer.appendChild(imageItem);


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
        }
        currentPieceHeight += pieceSizeHeight;
        currentPieceWidth = 0;
        columnNum++;
    }
}
