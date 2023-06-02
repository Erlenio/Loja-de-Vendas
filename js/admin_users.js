let pedidos;
let users;
$(document).ready(() => {
  
    $(".bx-menu").click(() => {
        $(".menu").toggleClass("open");
      });
    

    $("section.users").css("marginTop", $("header").height() + "px");

    

      getPedidos();



});

function getAllUsers(){
    $.ajax({
        type: "GET",
        url: "../php/user.php",
        data: {'request_type': 'readAll'},
        success: (response) => {
          if (response["status"]) {
            users = response["body"];
            writeUsers(users);
          } else {
            users = undefined;
            console.log(response);
            $(".dashboard-link").hide();
          }
        },
        error: (response)=>{console.log(response);}
      });
}

function writeUsers(list){

    $('tbody').html('');
    $.each(list, (key, value)=>{
        let tr = $('<tr>')
        let date = $('<td>').text(value['uid']);
        let name = $('<td>').text(value['name']);
        let email = $('<td>').text(value['email']);
        let tipo = $('<td>').text(value['type']);
        let data = $('<td>').text(value['data_adicao']);
        let compras = $('<td>').text(totalCompras(pedidos,value['uid']));

        tr.append(date);
        tr.append(name);
        tr.append(email);
        tr.append(tipo);
        tr.append(data);
        tr.append(compras);

        $('tbody').append(tr);

    });

    

}

function getPedidos() {
    $.ajax({
      type: "POST",
      url: "../php/pedido.php",
      data: { 'request_type': "readAll"},
      success: (response) => {
        if (response["status"] == true) {
          pedidos = response["body"];
            getAllUsers();
        }else{
            
        }
        console.log(response);
      },
      error: (response) => {console.log(response)}
    });
  }

function totalCompras(pedidos, uid){
    let count = 0;
    pedidos.forEach(element => {
        if(element['uid'] == uid && element['estado'] == 'Pago'){
            count++;
        }
    });
    return count;
}

