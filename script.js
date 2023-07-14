window.addEventListener("DOMContentLoaded", () => {
  const backgrounds = [
    "url('assets/ground_tile.png')",
    "url('assets/grass_day_tile.png')",
    "url('assets/grass_night_tile.png')",
  ];
  const canvas = document.getElementById("canvas1");
  const canvasContainer = document.getElementById("canvas-container");
  const ctx = canvas.getContext("2d");
  canvas.width = 750;
  canvas.height = 900;
  canvas.style.background = backgrounds[Math.floor(Math.random() * 3)];

  ctx.fillStyle = "white";
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.font = "40px Bangers";
  ctx.textAlign = "center";

  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5;
      this.collisionY = 200;
      this.hidden = false;
      this.collisionRadius = 30;
      this.speedX = 0;
      this.speedY = 0;
      this.spriteWidth = 255;
      this.spriteHeight = 256;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 100;
      //distance between player and mouse position;
      this.dx;
      this.dy;
      this.speedModifier = 10;
      this.image = document.getElementById("bull");
      this.frameX = 0;
      this.frameY = 0;
    }

    //-pd
    draw(context) {
        if(!this.hidden) {
      //set player image
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      if (this.game.debug) {
        //draw player collision area
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.stroke();
        context.restore();
        //creating a line which shows the direction of the player
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
      }

        }
    }

    //-pr
    restart() {
      this.collisionX = this.game.width * 0.5;
      this.collisionY = 50;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5;

      this.hidden = false; // Reset the hidden state when restarting
    }

    //-pu
    update() {
      const angle = Math.atan2(this.dy, this.dx);

      if (angle < -2.74 || angle > 2.74) {
        this.frameY = 6;
      } else if (angle < -1.97) {
        this.frameY = 7;
      } else if (angle < -1.17) {
        this.frameY = 0;
      } else if (angle < -0.39) {
        this.frameY = 1;
      } else if (angle < 0.39) {
        this.frameY = 2;
      } else if (angle < 1.17) {
        this.frameY = 3;
      } else if (angle < 1.96) {
        this.frameY = 4;
      } else if (angle < 2.74) {
        this.frameY = 5;
      }

      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;

      const distance = Math.hypot(this.dx, this.dy);
      //   maintain consistent speed regardless of the distance.
      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }

      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;

      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 100;

      //horizental boundarie
      if (this.collisionX < this.collisionRadius) {
        this.collisionX = this.collisionRadius;
      } else if (this.collisionX > this.game.width - this.collisionRadius) {
        this.collisionX = this.game.width - this.collisionRadius;
      }

      //vertical boundaries
      if (this.collisionY < this.collisionRadius) {
        this.collisionY = this.collisionRadius;
      } else if (this.collisionY > this.game.height - this.collisionRadius) {
        this.collisionY = this.game.height - this.collisionRadius;
      }

    //   collide with enemie
    this.game.enemies.forEach((enemy) => {
    const collisionInfo = this.game.checkCollision(this, enemy);
    if (collisionInfo[0] && !this.game.gameOver) {
        for (let i = 0; i < 3; i++) {
        this.game.particles.push(
            new Spark(this.game, this.collisionX, this.collisionY, "red")
        );
        }
        this.hidden = true; // Hide the player
        this.game.gameOver = true;
    }
    });
      
    }
  }
  //-en
  class Enemy {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 30;
      this.collisionX = this.game.width;
      this.collisionY = this.game.height * 0.5;
      this.speedX = Math.random() * 3 + 1;
      this.image = document.getElementById("bark");
      this.spriteWidth = 1000;
      this.spriteHeight = 1530;
      this.width = this.spriteWidth * 0.2;
      this.height = this.spriteHeight * 0.2;
      this.spriteX;
      this.spriteY;
    }

    //-end
    draw(context) {
      context.drawImage(
        this.image,
        0,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }
    // -enu
    update() {
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height + 40;
      this.collisionX -= this.speedX;

      if (this.spriteX + this.width < 0 && !this.game.gameOver) {
        // Reposition the enemy to start where it began
        this.collisionX =
          this.game.width + this.width + Math.random() * this.game.width * 0.5;
        this.collisionY = 200 + Math.random() * (this.game.height - 200);
      }
    }
  }
  //-lv
  class Larva {
    constructor(game) {
      this.game = game;
      this.collisionRadius = 30;
      this.collisionX = Math.floor(Math.random() * this.game.width);
      this.collisionY = this.game.height;
      this.image = document.getElementById("larva");
      this.spriteWidth = 150;
      this.spriteHeight = 150;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteX;
      this.speedY = 2 + Math.random();
      this.frameX = 0;
      this.frameY = Math.floor(Math.random() * 2);
    }

    // -ld
    draw(context) {
      context.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.spriteX,
        this.spriteY,
        this.width,
        this.height
      );
      if (this.game.debug) {
        context.beginPath();
        context.arc(
          this.collisionX,
          this.collisionY,
          this.collisionRadius,
          0,
          Math.PI * 2
        );
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.stroke();
        context.restore();
      }
    }
    // -lu
    update() {
      this.collisionY -= this.speedY;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.width * 0.5 - 40;

      //move to castle;
      if (this.collisionY < 100 && !this.game.gameOver) {
        this.game.armor--;

        for (let i = 0; i < 3; i++) {
          this.game.particles.push(
            new Spark(this.game, this.collisionX, this.collisionY, "iceblue")
          );
        }

        this.collisionX = Math.floor(Math.random() * this.game.width);
        this.collisionY = this.game.height + this.height * Math.random() + 200;
      }
      //horizental boundarie
      if (this.collisionX < this.collisionRadius) {
        this.collisionX = this.collisionRadius + 100;
      } else if (this.collisionX > this.game.width - this.collisionRadius) {
        this.collisionX = this.game.width - (this.collisionRadius + 100);
      }

      // collision with player
      if (
        this.game.checkCollision(this, this.game.Player)[0] &&
        !this.game.gameOver
      ) {
        this.game.score++;

        for (let i = 0; i < 3; i++) {
          this.game.particles.push(
            new Spark(this.game, this.collisionX, this.collisionY, "yellow")
          );
        }

        this.collisionX = Math.floor(Math.random() * this.game.width);
        this.collisionY = this.game.height + this.height * Math.random() + 200;
      }
    }
  }

  //-part
  class Particle {
    constructor(game, x, y, color) {
      this.game = game;
      this.collisionX = x;
      this.collisionY = y;
      this.color = color;
      this.radius = Math.floor(Math.random() * 10 + 5);
      this.speedX = Math.random() * 6 - 3;
      this.speedY = Math.random() * 2 - 0.5;
      this.angle = 0;
      this.va = Math.random() * 0.1 + 0.01;
      this.markedForDeletion = false;
    }

    draw(context) {
      context.save();
      context.fillStyle = this.color;
      context.beginPath();
      context.arc(
        this.collisionX,
        this.collisionY,
        this.radius,
        0,
        Math.PI * 2
      );
      context.fill();
      context.stroke();
      context.restore();
    }
  }

  //-spark
  class Spark extends Particle {
    update() {
      this.angle += this.va * 0.5;
      this.collisionX -= Math.sin(this.angle) * this.speedX;
      this.collisionY -= Math.cos(this.angle) * this.speedY;
      if (this.radius > 0.1) this.radius -= 0.05;
      if (this.radius < 0.2) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
      }
    }
  }

  //-game
  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.Player = new Player(this);
      this.maxhatchlings = 7;
      this.hatchlings = [];
      this.particles = [];
      this.gameObjects = [];
      this.enemies = [];
      this.score = 0;
      this.armor = 10;
      this.enu = 0;
      this.defence = 20;
      this.lostDefence = 0;
      this.larvaTimer = 0;
      this.winningScore = 100;
      this.larvaInterval = 3000;
      this.gameOver = false;
      //fps
      this.fps = 65;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      //---
      this.debug = false;
      //mouse coordinates
      this.mouse = {
        x: this.width * 0.5,
        y: 200,
        pressed: false,
      };

      //listeners
      canvas.addEventListener("mousedown", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.pressed = true;
      });
      canvas.addEventListener("mouseup", (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.pressed = false;
      });

      canvas.addEventListener("mousemove", (e) => {
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });

      window.addEventListener("keydown", (e) => {
        if (e.key == "d") this.debug = !this.debug;
        if (e.key == "r") this.restart();
      });
    }
    //-gs
    restart() {
      this.Player.restart();
      this.hatchlings = [];
      this.enemies = []
      this.mouse = {
        x: this.width * 0.5,
        y: 200,
        pressed: false,
      };
      this.score = 0;
      this.armor = 10;
      this.gameOver = false;

      this.canvas.style.background = backgrounds[Math.floor(Math.random() * 3)];

    }

    // -gc
    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const distance = Math.hypot(dx, dy);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;
      return distance < sumOfRadii;
    }

    checkLarvaCollision() {
      for (let i = 0; i < this.hatchlings.length; i++) {
        for (let j = i + 1; j < this.hatchlings.length; j++) {
          const larvaA = this.hatchlings[i];
          const larvaB = this.hatchlings[j];
          const collision = this.checkCollision(larvaA, larvaB);

          if (collision[0]) {
            const dx = collision[3];
            const dy = collision[4];

            const angle = Math.atan2(dy, dx);

            // Calculate the push force
            const pushForce = 1;

            const pushX = Math.cos(angle) * pushForce;
            const pushY = Math.sin(angle) * pushForce;

            // Apply the push force to both larvae
            larvaA.collisionX += pushX;
            larvaA.collisionY += pushY;
            larvaB.collisionX -= pushX;
            larvaB.collisionY -= pushY;
          }
        }
      }
    }

    callGameOverText(context, message1, message2) {
      this.gameOver = true;
      context.save();
      context.fillStyle = "rgba(0 , 0 , 0 , 0.5)";
      context.fillRect(0, 0, this.width, this.height);
      context.fillStyle = "white";
      context.textAlign = "center";
      context.shadowOffsetX = 10;
      context.shadowOffsetY = 10;
      context.shadowColor = "black";
      context.font = "130px Bangers";
      context.fillText(message1, this.width * 0.5, this.height * 0.5 - 20);
      context.font = "40px Bangers";
      context.fillText(message2, this.width * 0.5, this.height * 0.5 + 80);
      context.fillText(
        "final score " + this.score + ". Press 'R' to bull heads again!",
        this.width * 0.5,
        this.height * 0.5 + 200
      );
      context.restore();
    }

    //-gr
    render(context, deltaTime) {
      //fps maintaining
      if (this.timer > this.interval) {
        //animate next frame;
        context.clearRect(0, 0, this.width, this.height);
        //create objects
        this.gameObjects = [
          this.Player,
          ...this.hatchlings,
          ...this.particles,
          ...this.enemies,
        ];
        //sort objects based on collisionY
        this.gameObjects.sort((a, b) => {
          return a.collisionY - b.collisionY;
        });

        //check larva collision
        this.checkLarvaCollision();

        //draw objects
        this.gameObjects.forEach((object) => {
          object.draw(context);
          object.update();
        });

        this.removeGameObjects();

        this.timer = 0;
      }
      this.timer += deltaTime;

      //draw status text
      context.save();
      context.textAlign = "left";
      context.fillText("Score: " + this.score, 25, 40);
      context.fillText("Armor: " + this.armor, 25, 80);
      context.restore();

      //winning score Message
      if (this.score >= this.winningScore) {
        this.callGameOverText(context, "BullEye!!!", "You bullied The bullies");
      }

      //losing score message.
      if (this.armor <= 0 || this.Player.hidden) {
        this.callGameOverText(
          context,
          "Bulloks :(",
          "You let them scrap again."
        );
      }
      //add larva periodically
      if (
        this.larvaTimer > this.larvaInterval &&
        this.hatchlings.length < this.maxhatchlings &&
        !this.gameOver
      ) {
        this.addHatchlings(); // Spawn a new larva
        this.larvaTimer = 0; // Reset the timer
      } else {
        this.larvaTimer += deltaTime; // Increment the timer
      }

      //add enemies to the game;
      if (this.score > 0) {
        if (this.enemies.length === 0 && !this.gameOver) {
          this.addEnemies();
          console.log(this.enemies.length);
        }
      }
    }

    addHatchlings() {
      this.hatchlings.push(new Larva(this));
    }

    addEnemies() {
      this.enemies.push(new Enemy(this));
    }

    removeGameObjects() {
      this.particles = this.particles.filter(
        (object) => !object.markedForDeletion
      );
      this.hatchlings = this.hatchlings.filter(
        (object) => !object.markedForDeletion
      );
    }

    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const distance = Math.hypot(dy, dx);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;
      return [distance < sumOfRadii, distance, sumOfRadii, dx, dy];
    }

    //-gi
    init() {}
  }

  //-config
  const game = new Game(canvas);
  game.init();
  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // render game;
    game.render(ctx, deltaTime);
    //request next frame;
    requestAnimationFrame(animate);
  }

  animate(0);
});
