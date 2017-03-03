function Position(){
  this.x = 0.0;
  this.y = 0.0;
}

function Button(){
  this.pos = new Position();
  this.width = 0.0;
  this.height = 0.0;
  this.img;
  
  this.loadImg = function(_pth){
    this.img = loadImage(_pth);
  }
  
  this.adjustSize = function(){
    this.width = this.img.width;
    this.height = this.img.height;
  }
  
  this.draw = function(){
    image(this.img, this.pos.x, this.pos.y);
  }
  
  this.isHit = function(xx, yy){
    return (xx>this.pos.x && xx<(this.pos.x+this.width) && yy>this.pos.y && yy<(this.pos.y+this.height));
  }
}

function Enemy(){
  this.startPos = new Position();
  this.curPos = new Position();
  this.width = 0.0;
  this.height = 0.0;
  this.img;
  this.noff = 0.0;
  
  this.adjustSize = function(){
    this.width = this.img.width;
    this.height = this.img.height;
  }
  
  this.move = function(){
    this.noff += 0.01;
    this.curPos.x = this.startPos.x + noise(this.noff)*800;
  }
  
  this.getHitPos = function(){
    return (this.curPos.x+550);
  }
  
  this.getKickPos = function(){
    return (this.curPos.x+700);
  }
  
  this.draw = function(){
    image(this.img, this.curPos.x, this.curPos.y);
  }
}

function Limb(){
  this.img;
  this.pos = new Position();
  this.anchor = new Position();
  
  this.draw = function(){
    image(this.img, this.pos.x, this.pos.y);
    //fill(255,0,0);
    //ellipse(this.anchor.x, this.anchor.y, 20);
    //fill(255,255,255);
  }
}

function Pow(_xx, _yy, _time){
  this.pos = new Position();
  this.pos.x = _xx;
  this.pos.y = _yy;
  this.time= _time;
}

var scene = 0;
var noff = 0.0;

var imgPow;
var pows = [];

var dio = new Enemy();

var butPunch = new Button();
var butKick = new Button();

var body = new Limb();
var head = new Limb();
var arm = new Limb();
var upperLeg = new Limb();
var lowerLeg = new Limb();

var headDir = 1.0;
var headInc = 0.01;
var headAng = 0.0;
var headMaxPos = 0.5;
var headMaxNeg = -0.3;

var bPunch = false;
var bKick = false;
var punchThresh = 520;
var kickThresh = 530;

var bAnimIntro = false;
var animIntroPct = 0.0;

function preload(){
  imgPow = loadImage("POW.png");
  body.img = loadImage("morris_body.png");
  head.img = loadImage("morris_head.png");
  arm.img = loadImage("morris_arm.png");
  upperLeg.img = loadImage("morris_upper_leg.png");
  lowerLeg.img = loadImage("morris_lower_leg.png");
  
  butPunch.loadImg("red_but.png");
  butKick.loadImg("blue_but.png");
  
  dio.img = loadImage("dio.png");
}

function setup() {
  createCanvas(1024,600);
  background(0);
  frameRate(30);
  
  body.pos.x = 650;
  body.pos.y = height/2 - 250;
  head.pos = body.pos;
  arm.pos = body.pos;
  upperLeg.pos = body.pos;
  lowerLeg.pos = body.pos;
  
  head.anchor.x = head.pos.x+86;
  head.anchor.y = head.pos.y+98;
  
  arm.anchor.x = arm.pos.x+47;
  arm.anchor.y = arm.pos.y+122;
  
  upperLeg.anchor.x = upperLeg.pos.x+62;
  upperLeg.anchor.y = upperLeg.pos.y+273;
  
  lowerLeg.anchor.x = lowerLeg.pos.x+66;
  lowerLeg.anchor.y = lowerLeg.pos.y+349;
  
  butPunch.adjustSize();
  butKick.adjustSize();
  butPunch.pos.x = width - butPunch.width*2 - 60;
  butPunch.pos.y = 600 - butPunch.height-20;
  butKick.pos.x = width - butKick.width - 40;
  butKick.pos.y = butPunch.pos.y;
  
  dio.adjustSize();
  dio.startPos.y = height/2-dio.height/2;
  dio.startPos.x = -dio.width*2/3;
  dio.curPos.x = dio.startPos.x;
  dio.curPos.y = dio.startPos.y;
}

function animateHead(){
  if(headDir>0){
    if(headAng<headMaxPos){
      headAng += (headDir*headInc);
    }else{
      headDir = -1.0;
    }
  }else{
    if(headAng>headMaxNeg){
      headAng+= (headDir*headInc);
    }else{
      headDir = 1.0;
    }
  }
  translate(head.anchor.x, head.anchor.y);
  rotate(headAng);
  translate(-head.anchor.x, -head.anchor.y);
}

function updatePunch(){
  if(!bPunch)return;
  translate(arm.anchor.x, arm.anchor.y);
  rotate(1.5)
  translate(-arm.anchor.x, -arm.anchor.y);
}

function updateKick(){
  if(!bKick)return;
  translate(upperLeg.anchor.x, upperLeg.anchor.y);
  rotate(1.5)
  translate(-upperLeg.anchor.x, -upperLeg.anchor.y);
}

function draw() {
  background(0);
  if(scene==0){
    drawIntro();
  }else if(scene==1){
    drawPlay();
  }
    
}

function drawIntro(){
  if(bAnimIntro){
    animIntroPct += 0.01;
    if(animIntroPct>=1.0){
      animIntroPct=1.0;
      scene = 1;
    }
  }
  
  push();
  noff += 0.01;
  translate(noise(noff)*300 * (1.0-animIntroPct),0);
  dio.draw();
  pop();
  
  fill(255,255,255);
  textFont("Helvetica");
  push();
  translate(0,-400*animIntroPct);
  textSize(70);
  text("Dio ha sfidato Morris!",300,200);
  pop();
  push();
  translate(0,100*animIntroPct);
  textSize(20);
  text("clicka per iniziare e fargli capire che deve stare al suo posto", 400, 550);
  pop();
  
  if(bAnimIntro){
    push();
    translate(400*(1.0-animIntroPct),0);
    drawMorris();
    pop();
    
    push();
    translate(0,100*(1.0-animIntroPct));
    butPunch.draw();
    butKick.draw();
    pop();
  }
}

function drawMorris(){
  push();
  animateHead();
  head.draw();
  pop();
  push();
  updateKick();
  upperLeg.draw();
  lowerLeg.draw();
  pop();
  push();
  updatePunch();
  arm.draw();
  pop();
  body.draw();
}

function drawPlay(){
  dio.move();
  dio.draw();
  drawMorris();
  
  butPunch.draw();
  butKick.draw();
  
  if(pows.length>0){
    for(var i=pows.length-1;i>=0;i--){
      image(imgPow, pows[i].pos.x, pows[i].pos.y);
      if(millis()>(pows[i].time+100)){
        pows.splice(i,1);
      }
    }
  }
  
  if(bPunch){
    if(dio.getHitPos()>=punchThresh){
      pows.push(new Pow(punchThresh-70+random(-20,20),30+random(-20,20), millis()));
    }
  }
  if(bKick){
    if(dio.getKickPos()>=kickThresh){
      pows.push(new Pow(kickThresh-70+random(-20,20),150+random(-20,20),millis()));
    }
  }
}

function mousePressed(){
  if(scene==1){
    if(butPunch.isHit(mouseX, mouseY)){
      bKick=false;
      bPunch=true;
    }else if(butKick.isHit(mouseX, mouseY)){
      bKick=true;
      bPunch=false;
    }
  }else if(scene==0){
    bAnimIntro = true;
  }
}

function mouseReleased(){
  bPunch=false;
  bKick=false;
}