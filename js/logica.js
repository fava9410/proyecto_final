$(document).ready(function(){
    $("#agregar").hide();
    $("#parar").hide();
    var nombresProcesos = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    var contador = 0, contadorProcesos = 0;
    var ejecutando = [], bloqueados = [];
    var quantum = 3, intervalo = 10, tamaño = 20;
    //colas
    var q1=[], q2=[], q3=[];
    //grafica
    var colas = ["Cola"], tiemposRafaga = ["Tiempo Rafaga"], procesos = ["Proceso"], llegada = ["Tiempo de llegada"], tiempoFinalizacion = ["Tiempo de Finalizacion"], tiempoRetorno = ["Tiempo de Retorno"], tiempoEspera = ["Tiempo de Espera"], tiempoComienzo = ["Tiempo de Comienzo"];
    var nomcolores = ["Crimson","blue","green","brown","yellow","purple","magenta","gray","Coral","DarkGreen","Chartreuse","BlueViolet","DarkGoldenRod","DarkRed","DarkOrange","Fuchsia","HotPink","LawnGreen","MediumBlue","Olive","OrangeRed","RebeccaPurple","RosyBrown","RoyalBlue","SeaGreen","SlateGray","Teal"];
    var colores = ["AntiqueWhite","white"];
    var matriz = [procesos,colas,llegada,tiemposRafaga,tiempoComienzo,tiempoFinalizacion,tiempoRetorno,tiempoEspera];  

    $("#empezar").click(function(){
        var opcion = 0;
        for(var i=0; i<6; i++){
            contadorProcesos++;
            if(i == 4 || i == 5)
                opcion = 5;
            else if(i == 3 || i == 2)
                opcion = 15;
            else
                opcion = 25;
            crearProceso(opcion);
        }
        pintar();
        pintar_numeros();
        $("#empezar").hide();
        $("#agregar").show();
        $("#parar").show();       
    });

    $("#agregar").click(function(){   
        contadorProcesos++;     
        crearProceso(0);
        pintar();
        pintar_numeros();
    });

    $("#parar").click(function(){
        ponerceros();
        bloqueados.push(ejecutando.shift());
        bloqueados[bloqueados.length-1].llegada = contador + 4;        
        vercolas(1);
        pintar_numeros();
    })

    setInterval(proceso, 1000);

    function ponerceros(){
        ejecutando[0].comienzo = 0;
        ejecutando[0].finalizacion = 0;
        ejecutando[0].espera = 0;
        for(var i=0; i<procesos.length; i++){
            if(ejecutando[0].proceso == procesos[i]){
                tiempoComienzo[i] = 0;
                tiempoFinalizacion[i] = 0;
                tiempoEspera[i] = 0;
            }            
        }
    }
    function sacarbloqueados(){
        for(var i=0; i<bloqueados.length; i++){
            if(contador == bloqueados[i].llegada){
                if(bloqueados[i].cola ==1)
                    q1.push(bloqueados.shift());
                else if(bloqueados[i].cola ==2)
                    q2.push(bloqueados.shift());
                else if(bloqueados[i].cola ==3)
                    q3.push(bloqueados.shift());
            }
        }
        //llenarDatos();
        vercolas(0);
    }

    function crearProceso(opcion){
        var proceso = {"proceso": nombresProcesos[contadorProcesos-1], "cola": Math.round(Math.random()*30), "llegada": contador, "rafaga": Math.round(Math.random()*4+4), "finalizacion": 0};  
        if(opcion != 0)
            proceso.cola = opcion;
        if(proceso.cola >= 0 && proceso.cola <10 ){
            proceso.cola=1;
            q1.push(proceso);
        }
        else if(proceso.cola >= 10 && proceso.cola <= 20 ){
            proceso.cola=2;
            q2.push(proceso);
            q2.sort(sortByRafaga);
        }
        else if(proceso.cola > 20 && proceso.cola <= 30 ){
            proceso.cola=3;
            q3.push(proceso);
        }

        procesos.push(proceso.proceso);
        colas.push(proceso.cola);
        llegada.push(proceso.llegada);
        tiemposRafaga.push(proceso.rafaga);
        colores[procesos.length-1] = nomcolores[procesos.length-2];
        colores.push("white");

        vercolas(0);
    }

    function sortByRafaga(x,y) {
        return ((x.rafaga == y.rafaga) ? 0 : ((x.rafaga > y.rafaga) ? 1 : -1 ));
    }

    function vercolas(opcion){
        if(q1 != 0){
            if(opcion != 0)
                q1[0].llegada = contador;
            llenarDatos(q1,0);
            if(q2 != 0){
                llenarDatos(q2, q1[q1.length-1].finalizacion);
                if(q3 != 0)
                    llenarDatos(q3, q2[q2.length-1].finalizacion);
            }
            else{
                if(q3 != 0)
                    llenarDatos(q3, q1[q1.length-1].finalizacion);
            }
        }
        else if(q2 != 0){      
            if(opcion != 0)
                q2[0].llegada = contador;      
            llenarDatos(q2,0);
            if(q3 != 0)
                llenarDatos(q3, q2[q2.length-1].finalizacion);            
        }
        else if(q3 != 0){
            if(opcion != 0)
                q3[0].llegada = contador;
            llenarDatos(q3, 0);
        }
    }

    function llenarDatos(cola, anterior){
        for(var i=0; i<cola.length; i++){
            if(i == 0){
                cola[0].finalizacion = cola[0].llegada + cola[0].rafaga;     
                if(ejecutando!=0){        
                    cola[0].finalizacion = ejecutando[0].finalizacion + cola[0].rafaga;        
                }                
                if(anterior != 0)     
                    cola[0].finalizacion = anterior + cola[0].rafaga;        
            }
            else {
                cola[i].finalizacion = cola[i-1].finalizacion + cola[i].rafaga; 
            }       
            cola[i].retorno = cola[i].finalizacion-cola[i].llegada;
            cola[i].espera = cola[i].retorno-cola[i].rafaga;
            cola[i].comienzo = cola[i].llegada+cola[i].espera;               

            for(var j=1; j<procesos.length; j++){
                if(procesos[j] == cola[i].proceso){
                    tiempoComienzo[j] = cola[i].comienzo;
                    tiempoFinalizacion[j] = cola[i].finalizacion;
                    tiempoRetorno[j] = cola[i].retorno;
                    tiempoEspera[j] = cola[i].espera;
                }
            }
        }
        borrarTabla();
        dibujarTabla();
    }
    //round robin
    function intercambio(){
        if(ejecutando != 0 && q3 != 0 && ejecutando[0].cola == 3 && ejecutando[0].rafaga!=0 && ejecutando[0].comienzo+quantum == contador){
            q3[0].llegada=contador;     
            q3.push(ejecutando.shift());
            llenarDatos(q3, 0);            
            ejecutando.push(q3.shift());
            pintar_numeros();
        }
    }


    function proceso(){        
        if(ejecutando == 0 || contador == ejecutando[0].finalizacion){
            if(q1 != 0)
                ejecutando[0] = q1.shift();
            else if(q2 != 0)
                ejecutando[0] = q2.shift();
            else if(q3 != 0)
                ejecutando[0] = q3.shift(); 
            else
                ejecutando.shift();
        }        
        if(ejecutando != 0 && ejecutando[0].cola == 3){
            if(q1 != 0)
                llenarDatos(q1, ejecutando[0].comienzo+quantum);
            else if(q2 != 0)
                llenarDatos(q2, ejecutando[0].comienzo+quantum);
            if(ejecutando[0].comienzo+quantum == contador && (q1!=0 || q2!=0)){                
                q3.push(ejecutando.shift());                
                if(q1!=0){
                    ejecutando.push(q1.shift());
                    llenarDatos(q3, ejecutando[0].finalizacion);
                }
                else if(q2!=0){
                    ejecutando.push(q2.shift());
                    llenarDatos(q3, ejecutando[0].finalizacion);
                }
                pintar_numeros();
            }
        }
        intercambio();
        pintar_procesos();  
        if(ejecutando != 0)
            ejecutando[0].rafaga--;
        if(bloqueados != 0){
            sacarbloqueados();
        }


        console.log("ejecutando");
        console.log(ejecutando[0]);
        console.log("q1")
        for(var i=0; i< q1.length; i++)
            console.log(q1[i]);
        console.log("q2")
        for(var i=0; i< q2.length; i++)
            console.log(q2[i]);
        console.log("q3")
        for(var i=0; i< q3.length; i++)
            console.log(q3[i]);
        contador++;
    }

    function dibujarTabla(){
        var body = document.getElementById("tabla");
        var tabla   = document.createElement("table");
        var tblBody = document.createElement("tbody");

        for (var j = 0; j < procesos.length; j++) {
            var hilera = document.createElement("tr");   
            for (var i = 0; i < matriz.length; i++){
                var celda = document.createElement("td");
                var textoCelda = document.createTextNode(matriz[i][j]);
                celda.appendChild(textoCelda);
                hilera.appendChild(celda);
            }   
            tblBody.appendChild(hilera);
        }     
        tabla.appendChild(tblBody);
        body.appendChild(tabla);
        tabla.setAttribute("border", "2");
    }

    function borrarTabla(){
        var tabla = $("#tabla").empty();
    }

    function pintar(){
        var elemento = document.getElementById("lienzo");
        var lienzo = elemento.getContext('2d');          
        // DIBUJAR PROCESOS
        for(var i=1; i<procesos.length; i++){
            lienzo.fillStyle=colores[i];
            lienzo.fillRect(10,i*(tamaño+intervalo),tamaño,tamaño);
            lienzo.fillStyle = "white";
            lienzo.font = "20px Arial";
            lienzo.fillText(procesos[i],13,i*(tamaño+intervalo)+17);
        }    
    }
    function pintar_numeros(){
        var elemento = document.getElementById("lienzo");
        var lienzo = elemento.getContext('2d');   
        var cola;  

        if(q3 != 0)
            cola = q3;
        else if(q2 != 0)
            cola = q2;
        else if (q1 != 0)
            cola = q1;

        for(var i=0; i<=cola[cola.length-1].finalizacion; i++){
            lienzo.fillStyle = "black";
            lienzo.font = "20px Arial";
            lienzo.fillText(i, (i+1)*(tamaño+intervalo)+10, 15);
        } 
    }
    function pintar_procesos(){   
        var elemento = document.getElementById("lienzo");
        var lienzo = elemento.getContext('2d');      
        for(var i=1; i<procesos.length; i++){ 
            if(contador >= tiempoComienzo[i] && contador<tiempoFinalizacion[i]){      
                lienzo.fillStyle = colores[i];              
            }
            else{
                if(llegada[i]>contador || contador>=tiempoFinalizacion[i]){       
                    lienzo.fillStyle = colores[colores.length-1];
                }
                else{
                    lienzo.fillStyle = colores[0];
                }
            }
            lienzo.fillRect((contador+1)*(tamaño+intervalo)+10, i*(tamaño+intervalo),tamaño,tamaño);       
        }
    }
});