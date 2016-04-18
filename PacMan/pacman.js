function startGame ()
{
    MAP = DEFAULT_MAP.slice();
    gameArea.create();
    gameArea.init(MAP);     //???
    drawPacManColorOptions();
    interval = setInterval(updateGameArea, 20);
    timeCount = 0;
    scoreobj.startWorker();
    pause();        //???
    document.getElementById("gameCanvas").onclick = function(){pause()};
}

function restartGame ()
{
    MAP = DEFAULT_MAP.slice();
    window.alert(DEFAULT_MAP);
    gameArea.init(MAP);     //???
    timeCount = 0;
    document.getElementById("time").innerHTML = timeCount;
    document.getElementById("finalVideo").src = "";
    scoreobj.notify("reset");
    scoreobj.write();
    pause();        //???
    document.getElementById("gameCanvas").onclick = function(){pause()};
}

var fruitTimeOut;
var count;
var interval;
var timeCount=0;
var play = true;

var gameArea =
{
    map:[],
    blockSize: {},
    pauseImg: new Image(),

    init: function(initmap)
    {
        this.map = initmap;
        scenary.init(this.gameCanvas, this.gameContext, this.blockSize, initmap);
        pacMan.init(this.gameCanvas, this.gameContext, this.blockSize, initmap, 9, 12);

        this.redghost = new ghost("red_ghost.PNG", this.gameCanvas, this.gameContext, this.blockSize, initmap, 9, 4, 1, 0);

        this.blueghost = new ghost("blue_ghost.PNG", this.gameCanvas, this.gameContext, this.blockSize, initmap, 14, 11, 0, 1);

        window.addEventListener('keydown', function (e) {
            gameArea.key = e.keyCode;
        });
    },

    create: function ()
    {
        this.gameCanvas = document.getElementById("gameCanvas");
        this.gameCanvas.width = 342;
        this.gameCanvas.height = 550;
        this.gameContext = this.gameCanvas.getContext("2d");
        this.pauseImg.src = "playpause.png";
    },

    clear: function ()
    {
        this.gameContext.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    },

    pause: function()
    {
        x = 0;
        y = this.gameCanvas.height/2 - this.gameCanvas.width/2;
        this.gameContext.drawImage(this.pauseImg, x, y, this.gameCanvas.width, this.gameCanvas.width);
    },

    changeMap: function()
    {
        x = parseInt(pacMan.position.x);
        y = parseInt(pacMan.position.y);
        var item = this.map[y][x]
        switch (item)
        {
            case 1:
                scoreobj.notify("pill");
                this.map[y][x] = 2;
                pacMan.close = true;
                document.getElementById("coinsound").load();
                document.getElementById("coinsound").currentTime = 0,5;
                document.getElementById("coinsound").play();
                break;
            case 4:
                scoreobj.notify("bigpill");
                this.map[y][x] = 2;
                pacMan.close = true;
                document.getElementById("coinsound").load();
                document.getElementById("coinsound").currentTime = 0,5;
                document.getElementById("coinsound").play();
                break;
            case 5:
                scoreobj.notify("fruit");
                this.map[y][x] = 2;
                pacMan.close = true;
                if (fruitCount < MAXFRUITCOUNT)
                {
                    fruitTimeOut = setTimeout(generateFruit, 10*Math.random()*1000);
                }
                break;
            default:
                pacMan.close = false;
        }
    },

    gameLogic: function()
    {
        this.changeMap();
        if (((this.redghost.position.x == pacMan.position.x) && (this.redghost.position.y == pacMan.position.y))
             || ((this.blueghost.position.x == pacMan.position.x) && (this.blueghost.position.y == pacMan.position.y))
              || (timeCount >= MAXTIME))
        {
            pacMan.dead = true;
            pause();
            this.endGame();
        } else if (scenary.remainingPills == 0) {
            pause();
            this.winGame();
        }
    },

    endGame: function()
    {
        scoreobj.store(score);
        scoreobj.write();
        this.gameContext.font="30px Comic Sans MS";
        this.gameContext.fillStyle = "blue";
        this.gameContext.textAlign = "center";
        this.gameContext.fillText("You died!!", this.gameCanvas.width/2, this.gameCanvas.height/2);
        this.gameContext.fillText("Press to replay", this.gameCanvas.width/2, 3*this.gameCanvas.height/4);
        document.getElementById("finalVideo").src = "sadtrombone.mp4";
        document.getElementById("time").innerHTML = "Replay?";       //???
        document.getElementById("gameCanvas").onclick = function(){restartGame()};
    },

    winGame: function()
    {
        scoreobj.notify("finish");
        scoreobj.store(score);
        scoreobj.write();
        this.gameContext.font="30px Comic Sans MS";
        this.gameContext.fillStyle = "blue";
        this.gameContext.textAlign = "center";
        this.gameContext.fillText("You Won!!", this.gameCanvas.width/2, this.gameCanvas.height/2);
        this.gameContext.fillText("Press to replay", this.gameCanvas.width/2, 3*this.gameCanvas.height/4);
        document.getElementById("finalVideo").src = "slowclap.mp4";
        document.getElementById("time").innerHTML = "Replay?";       //???
        window.alert(document.getElementById("time").innerHTML);
        document.getElementById("gameCanvas").onclick = function(){restartGame()};
    },

    draw: function ()
    {
        /* Refresh every time, just in case it has changed */
        this.blockSize.width = this.gameCanvas.width / this.map[0].length;
        this.blockSize.height = this.gameCanvas.height / this.map.length;

        scenary.update(this.map, this.blockSize)
        scenary.draw();

        if (this.key && this.key == 65) {pacMan.nextDirection.x = -1; pacMan.nextDirection.y = 0;}
	    if (this.key && this.key == 68) {pacMan.nextDirection.x = 1; pacMan.nextDirection.y = 0;}
	    if (this.key && this.key == 87) {pacMan.nextDirection.x = 0; pacMan.nextDirection.y = -1;}
	    if (this.key && this.key == 83) {pacMan.nextDirection.x = 0; pacMan.nextDirection.y = 1;}
		
        pacMan.update(this.map, this.blockSize);
        pacMan.updatePos();
        pacMan.draw();

        this.blueghost.update(this.map, this.blockSize);
        this.blueghost.updatePos();
        this.blueghost.draw();

        this.redghost.update(this.map, this.blockSize);
        this.redghost.updatePos();
        this.redghost.draw();

        this.gameLogic();
    }
}

function updateGameArea()
{
    if (play){
        gameArea.clear();
        gameArea.draw();
        scoreobj.update();
    }
}

function pause()
{
    play = !play;
    if (play)
    {
        fruitTimeOut = setTimeout(generateFruit, 10*Math.random()*1000);
        count = setInterval(function(){timeCount += 1; scoreobj.notify("second"); document.getElementById("time").innerHTML = timeCount;}, 1000)
        document.getElementById("pacmanmusic").play();
    } else 
    {
        clearTimeout(fruitTimeOut);
        gameArea.pause();
        clearInterval(count);
        document.getElementById("pacmanmusic").pause();
    }
}

function generateFruit()
{
    gameArea.map[12][9] = 5;
    fruitCount = fruitCount + 1;
}

function drawPacManColorOptions()
{
    options = document.getElementsByClassName("pacManColorOption");
    for (i = 0; i < options.length; i++)
    {
        context = options[i].getContext("2d");
        options[i].width = 50;
        options[i].height = 50;
        x = options[i].width/2;
        y = options[i].height/2;
        size = 3*Math.min(options[i].width, options[i].height)/8
        rotation = Math.PI/4;
        context.fillStyle = options[i].id;
        context.beginPath();
        context.moveTo(x,y)
        context.arc(x, y, size, 0+rotation, 3*Math.PI/2+rotation);
        context.fill();
    }
}

var scenary =
{
    remainingPills: 0,

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
            case 1:                         //Pill
                this.drawBiscuit(x, y, false);
                this.remainingPills += 1;
                break;
            case 2:                         //Empty
                this.drawEmpty(x, y);
                break;
            case 3:                         //Block
                this.drawEmpty(x, y);
                break;
            case 4:                         //Big Pill
                this.drawBiscuit(x, y, true);
                this.remainingPills += 1;
                break;
            case 5:                         //Fruit
                this.drawFruit(x,y);
                break;
            default:
                throw "Not contempled number in Map";
        }
    },

    draw: function()
    {
        this.remainingPills = 0;
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
        this.speed = 3;
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

score = 0;
w = undefined;

var scoreobj = 
{
    reset: function()
    {
        score = 0;
    },

    update: function()
    {
        document.getElementById("score").innerHTML = score;
    },

    startWorker: function () {
        if(typeof(Worker) !== "undefined") {
            if(typeof(w) == "undefined") {
                w = new Worker("scoreworker.js");
            }
            w.onmessage = function(event) {
                score = event.data;
            };
        } else {
            document.getElementById("score").innerHTML = "Sorry, your browser does not support Web Workers...";
        }
    },

    stopWorker: function () { 
        w.terminate();
        w = undefined;
    },

    notify: function(id)
    {
        w.postMessage(id);
    },

    store: function(record)
    {
        if(typeof(Storage) !== "undefined") {
            if((localStorage.getItem("alltimerecord")<record)||localStorage.getItem("alltimerecord"==undefined)){
                localStorage.alltimerecord = record;
            }
            if((sessionStorage.getItem("sessionrecord")==undefined)||(sessionStorage.getItem("sessionrecord")<record))
            {
                sessionStorage.sessionrecord = record;
            }
        } else {
            window.alert("Your browser does not support session storage. Your records will not be saved")
        }
    },

    write: function()
    {
        if(typeof(Storage) !== "undefined") {
            if(localStorage.alltimerecord){
                document.getElementById("alltimerecord").innerHTML = localStorage.getItem("alltimerecord");
            } else {
                document.getElementById("alltimerecord").innerHTML = 0;
            }
            if(sessionStorage.sessionrecord){
                document.getElementById("sessionrecord").innerHTML = sessionStorage.getItem("sessionrecord");
            } else {
                document.getElementById("sessionrecord").innerHTML = 0;
            }
            
           document.getElementById("lastscore").innerHTML = score;
        }
    }
}

function ghost (file, canvas, context, blocksize, map, x , y, directionx, directiony) 
{
    this.direction = {};
    this.blockSize= {};
    this.positionoffset = {};
    this.position = {};

    this.image = new Image();
    this.image.src = file;
    this.canvas = canvas;
    this.context = context;
    this.blockSize = blocksize;
    this.map = map;
    this.direction.x = directionx;
    this.direction.y = directiony;
    this.positionoffset.x = 0;
    this.positionoffset.y = 0;
    this.position.x = x;
    this.position.y = y;
    this.speed = 3;

    this.update = function(map, blocksize = this.blockSize)
    {
        this.blockSize = blocksize;
        this.map = map;
    }
    
    this.nextBlock = function(dir){
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
	}
    
    this.changeBlock = function(){
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
    }
   
    this.updatePos = function()
    {
        if (this.direction.x)
        {
            if(this.nextBlock(this.direction) == false){
                if(this.direction.x * this.positionoffset.x > 0)
                {
                    this.direction.x = this.direction.x * (-1);
                }
            }
        } 
        else if (this.direction.y)
        {
            if(this.nextBlock(this.direction) == false){
                if(this.direction.y * this.positionoffset.y > 0)
                {
                    this.direction.y = this.direction.y * (-1);
                }
            }
        }

        this.positionoffset.x = parseInt(this.positionoffset.x) + parseInt(this.direction.x*this.speed);
        this.positionoffset.y = parseInt(this.positionoffset.y) + parseInt(this.direction.y*this.speed);

		this.changeBlock();
    }

    this.draw = function()
    {
        x = this.position.x * this.blockSize.width + this.positionoffset.x;
        y = this.position.y * this.blockSize.height + this.positionoffset.y;
        this.context.drawImage(this.image, x, y, this.blockSize.width, this.blockSize.height);
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    pacMan.color = data;
}

    WALL    = 0;
    BISCUIT = 1;
    EMPTY   = 2;
    BLOCK   = 3;
    PILL    = 4;
    FRUIT   = 5;

    MAXFRUITCOUNT = 4;
    MAXTIME = 60;
    fruitCount = 0;

    var MAP;

    DEFAULT_MAP = [
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