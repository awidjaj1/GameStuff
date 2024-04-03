/**@type {HTMLCanvasElement}*/
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**@type {HTMLCanvasElement}*/
const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;
// window.addEventListener('resize', (e)=>{
//     console.log(window.innerWidth);
//     console.log(canvas.width);
// });
let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0;
let gameOver = false;

ctx.font = '50px Impact';

let ravens = [];
class Raven {
    constructor(){
        this.spriteWidth = 271;
        this.spriteHeight = 194;
        this.sizeModifier = Math.random() * 0.6 + 0.4;
        this.width = this.spriteWidth * this.sizeModifier;
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = canvas.width;
        this.y = Math.random() * (canvas.height - this.height);
        this.directionX = Math.random() * 5 + 1;
        this.directionY = Math.random() * 5 - 2.5;
        this.markedForDeletion = false;
        this.image = new Image();
        this.image.src = "raven.png";
        this.frame = 0;
        this.maxFrame = 4;
        this.timeSinceFlap = 0;
        this.flapInterval = Math.random() * 50 + 50;
        this.randomColors = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
        this.color = 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1] + ',' + this.randomColors[2] + ')';

        this.timeSinceMove = 0;
        this.moveInterval = 10;
        this.hasTrail = this.directionX > 3.5;
    }

    update(deltatime){

        this.timeSinceMove += deltatime;
        while(this.timeSinceMove > this.moveInterval){
            if(this.y < 0 || this.y > canvas.height - this.height){
                this.directionY = this.directionY * -1;
            }
            this.x -= this.directionX; //can do multiplication to get rid of while loop here
            this.y += this.directionY;
            this.timeSinceMove -= this.moveInterval; //prevent time leak
        }

        if(this.x < 0 - this.width) {
            this.markedForDeletion = true;
            gameOver = true;
        }

        this.timeSinceFlap += deltatime;
        while(this.timeSinceFlap > this.flapInterval){
            if(this.frame > this.maxFrame) this.frame = 0;
            else this.frame++;
            this.timeSinceFlap -= this.flapInterval;
            if(this.hasTrail){
                for(let i = 0; i < 5; i++)
                    particles.push(new Particle(this.x, this.y, this.width, this.color));
            }
        }
    }

    draw(){
        collisionCtx.fillStyle = this.color;
        collisionCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image,this.frame * this.spriteWidth,0,this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }

}
let explosions = [];
class Explosion {
    constructor(x,y,size){
        this.image = new Image();
        this.image.src = 'boom.png';
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
        this.timeSinceLastFrame = 0;
        this.frameInterval = 100;
        this.markedForDeletion = false;
    }
    update(deltatime){
        if(this.frame === 0) this.sound.play();
        this.timeSinceLastFrame += deltatime;
        while(this.timeSinceLastFrame > this.frameInterval){
            this.frame++;
            if(this.frame > 5) this.markedForDeletion = true;
            this.timeSinceLastFrame -= this.frameInterval;
        }
    }
    draw(){
        ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y-this.size/4, this.size, this.size);
    }
}
let particles = [];
class Particle{
    constructor(x,y,size,color){
        this.size = size;
        this.x = x + this.size/2 + (Math.random() * 20 - 10);
        this.y = y + this.size/3 + (Math.random() * 20 - 10);
        this.radius = Math.random() * this.size/10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 1 + 0.5;
        this.color = color;
    }
    update(){
        this.x += this.speedX;
        this.radius += 0.3; //could use delta time here
        if(this.radius > this.maxRadius) this.markedForDeletion = true;
    }
    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - (this.radius > this.maxRadius? 1 : this.radius/this.maxRadius);
        ctx.beginPath();//resets current path i.e. pick up pencil
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill(); //fill in circle
        ctx.restore();
    }
}

function drawScore(){
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 50, 75);
    ctx.fillStyle = 'white';
    ctx.fillText('Score: ' + score, 55, 80);
}
function drawGameOver(){
    ctx.textAlign = 'center';
    ctx.fillStyle = 'black';
    ctx.fillText('GAME OVER, your score is ' + score, canvas.width/2, canvas.height/2);
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER, your score is ' + score, 5+canvas.width/2, 5+canvas.height/2);
}

window.addEventListener('click', (e)=>{
   const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1,1); //only looks at canvas things drawn to it
   const pc = detectPixelColor.data;
   console.log(pc);
   ravens.forEach((o)=>{
    if(o.randomColors[0] === pc[0] &&
        o.randomColors[1] === pc[1] &&
        o.randomColors[2] === pc[2]){
            //collision detected
            o.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(o.x, o.y, o.width));
        }
   })

});

function animate(timestamp){
    collisionCtx.clearRect(0,0,canvas.width,canvas.height);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextRaven += deltatime;
    
    while(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven -= ravenInterval;
        ravens.sort((a,b)=>{
            return a.width - b.width; //if a's width is less than b's width then a comes before b
        });

    }
    drawScore();
    [ ...particles, ...ravens, ...explosions].forEach((o) => {
        o.update(deltatime);
        o.draw();
    })
    ravens = ravens.filter((o) => !o.markedForDeletion);
    explosions = explosions.filter((o) => !o.markedForDeletion);
    particles = particles.filter((o) => !o.markedForDeletion);
    if(!gameOver) requestAnimationFrame(animate);
    else drawGameOver();
}
animate(0);