import {StandingLeft, StandingRight, SittingLeft, SittingRight, RunningLeft, RunningRight, 
    JumpingLeft, JumpingRight, FallingLeft, FallingRight} from "./state.js";

export default class Player{
    constructor(gameWidth, gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.states = [new StandingLeft(), new StandingRight(), new SittingLeft(), new SittingRight(),
        new RunningLeft(), new RunningRight(), new JumpingLeft(), new JumpingRight(), new FallingLeft(), new FallingRight()];
        this.currentState = this.states[1];
        this.image = document.getElementById('dogImage');
        this.width = 200;
        this.height = 181.83;
        this.x = this.gameWidth/2 - this.width/2;
        this.y = this.gameHeight - this.height;
        this.frameX = 0;
        this.frameY = 0;
        this.speed = 0;
        this.maxSpeed = 3;
        this.maxFrame = 6;
        this.vy = 0;
        this.weight = 0.3;
        this.fps = 30;
        this.frameTimer = 0;
        this.frameInterval = 1000 / this.fps;
    }

    draw(context){
        context.drawImage(this.image,this.frameX*this.width,this.frameY*this.height,this.width,this.height, this.x, this.y, this.width, this.height);
    }

    update(input, deltaTime){
        this.currentState.handleInput(input, this);

        if(this.frameTimer > this.frameInterval){
            if(this.frameX < this.maxFrame) this.frameX ++;
            else this.frameX = 0;
            this.frameTimer = 0;
        }else{
            this.frameTimer += deltaTime;
        }

        this.x += this.speed;
        if(this.x <= 0) this.x = 0;
        else if(this.x >= this.gameWidth - this.width) this.x = this.gameWidth - this.width;

        this.y += this.vy;
        if(!this.onGround()){
            this.vy += this.weight;
        } else {
            this.vy = 0;
        }

        if(this.y > this.gameHeight - this.height) this.y = this.gameHeight - this.height;
    }

    setState(state){
        this.currentState = this.states[state];
        this.currentState.enter(this);
    }

    onGround(){
        return this.y >= this.gameHeight - this.height;
    }
}