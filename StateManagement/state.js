const states = {
    STANDING_LEFT: 0,
    STANDING_RIGHT: 1,
    SITTING_LEFT: 2,
    SITTING_RIGHT: 3,
    RUNNING_LEFT: 4,
    RUNNING_RIGHT: 5,
    JUMPING_LEFT: 6,
    JUMPING_RIGHT: 7,
    FALLING_LEFT: 8,
    FALLING_RIGHT: 9
}

class State {
    constructor(state){
        this.state = state;
    }
}

export class StandingLeft extends State {
    constructor(){
        super('STANDING LEFT');
    }

    enter(player){
        player.maxFrame = 6;
        player.frameY = 1;
        player.frameX = 0;
        player.speed = 0;
        
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS right') player.setState(states.RUNNING_RIGHT);
        else if(input.lastKey === 'PRESS left') player.setState(states.RUNNING_LEFT);
        else if(input.lastKey === 'PRESS down') player.setState(states.SITTING_LEFT);
        else if(input.lastKey === 'PRESS up') player.setState(states.JUMPING_LEFT);
    }
}

export class StandingRight extends State {
    constructor(){
        super('STANDING RIGHT');
    }

    enter(player){
        player.maxFrame = 6;
        player.frameY = 0;
        player.frameX = 0;
        player.speed = 0;
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS right') player.setState(states.RUNNING_RIGHT);
        else if(input.lastKey === 'PRESS left') player.setState(states.RUNNING_LEFT);
        else if(input.lastKey === 'PRESS down') player.setState(states.SITTING_RIGHT);
        else if(input.lastKey === 'PRESS up') player.setState(states.JUMPING_RIGHT);
    }
}

export class SittingLeft extends State {
    constructor(){
        super('SITTING LEFT');
    }

    enter(player){
        player.maxFrame = 4;
        player.frameY = 9;
        player.frameX = 0;
        player.speed = 0;
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS right') player.setState(states.SITTING_RIGHT);
        else if(input.lastKey === 'RELEASE down') player.setState(states.STANDING_LEFT);
    }
}

export class SittingRight extends State {
    constructor(){
        super('SITTING RIGHT');
    }

    enter(player){
        player.maxFrame = 4;
        player.frameY = 8;
        player.frameX = 0;
        player.speed = 0;
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS left') player.setState(states.SITTING_LEFT);
        else if(input.lastKey === 'RELEASE down') player.setState(states.STANDING_RIGHT);
    }
}

export class RunningLeft extends State {
    constructor(){
        super('RUNNING LEFT');
    }

    enter(player){
        player.maxFrame = 8;
        player.frameY = 7;
        player.frameX = 0;
        player.speed = -player.maxSpeed;
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS right') player.setState(states.RUNNING_RIGHT);
        else if(input.lastKey === 'RELEASE left') player.setState(states.STANDING_LEFT);
        else if(input.lastKey === 'PRESS down') player.setState(states.SITTING_LEFT);
    }
}

export class RunningRight extends State {
    constructor(){
        super('RUNNING RIGHT');
    }

    enter(player){
        player.maxFrame = 8;
        player.frameY = 6;
        player.frameX = 0;
        player.speed = player.maxSpeed;
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS left') player.setState(states.RUNNING_LEFT);
        else if(input.lastKey === 'RELEASE right') player.setState(states.STANDING_RIGHT);
        else if(input.lastKey === 'PRESS down') player.setState(states.SITTING_RIGHT);
    }
}

export class JumpingLeft extends State {
    constructor(){
        super('JUMPING LEFT');
    }

    enter(player){
        player.maxFrame = 6;
        player.frameY = 3;
        player.frameX = 0;
        if(player.onGround()) player.vy -= 25;
        player.speed = -player.maxSpeed * 0.5;
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS right') player.setState(states.JUMPING_RIGHT);
        else if(player.onGround()) player.setState(states.STANDING_LEFT);
        else if(player.vy > 0) player.setState(states.FALLING_LEFT);
    }
}

export class JumpingRight extends State {
    constructor(){
        super('JUMPING RIGHT');
    }

    enter(player){
        player.maxFrame = 6;
        player.frameY = 2;
        player.frameX = 0;
        if(player.onGround()) player.vy -= 25;
        player.speed = player.maxSpeed * 0.5;
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS left') player.setState(states.JUMPING_LEFT);
        else if(player.onGround()) player.setState(states.STANDING_RIGHT);
        else if(player.vy > 0) player.setState(states.FALLING_RIGHT);
    }
}

export class FallingLeft extends State {
    constructor(){
        super('FALLING LEFT');
    }

    enter(player){
        player.maxFrame = 6;
        player.frameY = 5;
        player.frameX = 0;
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS right') player.setState(states.FALLING_RIGHT);
        else if(player.onGround()) player.setState(states.STANDING_LEFT);
    }
}

export class FallingRight extends State {
    constructor(){
        super('FALLING RIGHT');
    }

    enter(player){
        player.maxFrame = 6;
        player.frameY = 4;
        player.frameX = 0;
    }

    handleInput(input, player){
        if(input.lastKey === 'PRESS left') player.setState(states.FALLING_LEFT);
        else if(player.onGround()) player.setState(states.STANDING_RIGHT);
    }
}