this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl("/gameHub")
    .build();

function TryUpdateToken()
{
    $.ajax({
        url:  "../Authorization/TryUpdate",
        method: 'post',   
        dataType: 'html',
        error: function () 
        {
            window.location.href = '/login';
        }
    }); 
}
async function start() {
    try 
    {
        await hubConnection.start();
        return true;
    } catch (err) 
    {
        TryUpdateToken();
        setTimeout(start, 500);
    }
};

hubConnection.onclose(async () => {
    if (!await start())
        window.location.href = '/login';
});


start();  


var canva = document.getElementById("ChessBoard");
var context = canva.getContext("2d");

var sizeSide = 0;
var SizeCell = 80;
var zeroX = 0;
var zeroY = 0;
var PlayerSide = "White";
var PossibleMoves = Array(0);

var SelectedCell = new Image();
SelectedCell.src = 'sprites/SelectCell.png';

var deskWhiteImg = new Image();
deskWhiteImg.src = 'sprites/DeskBlack.png'; 
var deskBlackImg = new Image();
deskBlackImg.src = 'sprites/DeskWhite.svg'; 

var whitePawnImg = new Image();
whitePawnImg.src = 'sprites/PawnWhite.svg'; 

var whiteRookImg = new Image();
whiteRookImg.src = 'sprites/RookWhite.svg'; 

var whiteKingImg = new Image();
whiteKingImg.src = 'sprites/KingWhite.svg'; 

var whiteQueenImg = new Image();
whiteQueenImg.src = 'sprites/QueenWhite.svg'; 

var whiteBishopImg = new Image();
whiteBishopImg.src = 'sprites/BishopWhite.svg'; 

var whiteKnightImg = new Image();
whiteKnightImg.src = 'sprites/KnightWhite.svg'; 


var blackPawnImg = new Image();
blackPawnImg.src = 'sprites/PawnBlack.svg'; 

var blackRookImg = new Image();
blackRookImg.src = 'sprites/RookBlack.svg'; 

var blackKingImg = new Image();
blackKingImg.src = 'sprites/KingBlack.svg'; 

var blackQueenImg = new Image();
blackQueenImg.src = 'sprites/QueenBlack.svg'; 

var blackBishopImg = new Image();
blackBishopImg.src = 'sprites/BishopBlack.svg'; 

var blackKnightImg = new Image();
blackKnightImg.src = 'sprites/KnightBlack.svg'; 

const Figure = {Pawn: 'Pawn', King: 'King', Rook: 'Rook', Knight: 'Knight', Bishop: 'Bishop', Queen: 'Queen'};
const Side = {White: 'White', Black: 'Black'}

var firstClick = true;
var LastClick;


canva.addEventListener('mousedown', function (e) {
    
    Click(Math.floor((e.clientX - canva.offsetLeft - zeroX) / SizeCell),
    Math.floor((e.clientY - canva.offsetTop - zeroY) / SizeCell));
});

var Board = new Array(8);
for (i = 0; i < 8; i++)
{
    Board[i] = new Array(8);
}
for (i = 0; i < 8; i++)
{
    for (j = 0; j < 8; j++)
    {
         Board[i][j] = null;
    }
}

var SelectedCellsArray = new Array(8);
for (i = 0; i < 8; i++)
{
    SelectedCellsArray[i] = new Array(8);
}
for (i = 0; i < 8; i++)
{
    for (j = 0; j < 8; j++)
    {
        SelectedCellsArray[i][j] = null;
    }
}

var HasSelectedCells = false;

let drawing = setInterval(UpdateScreen, 300);

function Move(xfrom, yfrom, tox, toy)
{
    let from = String(yfrom * 8 + xfrom);
    let to = String(toy * 8 + tox);
    if (from.length < 2)
        from = "0" + from;
    if (to.length < 2)
        to = "0" + to;

    hubConnection.invoke("Move", from+to);
    
}

hubConnection.on("SetPlayers", (players) =>
{
    if (PlayerSide == "Black")
    {
        document.getElementById("Player1").innerText = players.value.player1;
        document.getElementById("Player2").innerText = players.value.player2;
    }
    else
    {
        document.getElementById("Player2").innerText = players.value.player1;
        document.getElementById("Player1").innerText = players.value.player2;
    }
});

hubConnection.on("SetSide", (side) => 
{
    PlayerSide = side;
});

hubConnection.on("UpdatePosition", function (fen) 
{
    var pos = 0;
    var sym = fen[pos];
    var x = 0, y = 7;
    for (i = 0; i < 8; i++)
    {
        for (j = 0; j < 8; j++)
        {
            Board[i][j] = null;
        }
    }
    
    while (sym != ' ' && pos < fen.length)
    {
        if (sym == '/')
        {
            x = 0;
            y --;
        }
        else if (!isNaN(sym))
        {
            x += Number(sym)
        }
        else
        {
            var side;
            var type;
            switch (sym)
            {
                case "P":
                    type = Figure.Pawn;
                    side = Side.White;
                    break;
                case "R":
                    type = Figure.Rook;
                    side = Side.White;
                    break;
                case "N":
                    type = Figure.Knight;
                    side = Side.White;
                    break;
                case "B":
                    type = Figure.Bishop;
                    side = Side.White;
                    break;
                case "Q":
                    type = Figure.Queen;
                    side = Side.White;
                    break;
                case "K":
                    type = Figure.King;
                    side = Side.White;
                    break;                        
                case "p":
                    type = Figure.Pawn;
                    side = Side.Black;
                    break;
                case "r":
                    type = Figure.Rook;
                    side = Side.Black;
                    break;
                case "n":
                    type = Figure.Knight;
                    side = Side.Black;
                    break;
                case "b":
                    type = Figure.Bishop;
                    side = Side.Black;
                    break;
                case "q":
                    type = Figure.Queen;
                    side = Side.Black;
                    break;
                case "k":
                    type = Figure.King;
                    side = Side.Black;
                    break;
                default:
                    break;
            }
            Board[x][y] = { type: type, side: side };    
            x++;
        }
        pos++;
        sym = fen[pos];
    }
});

hubConnection.on("SelectMoveCells", function(Cells)
{
    if (PlayerSide == "White")
    {
        for (i = 0; i < Cells.value.length; i++)
        {
            Cells.value[i] = 63 - Cells.value[i];
        }
    }
    if (Cells.value.length == 0)
    {
        var sel = Array(1);
        sel[0] = LastClick.X + LastClick.Y * 8;
        SelectCells(sel);
        return;
    }
    PossibleMoves = Cells.value;
    SelectCells(Cells.value);
});

function Click(x, y)
{
    if (SelectedCellsArray[x][y] != null)
    {
        SelectCells(new Array(0));
        var pos = x + y*8;
        if (PossibleMoves.includes(pos))
        {
            if (PlayerSide == "White")
            {
                Move(7 - LastClick.X, 7 - LastClick.Y, 7 - x, 7 - y);
            }
            else
            {
                Move(LastClick.X, LastClick.Y, x, y);
            }
        }
        PossibleMoves = Array(0);
    }
    else
    {
        
        if (IsNullCell(x, y))
        {
            let a = new Array(1);
            
            a[0] = x + 8 * y;
            PossibleMoves = Array(0);
            SelectCells(a);
        }
        else
        {
            let cell
            if (PlayerSide == "Black")
            {
                cell = String(y * 8 + x)
            }
            else
            {
                cell = String((7 - y) * 8 + (7 - x))
            }
            PossibleMoves = Array(0);
            hubConnection.invoke("GetPossibleMovesFrom", cell);
            LastClick = {X : x, Y : y};
            firstClick = false;
        }
    }
}

function SelectCells(Cells)
{
    for (i = 0; i < 8; i++)
    {
        for (j = 0; j < 8; j++)
        {
            SelectedCellsArray[i][j] = null;
        }
    }

    if (Cells.length > 0)
    {
        HasSelectedCells = true;
    }
    else
    {
        HasSelectedCells = false;
    }
    
    Cells.forEach(element => 
    {
        var Y = Math.floor(element / 8);
        var X = element % 8;
        SelectedCellsArray[X][Y] = 1;
    });
    
}

function UpdateScreen()
{
    context.clearRect(0, 0, canva.width, canva.height);
    Resize();
    clear();
    if (PlayerSide == "White")
    {
        context.drawImage(deskWhiteImg, 0, 0, canva.width, canva.height);
    }
    else
    {
        context.drawImage(deskBlackImg, 0, 0, canva.width, canva.height);
    }
    for (i = 0; i < 8; i++)
        for (j = 0; j < 8; j++)
        {
            if (SelectedCellsArray[i][j] != null)
            {
                context.drawImage(SelectedCell, zeroX + i * SizeCell, zeroY + j * SizeCell, SizeCell, SizeCell);
            }
            if (Board[i][j] != null)
            {
                let img = null;
                if (Board[i][j].side === Side.White)
                    switch (Board[i][j].type)
                    {
                        case Figure.Pawn:
                            img = whitePawnImg;
                            break;
                        case Figure.Rook:
                            img = whiteRookImg;
                            break;
                        case Figure.King:
                            img = whiteKingImg;
                            break;
                        case Figure.Bishop:
                            img = whiteBishopImg;
                            break;
                        case Figure.Queen:
                            img = whiteQueenImg;
                            break;
                        case Figure.Knight:
                            img = whiteKnightImg;
                            break;
                        default:
                            break;
                    }
                else if (Board[i][j].side === Side.Black)
                    switch (Board[i][j].type)
                    {
                        case Figure.Pawn:
                            img = blackPawnImg;
                            break;
                        case Figure.Rook:
                            img = blackRookImg;
                            break;
                        case Figure.King:
                            img = blackKingImg;
                            break;
                        case Figure.Bishop:
                            img = blackBishopImg;
                            break;
                        case Figure.Queen:
                            img = blackQueenImg;
                            break;
                        case Figure.Knight:
                            img = blackKnightImg;
                            break;
                        default:
                            break;
                    }
                if (img != null)
                {
                    if (PlayerSide == "White")
                    {
                        context.drawImage(img, zeroX + (7 - i) * SizeCell, zeroY + (7 - j) * SizeCell, SizeCell, SizeCell);
                    }
                    else
                    {
                        context.drawImage(img, zeroX + i * SizeCell, zeroY + j * SizeCell, SizeCell, SizeCell);
                    }
                }
            }
        }
    
}

function Resize()
{
    var boards = document.getElementById('BoardDiv');
    var width = boards.clientWidth - 15;
    var height = boards.clientHeight - 15;
    if (width > height)
        sizeSide = height;
    else
        sizeSide = width;
    SizeCell = (sizeSide * 0.951) / 8;
    zeroX = sizeSide * 0.05;
    canva.width = sizeSide;
    canva.height = sizeSide;
}

function clear()
{
    context.fillStyle = `rgb(108, 74, 198)`;
    context.fillRect(0, 0, canva.width, canva.height)
}

function IsNullCell(x, y)
{
    if (PlayerSide == "White")
    {
        x = 7-x;
        y = 7-y;
    }
    if (Board[x][y] == null)
        return true;
    else
        return false;
}
