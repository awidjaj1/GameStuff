window.addEventListener('load', function(){
    /**@type {HTMLCanvasElement}*/
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 500;
    canvas.height = 800;

    class Game {
        constructor(ctx, width, height){
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            this.enemyTypes = ['worm', 'ghost', 'spider'];
        }
        update(deltaTime){

            this.enemyTimer += deltaTime;
            while(this.enemyTimer > this.enemyInterval){
                this.#addNewEnemy();
                this.enemyTimer -= this.enemyInterval;
            }

            this.enemies = this.enemies.filter(o => !o.markedForDeletion);
            this.enemies.forEach(o => o.update(deltaTime));

        }
        draw(){
            this.enemies.forEach(o => o.draw(this.ctx));
        }
        #addNewEnemy(){
            console.log(this.enemies);
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            if(randomEnemy === 'worm') this.enemies.push(new Worm(this.width, this.height));
            else if(randomEnemy === 'ghost') this.enemies.push(new Ghost(this.width, this.height));
            else if(randomEnemy === 'spider') this.enemies.push(new Spider(this.width, this.height));
            // this.enemies.sort(function(a,b){
            //     return a.y - b.y;
            // });
        }
    }
    
    class Enemy{
        constructor(gameWidth, gameHeight){
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.x = this.gameWidth;
            this.y = Math.random() * this.gameHeight;
            this.width = 100;
            this.height = 100;
            this.markedForDeletion = false;
            // this.moveTimer = 0;
            // this.moveInterval = 10;
            this.image = null;
            this.vx = 0.1;
            this.frameX;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimer = 0;
        }
        update(deltaTime){
            // this.moveTimer += deltaTime;
            // while(this.moveTimer > this.moveInterval){
            //     this.x-=this.vx;
            //     this.moveTimer -= this.moveInterval;
            // }

            this.x -= this.vx * deltaTime;
            this.frameTimer += deltaTime;

            if(this.x < 0 - this.width) this.markedForDeletion = true;
            while(this.frameTimer > this.frameInterval){
                if(this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
                this.frameTimer -= this.frameInterval;
            }

        }
        draw(ctx){

            if(this.image === null)
                ctx.fillRect(this.x, this.y, this.width, this.height);
            else
                ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
    }

    class Worm extends Enemy{
        constructor(gameWidth, gameHeight){
            super(gameWidth, gameHeight);
            this.image = worm;
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;
            this.vx = Math.random() * 0.1 + 0.1;
            this.y = this.gameHeight - this.height;

        }
    }

    class Ghost
     extends Enemy{
        constructor(gameWidth, gameHeight){
            super(gameWidth, gameHeight);
            this.image = ghost;
            this.spriteWidth = 261;
            this.spriteHeight = 209;
            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;
            this.vx = Math.random() * 0.2 + 0.1;
            this.y = Math.random() * this.gameHeight * 0.6;
            this.angle = 0;
            this.curve = Math.random() * 2.5;
        }

        update(deltaTime){
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle+=0.02;
        }

        draw(ctx){
            ctx.save();
            ctx.globalAlpha = 0.5;
            super.draw(ctx);
            ctx.restore();
        }
    }

    class Spider extends Enemy{
        constructor(gameWidth, gameHeight){
            super(gameWidth, gameHeight);
            this.image = spider;
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;
            this.vx = 0;
            this.y = 0 - this.height;
            this.vy = Math.random() * 0.1 + 0.1;
            this.x = Math.random() * (this.gameWidth - this.width);
            this.maxLength = Math.random() * this.gameHeight;
        }

        update(deltaTime){
            super.update(deltaTime);
            if(this.y < 0 - this.height * 2) this.markedForDeletion = true;
            if(this.y > this.maxLength) this.vy *= -1;
            this.y += this.vy * deltaTime;
        }

        draw(ctx){
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2,0);
            ctx.lineTo(this.x + this.width/2, this.y + 10);
            ctx.stroke();
            super.draw(ctx);
        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);
    let lastTime = 0;
    function animate(timeStamp){
        ctx.clearRect(0,0,canvas.width, canvas.height);
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.update(deltaTime);
        game.draw();
        // console.log(deltaTime);


        requestAnimationFrame(animate);
    }
    animate(0);
});