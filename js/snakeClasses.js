let canvas, c, scoreboard, s, snake, cherry;
let scale = 20;

class Cherry {
	constructor(context, pos) {
		this.x = pos.x;
		this.y = pos.y;
		this.c = context;
		this.size = scale;
	}

	show() {
		this.c.fillStyle = "pink";
		this.c.fillRect(this.x + 1, this.y + 1, this.size - 1, this.size - 1);
	}
}

function getRandomEmptyLocation() {
	let empty_space = false;
	let cols = Math.floor(canvas.width / scale);
	let rows = Math.floor(canvas.height / scale);
	let x, y;

	let count = 0;
	while (!empty_space && count < 1000) {
		x = Math.floor(Math.random() * cols) * scale;
		y = Math.floor(Math.random() * rows) * scale;

		if (x == snake.x && y == snake.y) {
			empty_space = false;
		} else {
			empty_space = true;
		}
		console.table(snake.body);
		for (let i = 0; i < snake.body.length; i++) {
			if (x == snake.body[i].x && y == snake.body[i].y) {
				empty_space = false;
				break;
			} else {
				empty_space = true;
			}
		}
		
		count++;

		if (count >= 1000) {
			console.log("count made it to 1000, something is wrong with the cherry generation");
		}
	}
	return {x: x, y: y};
}

class Snake {
	constructor(canvas_context, scoreboard_context) {
		this.body = [];
		this.body[0] = {x: 0, y: 0};
		this.xdir = 0;
		this.ydir = 0;
		this.c = canvas_context;
		this.s = scoreboard_context;
		this.score = 0;
		this.size = scale;
		this.head_colour = "green";
		this.colour = "purple";
	}

	reset() {
		this.body = [];
		this.body[0] = {x: 0, y: 0};
		this.xdir = 0;
		this.ydir = 0;
		this.score = 0;
		this.drawScore();
		// this.s.fillStyle = "red";
		// this.s.fillRect(0, scoreboard.height/2, scoreboard.width, 1);
	}

	update() {
		for (let i = this.body.length-1; i > 0; i--) {
			this.body[i].x = this.body[i-1].x;
			this.body[i].y = this.body[i-1].y;
		}
		this.body[0].x += this.xdir * this.size;
		this.body[0].y += this.ydir * this.size;

		if (this.death()) {
			alert("You died, bitch");
			this.reset();
		}
	}

	show() {
		for (let i = this.body.length-1; i > 0; i--) {
			this.c.fillStyle = this.colour;
			this.c.fillRect(this.body[i].x + 1, this.body[i].y + 1, this.size - 1, this.size - 1);
		}
		this.c.fillStyle = this.head_colour;
		this.c.fillRect(this.body[0].x + 1, this.body[0].y + 1, this.size - 1, this.size - 1);
	}

	drawScore() {
		clearScoreboard();
		this.s.fillStyle = "green";
		this.s.font = "30px Tahoma";
		this.s.fillText("Tail length: " + this.score, 30, 60);
	}

	grow(pos) {
		this.body.push({x: pos.x, y: pos.y});
	}

	eat(pos) {
		if (this.body[0].x == pos.x && this.body[0].y == pos.y) {
			this.grow(this.body[this.body.length-1]);
			this.score++;
			this.drawScore();
			return true;
		} else {
			return false;
		}
	}

	death() {
		if (this.body[0].x < 0 || this.body[0].x > canvas.width - this.size ||
			this.body[0].y < 0 || this.body[0].y > canvas.height - this.size) {
			return true;
		}
		for (let i = this.body.length-1; i > 0; i--) {
			if (this.body[i].x == this.body[0].x && this.body[i].y == this.body[0].y) {
				return true;
			}
		}
		return false;
	}

	setDirection(xdir, ydir) {
		if (this.xdir + xdir == 0 && this.ydir + ydir == 0) {
			return false; // do not allow snake to go directly back on itself
		}
		this.xdir = xdir;
		this.ydir = ydir;
	}

}

function controls() {
	document.addEventListener("keydown", function(){
		if (event.keyCode == 37) {
			snake.setDirection(-1, 0);
		} else if (event.keyCode == 38) {
			snake.setDirection(0, -1);
		} else if (event.keyCode == 39) {
			snake.setDirection(1, 0);
		} else if (event.keyCode == 40) {
			snake.setDirection(0, 1);
		} else if (event.keyCode == 32) {
			// snake.setDirection(0, 0);
			pause();
		}
	});
}

function clearCanvas() {
	c.clearRect(0, 0, canvas.width, canvas.height);
}

function clearScoreboard() {
	s.clearRect(0, 0, scoreboard.width, scoreboard.height);
}

function update() {
	snake.update();
	if (snake.eat(cherry)) {
		cherry = new Cherry(c, getRandomEmptyLocation());
	}
	snake.show();
	cherry.show();
}

let fps = 15;
let now, delta;
let then = Date.now();
let interval = 1000 / fps;
function game() {
	requestAnimationFrame(game);

	now = Date.now();
	delta = now - then;
	if (delta > interval) {
		then = now - (delta % interval);
		clearCanvas();
		update();
	}
}



$(document).ready(function() {
	canvas = document.getElementById("canvas");
	canvas.width = 600;
	canvas.height = 400;
	canvas.style = "background-color: black";
	c = canvas.getContext("2d");
	scoreboard = document.getElementById("scoreboard");
	scoreboard.width = 600;
	scoreboard.height = 100;
	scoreboard.style = "background-color: powderblue";
	s = scoreboard.getContext("2d");
	snake = new Snake(c, s);
	cherry = new Cherry(c, {x: 200, y: 200});
	controls();
	game();
});
