function startGame ()
{
    gameArea.create();
    gameArea.init(MAP);
    var interval = setInterval(updateGameArea, 20);
}

var gameArea =
{
    map:[],
    blockSize: {},

    init: function(map)
    {
        this.map = map;
        scenary.init(this.gameCanvas, this.gameContext, this.blockSize, map);
        pacMan.init(this.gameCanvas, this.gameContext, this.blockSize, map, 9, 12);
        window.addEventListener('keydown', function (e) {
            gameArea.key = e.keyCode;
        });
    },

    create: function ()
    {
        this.gameCanvas = document.createElement("canvas");
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

    changeMap: function()
    {
        x = parseInt(pacMan.position.x);
        y = parseInt(pacMan.position.y);
        var item = this.map[y][x]
        switch (item)
        {
            case 1:
            case 4:
            case 5:
                this.map[y][x] = 2;
                pacMan.close = true;
                break;
            default:
                pacMan.close = false;
        }
    },

    draw: function ()
    {
        /* Refresh every time, just in case it has changed */
        this.blockSize.width = this.gameCanvas.width / this.map[0].length;
        this.blockSize.height = this.gameCanvas.height / this.map.length;

        scenary.update(this.map, this.blockSize)
        scenary.draw();
        
		if (this.key && this.key == 37) {pacMan.nextDirection.x = -1; pacMan.nextDirection.y = 0;}
		if (this.key && this.key == 39) {pacMan.nextDirection.x = 1; pacMan.nextDirection.y = 0;}
		if (this.key && this.key == 38) {pacMan.nextDirection.x = 0; pacMan.nextDirection.y = -1;}
		if (this.key && this.key == 40) {pacMan.nextDirection.x = 0; pacMan.nextDirection.y = 1;}
		
        pacMan.update(this.map, this.blockSize);
        pacMan.updatePos();
        pacMan.draw();

        this.changeMap();

    }
}

function updateGameArea()
{
    gameArea.clear();
    gameArea.draw();
}

var scenary =
{
    init: function(canvas, context, blocksize, map)
    {
        this.canvas = canvas;
        this.context = context;
        this.blockSize = blocksize;
        this.map = map;
        this.cherry = new Image();
        this.cherry.src = "cherrys.PNG";
    },

    update: function(map, blocksize = this.blockSize)
    {
        this.blockSize = blocksize;
        this.map = map;
    },

    drawRect: function (x, y, color, offsetx = 0, offsety = 0, width = this.blockSize.width, height = this.blockSize.height )
    {
        this.context.fillStyle = color;
        x = x * this.blockSize.width + offsetx;
        y = y * this.blockSize.height + offsety;
        this.context.fillRect(x, y, width, height);
    },

    drawCircle: function (x, y, color, big)
    {
        y = parseInt(y);
        x = parseInt(x);
        this.context.fillStyle = color;
        x = x * this.blockSize.width + this.blockSize.width/2;
        y = y * this.blockSize.height + this.blockSize.height/2;
        var size = Math.min(this.blockSize.width,this.blockSize.height)/6;
        if (big){size = 2*size};
        this.context.beginPath();
        this.context.arc(x, y, size, 0, 2*Math.PI);
        this.context.fill();
    },

    isNotBorder: function (x,y) {
        var ans = 0 <= y && y < this.map.length;
        ans = ans && 0 <= x && x < this.map[0].length;
        return ans;
    },

    drawWall: function (x, y) {
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
        this.drawCircle(x,y,"lightyellow",big);
    },

    drawEmpty: function (x, y) { this.drawRect(x, y, "black") },
    drawFruit: function (x, y) 
    {
        x = x * this.blockSize.width;
        y = y * this.blockSize.height;
        this.context.drawImage(this.cherry, x, y, this.blockSize.width, this.blockSize.height);
    },

    drawItem: function (item, x, y)
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
                this.drawEmpty(x, y);
                break;
            case 3:                         //Block
                this.drawEmpty(x, y);
                break;
            case 4:                         //Fruit
                this.drawBiscuit(x, y, true);
                break;
            case 5:
                this.drawFruit(x,y);
                break;
            default:
                throw "Not contempled number in Map";
        }
    },

    draw: function()
    {
        var line;
        for (var y in this.map)
        {
            var line = this.map[y];
            for (var x in line)
            {
                var item = line[x];
                this.drawItem(item, x, y);
            }
        }
    }
}

var pacMan =
{
    position: {},
    positionoffset: {x:0, y:0},
    close: false,
    color: "yellow",
    rotation: Math.PI/4,
    direction: {x:0, y:0},
    nextDirection: {x:0, y:0},
    speed: 3,

    init: function(canvas, context, blocksize, map, x , y)
    {
        this.canvas = canvas;
        this.context = context;
        this.blockSize = blocksize;
        this.map = map;
        this.direction.x = 0;
        this.direction.y = 0;
        this.nextDirection.x = 0;
        this.nextDirection.y = 0;
        this.positionoffset.x = 0;
        this.positionoffset.y = 0;
        this.position.x = x;
        this.position.y = y;
        this.speed = 5;
    },

    update: function(map, blocksize = this.blockSize)
    {
        this.blockSize = blocksize;
        this.map = map;
    },
    
    nextBlock: function(dir){
		x = parseInt(this.position.x) + parseInt(dir.x);
		y = parseInt(this.position.y) + parseInt(dir.y);
		var next = false;
		if (scenary.isNotBorder(x, y)){
			switch (this.map[y][x])
			{
				case 1:                         //Biscuit
				case 2:                         //Empty
				case 4:                         //Pill
				case 5:							//Fruit
					next = true;
					break;
				default:
					next = false;
			}
		}
		return next;
	},
    
    changeBlock: function(){
        maxOffsetX = this.blockSize.width/2;
        maxOffsetY = this.blockSize.height/2;
		
        if(this.positionoffset.x > maxOffsetX){
			this.position.x += 1;
			this.positionoffset.x = 0-maxOffsetX;
		}
        if(this.positionoffset.x < 0-maxOffsetX){
			this.position.x -= 1;
			this.positionoffset.x = maxOffsetX;
		}
        if(this.positionoffset.y > maxOffsetY){
			this.position.y += 1;
			this.positionoffset.y = 0-maxOffsetY;
		}
        if(this.positionoffset.y < 0-maxOffsetY){
			this.position.y -= 1;
			this.positionoffset.y = maxOffsetY;
		}
    },
    
    updateRotation: function()
    {
        if(this.direction.x == 1){this.rotation = Math.PI/4}
		else if(this.direction.x == -1){this.rotation = 5*Math.PI/4}
		else if(this.direction.y == 1){this.rotation = 3*Math.PI/4}
		else if(this.direction.y == -1){this.rotation = 7*Math.PI/4}
	},

    analyzeMovement: function()
    {
        if (this.direction.x != 0)          // X axe direction
        {
            if ((this.nextDirection.x == this.direction.x) && (this.nextDirection.y == this.direction.y)) 
            {
                if(this.nextBlock(this.direction) == false)
                {
                    if(this.positionoffset.x == 0)
                    {
                        this.direction.x = 0;
                    } else if ((this.direction.x*this.positionoffset.x) > 0) 
                    {
                        this.positionoffset.x = 0;
                        this.direction.x = 0;
                    }

                }
            } else if ((this.nextDirection.x != this.direction.x) && this.nextDirection.y == this.direction.y) 
            {
                this.direction.x = this.nextDirection.x;
            } else 
            {
                if (this.nextBlock(this.nextDirection))
                {
                    if(this.positionoffset.x == 0)
                    {
                        this.direction.x = this.nextDirection.x;
                        this.direction.y = this.nextDirection.y;
                    } else if ((this.direction.x*this.positionoffset.x) > 0) 
                    {
                        this.positionoffset.x = 0;
                        this.direction.x = this.nextDirection.x;
                        this.direction.y = this.nextDirection.y;
                    }
                }
            }
        } else if (this.direction.y != 0)       //Y axe direction
        {
            if ((this.nextDirection.y == this.direction.y) && (this.nextDirection.x == this.direction.x)) 
            {
                if(this.nextBlock(this.direction) == false)
                {
                    if(this.positionoffset.y == 0)
                    {
                        this.positionoffset.y = 0;
                        this.direction.y = 0;
                    } else if ((this.direction.y * this.positionoffset.y) > 0) 
                    {
                        this.positionoffset.y = 0;
                        this.direction.y = 0;
                    }
                }
            } else if ((this.nextDirection.y != this.direction.y) && this.nextDirection.x == this.direction.x) 
            {
                this.direction.y = this.nextDirection.y;
            } else 
            {
                if (this.nextBlock(this.nextDirection))
                {
                    if(this.positionoffset.y == 0)
                    {
                        this.direction.x = this.nextDirection.x;
                        this.direction.y = this.nextDirection.y;
                    } else if ((this.direction.y * this.positionoffset.y) > 0) 
                    {
                        this.positionoffset.y = 0;
                        this.direction.x = this.nextDirection.x;
                        this.direction.y = this.nextDirection.y;
                    }
                }
            } 
        } else if ((this.nextDirection.x != 0) || (this.nextDirection.y != 0))
        {
            this.direction.x = this.nextDirection.x;
            this.direction.y = this.nextDirection.y;
            this.analyzeMovement();
        }
    },
   
    updatePos: function()
    {
        this.analyzeMovement();
		
		this.updateRotation();
		
        this.positionoffset.x = this.positionoffset.x + this.direction.x*this.speed;
        this.positionoffset.y = this.positionoffset.y + this.direction.y*this.speed;

		this.changeBlock();
    },

    draw: function()
    {
        y = parseInt(pacMan.y);
        x = parseInt(pacMan.x);
        this.context.fillStyle = pacMan.color;
        x = this.position.x * this.blockSize.width + this.blockSize.width/2 + this.positionoffset.x;
        y = this.position.y * this.blockSize.height + this.blockSize.height/2 + this.positionoffset.y;
        var size = Math.min(this.blockSize.width,this.blockSize.height)/2;
        this.context.beginPath();
        if (pacMan.close)
        {
            this.context.arc(x, y, size, 0, 2*Math.PI);
        } else {
            this.context.moveTo(x,y)
            this.context.arc(x, y, size, 0+this.rotation, 3*Math.PI/2+this.rotation);
        }
        this.context.fill();
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
