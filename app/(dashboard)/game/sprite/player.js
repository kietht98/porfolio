// VARIABLES /////////////////////////////////////////
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const displayState = document.getElementById('displayState');
const displayKey = document.getElementById('displayKey');
const shadowDog = document.getElementById('shadowDog');
let input;

///////////////////////////////////////////////////////
// PLAYER CLASS ///////////////////////////////////////
///////////////////////////////////////////////////////

class Player {
    constructor(){
        this.states = [new Standing(), new Running(), new Jumping(), new Sitting(), new Rolling(), new Falling()];
        this.currentState = this.states[0];
        this.spriteWidth = 575;
        this.spriteHeight = 523;
        this.frameX = 0;
        this.maxFrame = 5;
        this.frameY = 0;
        this.width = this.spriteWidth/3;
        this.height = this.spriteHeight/3;
        this.x = 100;
        this.y = canvas.height - this.height;
        this.vx = 0;
        this.vy = 0;
        this.speed = 5;
        this.gravity = 0;
        this.image = shadowDog;
        this.frameInterval = 50;
        this.timer = 0;
    }
    setState(state){
        if (this.currentState.state !== this.states[state].state) {
            this.currentState = this.states[state];
            this.currentState.enter();
            console.log(this.states[state].state + ' state entered')
            displayKey.innerText = this.currentState.state;
        }

    }
    update(deltaTime){
        this.currentState.handleInput(input);
        // boundaries
        if (this.x < 0) this.x = 0;
        else if (this.x > canvas.width - this.width) this.x = canvas.width - this.width
        if (this.y > canvas.height - this.height) this.y = canvas.height - this.height;
        // movement
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        // gravity
        if (this.y < canvas.height - this.height) {
            this.gravity += 0.05;
        } else {
            this.gravity = 0;
            this.vy = 0;
        }
        // timing of sprites
        if (this.timer > this.frameInterval){
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }

    }
    onGround(){
        return this.y >= canvas.height - this.height;
    }
    draw(){
        ctx.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height )
    }
}

//////////////////////////////////////////////////////
// STATE CLASS ///////////////////////////////////////
//////////////////////////////////////////////////////

class State {
    constructor(state){
        this.state = state;
    }
}

/////////////////////////////////////////////////////////
// STANDING STATE ///////////////////////////////////////
/////////////////////////////////////////////////////////

class Standing extends State {
    constructor(){
        super('STANDING');
    }
    enter(){
        player.vx = 0;
        player.frameX = 0;
        player.frameY = 0;
        player.maxFrame = 6;
    };
    handleInput(input){
        if (input === 'PRESS right'){
            player.vx = player.speed;
            player.setState(1); // running
        } else if (input === 'PRESS left'){
            player.vx = -player.speed;
            player.setState(1); // running
        } else if (input === 'PRESS up'){
            if (player.onGround()){
                player.setState(2); // jumping
            }
        } else if (input === 'PRESS down'){
            player.setState(3); // sitting
        } else if (input === 'PRESS attack'){
            player.setState(4); // rolling
        }
    }
}

////////////////////////////////////////////////////////
// RUNNING STATE ///////////////////////////////////////
////////////////////////////////////////////////////////

class Running extends State {
    constructor(){
        super('RUNNING');
    }
    enter(){
        player.frameX = 0;
        player.frameY = 3;
        player.maxFrame = 8;
    };
    handleInput(input){
        if (input === 'PRESS right'){
            player.vx = player.speed;
            player.setState(1); // running
        } else if (input === 'RELEASE right'){
            if (player.vx > 0 && player.onGround()){
                player.setState(0); // standing
            }
        } else if (input === 'PRESS left'){
            player.vx = -player.speed;
            player.setState(1); // running
        } else if (input === 'RELEASE left'){
            if (player.vx < 0 && player.onGround()){
                player.setState(0); // standing
            }
        } else if (input === 'PRESS up'){
            if (player.onGround()){
                player.setState(2); // jumping
            }
        } else if (input === 'PRESS down'){
            player.setState(3); // sitting
        } else if (input === 'PRESS attack'){
            player.setState(4); // rolling
        }
    }
}

////////////////////////////////////////////////////////
// JUMPING STATE ///////////////////////////////////////
////////////////////////////////////////////////////////

class Jumping extends State {
    constructor(){
        super('JUMPING');
    }
    enter(){
        player.vy = -25;
        player.y -= 1;
        player.frameX = 0;
        player.frameY = 1;
        player.maxFrame = 6;
        this.handleJumpEvent();
    };
    handleInput(input){
        if (input === 'PRESS right'){
            player.vx = player.speed;
            player.setState(1); // running
        } else if (input === 'PRESS left'){
            player.vx = -player.speed;
            player.setState(1); // running
        } else if (input === 'PRESS attack'){
            player.setState(4); // rolling
        } else if (input === 'release attack'){

        }
    }
    handleJumpEvent(){  
        if (player.vy < player.gravity) {
            requestAnimationFrame(this.handleJumpEvent.bind(this));
        } else {
            player.setState(5); // falling
        }
    }
}

////////////////////////////////////////////////////////
// SITTING STATE ///////////////////////////////////////
////////////////////////////////////////////////////////

class Sitting extends State {
    constructor(){
        super('SITTING');
    }
    enter(){
        player.vx = 0;
        player.frameX = 0;
        player.frameY = 5;
        player.maxFrame = 4;
    };
    handleInput(input){
        if (input === 'PRESS right'){
            player.vx = player.speed;
            player.setState(1); // running
        } else if (input === 'PRESS left'){
            player.vx = -player.speed;
            player.setState(1); // running
        } else if (input === 'RELEASE down'){
            //player.setState(0); // standing
        } else if (input === 'PRESS up'){
            player.setState(2); // jumping
        } else if (input === 'PRESS attack'){
            player.setState(4); // rolling
        }
    }
}

////////////////////////////////////////////////////////
// ROLLING STATE ///////////////////////////////////////
////////////////////////////////////////////////////////

class Rolling extends State {
    constructor(){
        super('ROLLING');
    }
    enter(){
        player.vx = player.speed * 5;
        player.frameX = 0;
        player.frameY = 6;
        player.maxFrame = 6;
    };
    handleInput(input){
        if (input === 'RELEASE right'){
            player.setState(0); // standing
        } else if (input === 'RELEASE left'){
            player.setState(0); // standing
        } else if (input === 'RELEASE attack'){
            player.setState(0); // standing
        }
    }
}

////////////////////////////////////////////////////////
// FALLING STATE ///////////////////////////////////////
////////////////////////////////////////////////////////

class Falling extends State {
    constructor(){
        super('FALLING');
    }
    enter(){
        player.frameX = 0;
        player.frameY = 2;
        player.maxFrame = 6;
        this.handleFalling();
    };
    handleInput(input){
        if (input === 'PRESS down'){
           console.log('trying to dive');
        }
    }
    handleFalling(){
        if (!player.onGround()){
            requestAnimationFrame(this.handleFalling.bind(this));
        } else {
            player.setState(0); // standing
        }
    }
}

/////////////////////////////////////////////////////////
// KEYBOARD EVENT LISTENERS /////////////////////////////
/////////////////////////////////////////////////////////

window.addEventListener('keydown', function(e){
    displayState.innerText = 'keydown ' + e.key;
    switch(e.key){
        case 'ArrowLeft':
            input = 'PRESS left';
            break;
        case 'ArrowRight':
            input = 'PRESS right';
            break;
        case 'ArrowUp':
            input = 'PRESS up';
            break;
        case 'ArrowDown':
            input = 'PRESS down';
            break;
        case 'Control':
            input = 'PRESS attack';
            break;
        case 'a':
            input = 'PRESS left';
            break;
        case 'd':
            input = 'PRESS right';
            break;
        case 'w':
            input = 'PRESS up';
            break;
        case 's':
            input = 'PRESS down';
            break;
        case ' ':
            input = 'PRESS attack';
            break;
    }
});
window.addEventListener('keyup', function(e){
    displayState.innerText = 'keyup ' + e.key;
    switch(e.key){
        case 'ArrowLeft':
            input = 'RELEASE left';
            break;
        case 'ArrowRight':
            input = 'RELEASE right';
            break;
        case 'ArrowUp':
            input = 'RELEASE up';
            break;
        case 'ArrowDown':
            input = 'RELEASE down';
            break;
        case 'Control':
            input = 'RELEASE attack';
            break;
        case 'a':
            input = 'RELEASE left';
            break;
        case 'd':
            input = 'RELEASE right';
            break;
        case 'w':
            input = 'RELEASE up';
            break;
        case 's':
            input = 'RELEASE down';
            break;
        case ' ':
            input = 'RELEASE attack';
            break;
    }
});

/////////////////////////////////////////////////////////
// ANIMATION LOOP ///////////////////////////////////////
/////////////////////////////////////////////////////////

const player = new Player();
let lastTime = 0;

window.addEventListener('load', function(){
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        player.update(deltaTime);
        player.draw();
        requestAnimationFrame(animate);
    }
    animate(0);
});