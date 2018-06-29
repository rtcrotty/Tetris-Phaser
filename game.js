var game = new Phaser.Game(200, 400, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var blockScale=20;

function preload () {
    game.load.baseURL='assets/';
    
    game.load.image('matrixBG', 'matrix.png');
    game.load.image('block', 'block.png');
}

var matWidth = 10, matHeight = 20;
var matrix;
var matGroup;
var currentPiece = null;

var upKey, downKey, leftKey, rightKey;
var cwKey, ccwKey, holdKey;
function create () {
    var matrixBG=game.add.image(0,0,'matrixBG');
    matrixBG.anchor.setTo(0,0);
    
    matrix = [];
    var x,y;
    for(x = 0; x < matWidth; x++) { 
        matrix[x] = [];
        for(y=-matHeight; y < matHeight; y++) {
            matrix[x][y] = 0;
        }
    }
    
    
    currentPiece = spawnPiece(nextPiece(),4,0,0);
    renderPiece(currentPiece);
    
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    
    cwKey = game.input.keyboard.addKey(Phaser.Keyboard.X);
    ccwKey = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    holdKey = game.input.keyboard.addKey(Phaser.Keyboard.C);
}

function spawnPiece(name, x, y, rot) {
    var piece = game.add.group(game.world,'tetra');
    piece.x = x*blockScale; piece.y = y*blockScale;
    piece.data = [];
    piece.data.name = name;
    piece.data.x = x;
    piece.data.y = y;
    piece.data.rot = rot;
    piece.data.blocks = offsetBank[name][rot];
    return piece;
}

function renderPiece(piece) {
    offsets = piece.data.blocks;
    for(let pos in offsets) {
        let block = game.add.image(offsets[pos][0]*blockScale,offsets[pos][1]*blockScale,'block',0,piece);
        block.anchor.setTo(0,0);
    }
}

// returns name of piece to spawn
// valid values: I,J,L,O,S,T,Z
var bag = ['I','J','L','O','S','T','Z'];
var currentBag;
function nextPiece() {
    if(currentBag == null || currentBag.length == 0) {
        currentBag = bag.slice(0);
        shuffle(currentBag);
    }
    return currentBag.pop();
}

var offsetBank = [];
offsetBank.I = [
    [[-1,0],[0,0],[1,0],[2,0]],
    [[1,-1],[1,0],[1,1],[1,2]],
    [[-1,1],[0,1],[1,1],[2,1]],
    [[0,-1],[0,0],[0,1],[0,2]]
];
offsetBank.J = [
    [[-1,-1],[-1,0],[0,0],[1,0]],
    [[1,-1],[0,-1],[0,0],[0,1]],
    [[1,1],[1,0],[0,0],[-1,0]],
    [[-1,1],[0,1],[0,0],[0,-1]]
];
offsetBank.L = [
    [[1,-1],[1,0],[0,0],[-1,0]],
    [[1,1],[0,1],[0,0],[0,-1]],
    [[-1,1],[-1,0],[0,0],[1,0]],
    [[-1,-1],[0,-1],[0,0],[0,1]]
];
offsetBank.O = [
    [[0,-1],[0,0],[1,-1],[1,0]],
    [[0,-1],[0,0],[1,-1],[1,0]],
    [[0,-1],[0,0],[1,-1],[1,0]],
    [[0,-1],[0,0],[1,-1],[1,0]]
];
offsetBank.S = [
    [[-1,0],[0,0],[0,-1],[1,-1]],
    [[0,-1],[0,0],[1,0],[1,1]],
    [[1,0],[0,0],[0,1],[-1,1]],
    [[0,1],[0,0],[-1,0],[-1,-1]],
];
offsetBank.T = [
    [[-1,0],[0,0],[0,-1],[1,0]],
    [[0,0],[0,-1],[1,0],[0,1]],
    [[-1,0],[0,0],[1,0],[0,1]],
    [[-1,0],[0,0],[0,-1],[0,1]],
];
offsetBank.Z = [
    [[1,0],[0,0],[0,-1],[-1,-1]],
    [[0,1],[0,0],[1,0],[1,-1]],
    [[-1,0],[0,0],[0,1],[1,1]],
    [[0,-1],[0,0],[-1,0],[-1,1]],
];
var wallkickBank = [];
wallkickBank.I = [];
wallkickBank.J = wallkickBank.L = wallkickBank.O = wallkickBank.S = wallkickBank.T = wallkickBank.Z = [];
wallkickBank.I[1] = [
    [[-2,0],[1,0],[-2,1],[1,-2]],
    [[-1,0],[2,0],[-1,-2],[2,1]],
    [[2,0],[-1,0],[2,-1],[-1,2]],
    [[1,0],[-2,0],[1,2],[-2,-1]]
];
wallkickBank.I[-1] = [
    [[-1,0],[2,0],[-1,-2],[-2,1]],
    [[2,0],[-1,0],[2,-1],[-1,2]],
    [[1,0],[-2,0],[1,2],[-2,-1]],
    [[-2,0],[1,0],[-2,1],[1,-2]]
];
wallkickBank.J[1] = [
    [[-1,0],[-1,-1],[0,2],[-1,2]],
    [[1,0],[1,1],[0,-2],[1,-2]],
    [[1,0],[1,-1],[0,2],[1,2]],
    [[-1,0],[-1,1],[0,-2],[-1,-2]]
];
wallkickBank.J[-1] = [
    [[1,0],[1,-1],[0,2],[1,2]],
    [[1,0],[1,1],[0,-2],[1,-2]],
    [[-1,0],[-1,-1],[0,2],[-1,2]],
    [[-1,0],[-1,1],[0,-2],[-1,-2]]
];

function update () {
    if(currentPiece != null) {
        let x=0, y=0, rot=0;
        if(upKey.justDown) {
            lockPiece(matrix);
        }
        if(downKey.justDown) {
            y += 1;
        }
        if(leftKey.justDown) {
            x -= 1;
        }
        if(rightKey.justDown) {
            x += 1;
        }
        if(cwKey.justDown) {
            rot += 1;
        }
        if(ccwKey.justDown) {
            rot -= 1;
        }
        if(x || y || rot) {
            movePiece(x,y,rot);
        }
    }
}


function movePiece(x,y,rot) {
    var currX, currY, currRot, name;
    var intX, intY, intRot;
    currX = currentPiece.data.x;
    currY = currentPiece.data.y;
    currRot = currentPiece.data.rot;
    name = currentPiece.data.name;
    intX = currX + x;
    intY = currY + y;
    intRot = (currRot + rot + 4) % 4;
    var newPiece = spawnPiece(name,intX,intY,intRot);
    valid = isValid(newPiece, matrix);
    
    if(!valid && rot != 0) {
        var i;
        for(i=0; i<wallkickBank[name][rot][currRot].length; i++) {
            newPiece.destroy();
            newPiece = spawnPiece(name,
                intX+wallkickBank[name][rot][currRot][i][0],
                intY+wallkickBank[name][rot][currRot][i][1],
                intRot);
            valid = isValid(newPiece, matrix);
            if(valid) { break; }
        }
    }
    
    if(valid) {
        currentPiece.destroy(true);
        renderPiece(newPiece);
        currentPiece = newPiece;
        return true;
    } else {
        newPiece.destroy();
        return false;
    }
}

function isValid(piece, matrix) {
    for(let block in piece.data.blocks) {
        let x = piece.data.x + piece.data.blocks[block][0];
        let y = piece.data.y + piece.data.blocks[block][1];
        if(x < 0 || x >= matWidth) { return false; }
        if(y < -matHeight || y >= matHeight) { return false; }
        if(matrix[x][y] != 0) { return false; }
    }
    return true;
}

function lockPiece(matrix) {
    while(movePiece(0,1,0)) {}
    for(let block in currentPiece.data.blocks) {
        let x = currentPiece.data.x + currentPiece.data.blocks[block][0];
        let y = currentPiece.data.y + currentPiece.data.blocks[block][1];
        matrix[x][y] = 1;
    }
    currentPiece.destroy(true);
    updateMatrix(matrix);
    renderMatrix(matrix);
    currentPiece = spawnPiece(nextPiece(),4,0,0);
    renderPiece(currentPiece);
    if(!isValid(currentPiece,matrix)) {
        console.log('Game Over!');
    }
}

function updateMatrix(matrix) {
    var x,y;
    for(y=-matHeight; y<matHeight; y++) {
        let clear = true;
        for(x=0; x<matWidth; x++) {
            if(matrix[x][y] == 0) {
                clear = false;
                break;
            }
        }
        if(clear) {
            var yi;
            for(yi=y; yi>-matHeight; yi--) {
                for(x=0; x<matWidth; x++) {
                    matrix[x][yi]=matrix[x][yi-1];
                }
            }
            for(x=0; x<matWidth; x++) {
                matrix[x][-matHeight] = 0;
            }
        }
    }
}

function renderMatrix() {
    if(matGroup == null) { matGroup = game.add.group(game.world, 'matrix'); }
    matGroup.removeAll(true);
    
    var x,y;
    for(x = 0; x < matWidth; x++) {
        for(y=0; y < matHeight; y++) {
            if(matrix[x][y]) {
                let block = game.add.image(x*blockScale,y*blockScale,'block',0,matGroup);
                block.anchor.setTo(0,0);
            }
        }
    }
}

/**
 * Fisher-Yates shuffle, pulled from StackOverflow
 * Shuffles array in place.
 * @param {Array} a items An array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}