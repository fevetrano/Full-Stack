function DarAlerta(){
var txtCaixa = document.getElementById("txtCaixa").value
    window.alert("Seu nome é " +txtCaixa);
}



//window.alert("ESTE É UM ALERTA");
console.log("Esta mensagem está escondida");

var entrada = prompt("Entre com a sua idade");

console.log(entrada);

entrada = parseInt(entrada);

if (entrada>= 18) {
    console.log("Você é de maior");
    document.getElementById("testeID").innerHTML ="Você é de maior";
    document.getElementById("bodinho").style.setProperty("background-color", "red");
} else if (entrada<= 18){
    console.log("Você é de menor");
}else{
    console.log("Resposta Inválida");
}