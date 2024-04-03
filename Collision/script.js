/**@type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 700;
const explosions = [];
let canvasPosition = canvas.getBoundingClientRect();

class Explosion {
    constructor(x,y){
        this.spriteWidth = 200;
        this.spriteHeight = 179;
        this.width = this.spriteWidth * .7;
        this.height = this.spriteHeight * .7;
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = 'boom.png';
        this.frame = 0;
        this.timer = 0;
        this.angle = (Math.random() * 360) * Math.PI / 180;
        this.sound = new Audio();
        this.sound.src = 'boom.wav';
    }
    
    update(){
        if(this.frame === 0) this.sound.play();
        this.timer++;
        if(this.timer % 30 === 0){
            this.frame++;
        }
    }

    draw(){
        ctx.save();
        ctx.translate(this.x, this.y); //move corner of canvas to draw location
        ctx.rotate(this.angle); //adjust angle
        ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, 0 - this.width/2, 0 - this.height/2, this.width, this.height);
        ctx.restore();
    }
}

canvas.addEventListener('click', (e)=>{
    createAnimation(e);
});
// canvas.addEventListener('mousemove', (e)=>{
//     createAnimation(e);
// });

function createAnimation(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    //since painting relative to canvas coordinates, you need to offset x,y positions

    explosions.push(new Explosion(positionX, positionY));
}

function animate(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for(let i = 0; i < explosions.length; i++){
        explosions[i].update();
        explosions[i].draw();
        if(explosions[i].frame > 4){
            explosions.splice(i, 1);
            i--; //dont change index position since array is shifted left after splice
        }
    }

    requestAnimationFrame(animate);
}

animate();