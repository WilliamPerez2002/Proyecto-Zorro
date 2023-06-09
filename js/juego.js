
//****** GAME LOOP ********//


var time = new Date();
var deltaTime = 0;

document.getElementById("comenzar").addEventListener("click", Init);

document.getElementById("reiniciar").addEventListener("click", Reiniciar); 



function Init() {
    time = new Date();
    Start();
    Loop();
}


function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    animacionId = requestAnimationFrame(Loop);
}




//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 850;
var gravedad = 2700;

var dinoPosX = 42;
var dinoPosY = sueloY; 

var sueloX = 0;
var velEscenario = 1380/3;
var gameVel = 1.2;
var score = 0;
var subScore = 0;

var parado = false;
var saltando = false;

var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.3;
var tiempoObstaculoMax = 1.5;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.7;
var tiempoNubeMax = 2.7;
var maxNubeY = 270;
var minNubeY = 100;
var nubes = [];
var velNube = 0.5;

var animacionId;
var comenzar;
var contenedor;
var dino;
var textoScore;
var suelo;
var gameOverDiv;


function Start() {

    comenzar = document.querySelector(".start");
    gameOverDiv = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    crearScore();
    textoScore = document.querySelector(".score");
    crearDino();
    dino = document.querySelector(".dino");
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", agachar);
    
    contenedor.style.display = "block";
    comenzar.style.display = "none";
    gameOverDiv.style.display = "none";

}

function Update() {
    if(parado) return;
    
    moverDinosaurio();
    moverSuelo();
    decidirCrearObstaculos();
    decidirCrearNubes();
    moverObstaculos();
    moverNubes();
    detectarColision();

    velY -= gravedad * deltaTime;

    ganarPuntos(false);
    
}

function handleKeyDown(ev){
    if(ev.keyCode == 32){
        saltar();
    }
}

function agachar(ev){
    if(ev.keyCode == 40){
       console.log("agachar");
    }

}



function saltar(){
    if(dinoPosY === sueloY){
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo");
    }
}

function moverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if(dinoPosY < sueloY){
        
        tocarSuelo();
    }
    dino.style.bottom = dinoPosY+"px";
}

function tocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if(saltando){
        dino.classList.add("dino-corriendo");
    }
    saltando = false;
}

function moverSuelo() {
    sueloX += calcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function calcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function estrellarse() {
    dino.classList.remove("dino-corriendo");
    dino.classList.add("dino-estrellado");
    parado = true;
}

function decidirCrearObstaculos() {
    tiempoHastaObstaculo -= deltaTime;
    if(tiempoHastaObstaculo <= 0) {
        crearObstaculo();
    }
}

function decidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if(tiempoHastaNube <= 0) {
        crearNube();
    }
}

function crearDino() {

    var dino = document.createElement("div");
    contenedor.appendChild(dino);
    dino.classList.add("dino", "dino-corriendo");

}

function crearScore(){

    var score = document.createElement("div");
    contenedor.appendChild(score);
    score.classList.add("score");
    score.innerText = 0;

}

function crearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");
    if(Math.random() > 0.3) obstaculo.classList.add("cactus2");
    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth+"px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax-tiempoObstaculoMin) / gameVel;
}

function crearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth+"px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY-minNubeY)+"px";
    
    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax-tiempoNubeMin) / gameVel;
}

function moverObstaculos() {
    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if(obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].parentNode.removeChild(obstaculos[i]);
            obstaculos.splice(i, 1);
            ganarPuntos(true);
            
            
        }else{
            obstaculos[i].posX -= calcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX+"px";
        }
    }
}

function moverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if(nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].parentNode.removeChild(nubes[i]);
            nubes.splice(i, 1);
        }else{
            nubes[i].posX -= calcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX+"px";
        }
    }
}

function ganarPuntos(directo) {

    subScore += 1;

    if(subScore % 90 == 0 || directo){

        score = parseInt(score+1);
    }

    textoScore.innerText = parseInt(score);


    if(score % 10 == 0 &&  score != 0) {

        gameVel += 0.2;
        cambiarHora();
        score+=0.1;
    }
    
    suelo.style.animationDuration = (3/gameVel)+"s";
}


function cambiarHora(){

    if(parseInt(score) % 12 == 0) {
        contenedor.classList.add("mediodia");
       
    }else if(parseInt(score) % 20 == 0) {
        contenedor.classList.add("tarde");
       
    } else if(parseInt(score) % 25 == 0) {
        contenedor.classList.add("noche");
        
    }
}

function gameOver() {
    estrellarse();
    gameOverDiv.style.display = "block";
}

function detectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if(obstaculos[i].posX > dinoPosX + dino.clientWidth) {
            //EVADE
            break; //al estar en orden, no puede chocar con más
        }else{
            if(isCollision(dino, obstaculos[i], 10, 30, 15, 20)) {
                gameOver();
            }
        }
    }
}

function isCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}


function Reiniciar(){

    
    
    eliminarElementos();

    reasignarVariables();

    cancelAnimationFrame(animacionId);
    
    Init();

}

function eliminarElementos() {


    const divsAEliminar = contenedor.querySelectorAll('.cactus');

    divsAEliminar.forEach(div => {
    contenedor.removeChild(div);
    });



    const divsAEliminar2 = contenedor.querySelectorAll('.nube');

    divsAEliminar2.forEach(div => {
    contenedor.removeChild(div);
    });

    const divsAEliminar3 = contenedor.querySelectorAll('.score');
    
    divsAEliminar3.forEach(div => {
    contenedor.removeChild(div);
    });

    const divsAEliminar4 = contenedor.querySelectorAll('.dino');

    divsAEliminar4.forEach(div => {
    contenedor.removeChild(div);
    });


}

function reasignarVariables() {


    deltaTime = 0;

    
    sueloY = 22;
    velY = 0;
    impulso = 850;
    gravedad = 2500;

    dinoPosX = 42;
    dinoPosY = sueloY; 

    sueloX = 0;
    velEscenario = 1380/3;
    gameVel = 1;
    score = 0;
    subScore = 0;

    parado = false;
    saltando = false;

    tiempoHastaObstaculo = 2;
    tiempoObstaculoMin = 0.7;
    tiempoObstaculoMax = 1.8;
    obstaculoPosY = 16;
    obstaculos = [];

    tiempoHastaNube = 0.5;
    tiempoNubeMin = 0.7;
    tiempoNubeMax = 2.7;
    maxNubeY = 270;
    minNubeY = 100;
    nubes = [];
    velNube = 0.5;

    comenzar = null;
    contenedor = null;
    dino = null ;
    textoScore = null;
    suelo = null;
    gameOverDiv = null;





}

