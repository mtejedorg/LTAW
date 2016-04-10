function startGame ()
{
    gameArea.create();
    gameArea.map = MAP;
    gameArea.drawScenary();
}

var gameArea =
{
    gameCanvas: document.createElement("canvas"),
    blockSize: {},     //x, y
    map: [],
    create: function ()
    {
        this.gameCanvas.id = "gameCanvas";
        this.gameCanvas.width = 342;
        this.gameCanvas.height = 550;
        this.gameContext = this.gameCanvas.getContext("2d");
        document.body.insertBefore(this.gameCanvas, document.body.childNodes[0]);
    },

    clear: function ()
    {
        this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    },

    drawRect: function (x, y, color, offsetx = 0, offsety = 0, width = this.blockSize.width, height = this.blockSize.height )
    {
        this.gameContext.fillStyle = color;
        x = x * this.blockSize.width + offsetx;
        y = y * this.blockSize.height + offsety;
        this.gameContext.fillRect(x, y, width, height);
    },

    drawCircle: function (x, y, color, big)
    {
        y = parseInt(y);
        x = parseInt(x);
        this.gameContext.fillStyle = color;
        x = x * this.blockSize.width + this.blockSize.width/2;
        y = y * this.blockSize.height + this.blockSize.height/2;
        var size = Math.min(this.blockSize.width,this.blockSize.height)/6;
        if (big){size = 2*size};
        this.gameContext.beginPath();
        this.gameContext.arc(x, y, size, 0, 2*Math.PI);
        this.gameContext.fill();
    },

    isNotBorder: function (x,y)
    {
        var ans = 0<=y && y<this.map.length;
        ans = ans && 0<=x && x<this.map[0].length;
        return ans;
    },

    drawWall: function (x, y)
    {
        x3 = this.blockSize.width / 3;
        y3 = this.blockSize.height / 3;
        y = parseInt(y);
        x = parseInt(x);

        this.drawRect(x, y, "black");                   //For the diagonals and background, which are always black
        this.drawRect(x, y, "blue", x3, y3, x3, y3);    //For the center, which is always blue

        posup = posleft = posright = posdown = null;

        if(this.isNotBorder(x, y-1)){posup = this.map[y - 1][x]};
        if(this.isNotBorder(x-1, y)){posleft = this.map[y][x - 1]};
        if(this.isNotBorder(x+1, y)){posright = this.map[y][x + 1]};
        if(this.isNotBorder(x, y+1)){posdown = this.map[y + 1][x]};


        if (posup == 0){
            this.drawRect(x, y, "blue", x3, 0, x3, y3);
        }
        if (posleft == 0){
            this.drawRect(x, y, "blue", 0, y3, x3, y3);
        }
        if (posright == 0){
            this.drawRect(x, y, "blue", 2*x3, y3, x3, y3);
        }
        if (posdown == 0){
            this.drawRect(x, y, "blue", x3, 2*y3, x3, y3);
        }
    },

    drawBiscuit: function (x, y, big) {
        this.drawEmpty(x, y);   //First, we draw an empty background;
        this.drawCircle(x,y,"yellow",big);
    },

    drawEmpty: function (x, y) { this.drawRect(x, y, "black") },
    drawBlock: function (x, y) { this.drawWall(x, y) },
    drawFruit: function (x, y) { this.drawRect(x, y, "red") },

    draw: function (item, x, y)
    {
        switch (item)
        {
            case 0:                         //Wall
                this.drawWall(x, y);
                break;
            case 1:                         //Biscuit
                this.drawBiscuit(x, y, false);
                break;
            case 2:                         //Empty
                //this.drawEmpty(x, y);
                break;
            case 3:                         //Block
                //this.drawBlock(x, y);
                break;
            case 4:                         //Fruit
                this.drawBiscuit(x, y, true);
                break;
            case 5:
                //sthis.drawFruit(x,y);
                break;
            default:
                throw "Not contempled number in Map";
        }
    },

    drawScenary: function ()
    {
        this.clear();
        /* Refresh every time, just in case it has changed */
        this.blockSize.width = this.gameCanvas.width / this.map[0].length;
        this.blockSize.height = this.gameCanvas.height / this.map.length;

        var line;
        for (var y in this.map)
        {
            var line = this.map[y];
            for (var x in line)
            {
                var item = line[x];
                this.draw(item, x, y);
            }
        }
    }
}

    WALL    = 0;
    BISCUIT = 1;
    EMPTY   = 2;
    BLOCK   = 3;
    PILL    = 4;
    FRUIT   = 5;

    MAP = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 4, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 4, 0],
	[0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
	[0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
	[2, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, 2, 2],
	[0, 0, 0, 0, 1, 0, 1, 0, 0, 3, 0, 0, 1, 0, 1, 0, 0, 0, 0],
	[2, 2, 2, 2, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 2, 2, 2, 2],
	[0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
	[2, 2, 2, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 2, 2, 2],
	[0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
	[0, 4, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 4, 0],
	[0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
	[0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
	[0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];