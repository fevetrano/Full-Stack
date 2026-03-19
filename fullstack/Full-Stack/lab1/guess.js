
var numeroAleat = Math.floor( Math.random() *101  );


function ChecaAleatorio(){
    var numeroColocado = document.getElementById("txtNum1").value;

    if(numeroColocado > numeroAleat){
        console.log("O número é maior");
        document.getElementById("txtNum1").innerHTML="O número é menor";
        document.getElementById("txtNum1").style.setProperty("background-color", "blue");
    }else if (numeroColocado < numeroAleat){
        console.log("O número é menor");
        document.getElementById("txtNum1").innerHTML="O número é menor";
        document.getElementById("txtNum1").style.setProperty("background-color", "red");
    }else{
        console.log("O número é igual");
        document.getElementById("txtNum1").style.setProperty("background-color", "green");
    }
}
