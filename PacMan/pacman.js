function startGame ()
{
    gameArea.create();
}

var gameArea = 
{
    gameCanvas: document.createElement("canvas"),
    create: function()
    {
        this.gameCanvas.id = "gameCanvas"
        this.context = this.gameCanvas.getContext("2d");
        document.body.insertBefore(this.gameCanvas, document.body.childNodes[0]);
    }
}