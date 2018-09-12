var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Vector

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

/* INSTANCE METHODS */

Vector.prototype = {
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},
	add: function(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}
		return this;
	},
	subtract: function(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		return this;
	},
	multiply: function(v) {
		if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}
		return this;
	},
	divide: function(v) {
		if (v instanceof Vector) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}
		return this;
	},
	equals: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y - this.y * v.x
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	normalize: function() {
		return this.divide(this.length());
	},
	min: function() {
		return Math.min(this.x, this.y);
	},
	max: function() {
		return Math.max(this.x, this.y);
	},
	toAngles: function() {
		return -Math.atan2(-this.y, this.x);
	},
	angleTo: function(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	},
	toArray: function(n) {
		return [this.x, this.y].slice(0, n || 2);
	},
	clone: function() {
		return new Vector(this.x, this.y);
	},
	set: function(x, y) {
		this.x = x; this.y = y;
		return this;
    },
    fixSpeed: function(s) {
        this.normalize();
        this.multiply(s);
        return;
    }
};

/* STATIC METHODS */
Vector.negative = function(v) {
	return new Vector(-v.x, -v.y);
};
Vector.add = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
	else return new Vector(a.x + v, a.y + v);
};
Vector.subtract = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
	else return new Vector(a.x - v, a.y - v);
};
Vector.multiply = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
	else return new Vector(a.x * v, a.y * v);
};
Vector.divide = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
	else return new Vector(a.x / v, a.y / v);
};
Vector.equals = function(a, b) {
	return a.x == b.x && a.y == b.y;
};
Vector.dot = function(a, b) {
	return a.x * b.x + a.y * b.y;
};
Vector.cross = function(a, b) {
	return a.x * b.y - a.y * b.x;
};


// player
var playerX = canvas.width / 2;
var playerY = canvas.height / 2;
var playerRadius = 50;
var playerSpeed = 5;

var upKeyDown = false;
var leftKeyDown = false;
var downKeyDown = false;
var rightKeyDown = false;

// monster
var monsters = [];
var monsterRadius = 50;
var spawnMonsters = true;
var monsterCount = 2;
var monsterSpeed = 2;
// var mouseX = playerX;

var frame = 0;

var playerUpdate = function()
{
    // playerMoving
    if(upKeyDown)
    {
        if(playerY <= playerRadius)
        {
            playerY = playerRadius;
        }
        else
        {
            playerY -= playerSpeed;
        }
    }
    if(leftKeyDown)
    {
        if(playerX <= playerRadius)
        {
            playerX = playerRadius;
        }
        else
        {
            playerX -= playerSpeed;
        }
    }
    if(downKeyDown)
    {
        if(playerY >= canvas.height - playerRadius)
        {
            playerY = canvas.height - playerRadius;
        }
        else
        {
            playerY += playerSpeed;
        }
    }
    if(rightKeyDown)
    {
        if(playerX >= canvas.width - playerRadius)
        {
            playerX = canvas.width - playerRadius;
        }
        else
        {
            playerX += playerSpeed;
        }
    }
    // playerX = mouseX - playerWidth / 2;
}

var playerTracking = function(num)
{
    let vX = playerX - monsters[num].x;
    let vY = playerY - monsters[num].y;
    
    monsters[num].velocity.set(vX, vY);
    monsters[num].velocity.fixSpeed(monsterSpeed);
    
    monsters[num].x += monsters[num].velocity.x;
    monsters[num].y += monsters[num].velocity.y;

}

var isMonsterColide = function(num)
{

    if(Math.sqrt(Math.pow(monsters[num].x - monsters[num+1].x, 2) + Math.pow(monsters[num].y - monsters[num+1].y, 2)) <= (monsterRadius * 2))
    {
        return true;
    }
}

var monsterUpdate = function()
{
    if(spawnMonsters)
    {
        for(let i = 0; i < monsterCount; i++)
        {
            monsters.push({x : 200 * i + 200, y : 5 * i + 200, isDie : false, velocity : new Vector(0,0), isCrash : false, Crashing : 0});
        }
        spawnMonsters = false;
    }
    for(let i = 0; i < monsterCount; i++)
    {
        playerTracking(i);
    }
    for(let i = 0; i < monsterCount - 1; i++)
    {
        if(isMonsterColide(i))
        {
            let tempVelo = monsters[i].velocity
            monsters[i].velocity = monsters[i+1].velocity;
            monsters[i+1].velocity = tempVelo;
        }
    }
}

var update = function()
{
    frame++;
    playerUpdate();
    monsterUpdate();
}

var playerRender = function()
{
    ctx.beginPath();
        ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2 ,true);
        ctx.fillStyle = "#ffc6b3"
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 6;
        ctx.stroke();
    ctx.closePath();
}
var monsterRender = function()
{
    for(let i = 0; i < monsterCount; i++)
    {
        if(!(monsters[i].isDie))
        {
            ctx.beginPath();
                ctx.arc(monsters[i].x, monsters[i].y, monsterRadius, 0, Math.PI * 2 ,true);
                ctx.fillStyle = "#ff0000"
                ctx.strokeStyle = "white";
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();
            ctx.closePath();
        }
    }
}

var render = function()
{
    playerRender();
    monsterRender();
}

var gameLoop = function()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    render();
}

var keyDownFunc = function(e)
{
    if(e.code == "KeyW")
    {
        upKeyDown = true;
    }
    if(e.code == "KeyA")
    {
        leftKeyDown = true;
    }
    if(e.code == "KeyS")
    {
        downKeyDown = true;
    }
    if(e.code == "KeyD")
    {
        rightKeyDown = true;
    }
}
var keyUpFunc = function(e)
{
    if(e.code == "KeyW")
    {
        upKeyDown = false;
    }
    if(e.code == "KeyA")
    {
        leftKeyDown = false;
    }
    if(e.code == "KeyS")
    {
        downKeyDown = false;
    }
    if(e.code == "KeyD")
    {
        rightKeyDown = false;
    }
}

// var mouseMoveFunc = function(e)
// {
//     mouseX = e.clientX - canvas.offsetLeft;
// }

document.addEventListener("keydown", keyDownFunc, false);
document.addEventListener("keyup", keyUpFunc, false);
// document.addEventListener("mousemove", mouseMoveFunc, false);

var gameId = setInterval(gameLoop, 10);