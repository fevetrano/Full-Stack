let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');


// var meuObj = {
//     idade: 5,
//     altura: 1.75,
//     imprimeIdade: function () {
//         alert (this.idade);
//     }
// }


let retangulo1 = {
    x: 20,
    y: 30,
    altura: 20,
    largura: 70,
    cor: "red",
    desenha: function(){
        ctx.beginPath();
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x,this.y,this.largura,this.altura);
        ctx.closePath();
    }
};

let retangulo2 = {
    x: 50,
    y: 50,
    altura: 20,
    largura: 70,
    cor: "blue",
    
    desenha: function(){
        ctx.beginPath();
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x,this.y,this.largura,this.altura);
        ctx.closePath();
    }
};

// retangulo1.desenha();
// retangulo2.desenha();

let direcao = 1

let tamanho = 1


let elemento = {
    x: 50,
    y: 200,
    raio: 50,
    cor: "blue",
    desenha: function(){
        ctx.beginPath();
        ctx.fillStyle = this.cor;
        ctx.arc(this.x,this.y,this.raio,0,2*Math.PI);
        ctx.fill()
        ctx.closePath();
    }
};

// elemento.desenha();

// function animar(){
//     ctx.clearRect(0,0,400,400);

//     if(retangulo1.x == 330) {
//         direcao = -1
//     };
//     if(retangulo1.x == 0) {
//         direcao = 1
//     };

//     retangulo1.x = retangulo1.x+direcao;
//     retangulo1.desenha();
//     requestAnimationFrame(animar);
// };


let bola = {
    x: 0,
    y: 100,
    raio: 50,
    img: new Image(),
    desenha: function(){
        this.img.src = 'bola_fut.jpg';
        ctx.beginPath();
        ctx.drawImage(this.img, this.x-bola.raio, this.y-bola.raio, 2*this.raio, 2*this.raio);
        ctx.closePath();
    }

}




function animacao(){
    ctx.clearRect(0,0,400,400)
    retangulo1.desenha();
    retangulo2.desenha();
    elemento.desenha();
    bola.desenha();
    if(retangulo1.x == 330) {
        direcao = -1
    };
     if(retangulo1.x == 0) {
         direcao = 1
     };



    retangulo1.x=retangulo1.x+direcao
    
    if(retangulo2.tamanho == 0) {
        direcao = -1
    }
    if(retangulo2.tamanho == 330) {
        direcao = 1
    }

    if(retangulo2.tamanho == 0) {
        direcao = -1
    }
    if(retangulo2.tamanho == 330) {
        direcao = 1
    }


    retangulo2.altura=retangulo2.altura+direcao
    retangulo2.largura=retangulo2.largura+direcao
    requestAnimationFrame(animacao)
}
animacao();
document.addEventListener('keydown',function(evento){
    tecla = evento.key;
    console.log(tecla);
    if(tecla == 'ArrowUp')   {elemento.y = elemento.y-10}  
    if(tecla == 'ArrowDown') {elemento.y = elemento.y+10}  
    if(tecla == 'ArrowLeft') {elemento.x = elemento.x-10}  
    if(tecla == 'ArrowRight'){elemento.x = elemento.x+10}
});

animacao();
document.addEventListener('mousemove',function(evento){
    let rect = canvas.getBoundingClientRect();
    let x_mouse = evento.clientX - rect.left;
    let y_mouse = evento.clientY - rect.top;
    console.log(x_mouse,y_mouse);
    if(x_mouse>0+bola.raio && x_mouse<400-bola.raio && y_mouse>0+bola.raio && y_mouse<400-bola.raio){
        bola.x = x_mouse;
        bola.y = y_mouse;
    }

    else{
        bola.x = bola.x;
        bola.y = bola.y;
    }
})



animacao()