let pedidos;
let products;

$(document).ready(() => {
  $(".bx-menu").click(() => {
    $(".menu").toggleClass("open");
  });

  $(".bx-user").click(() => {
    $(".user-details").toggleClass("active");
  });

  $("section.admin-header").css("marginTop", $("header").height() + "px");

  $.ajax({
    type: "GET",
    url: "../php/user.php",
    data: {},
    success: (response) => {
      if (response["status"]) {
        user = response["body"][0];
        $(".username").text(user["name"]);
        $(".email").text(user["email"]);
        if (user["type"] == "admin") {
          $(".dashboard-link").show();
        } else {
          $(".dashboard-link").hide();
        }
        $('.unloged').hide();
        getProducts();
        getPedidos();
      } else {
        user = undefined;
        $(".dashboard-link").hide();
        document.location.href = "login.html";
      }
    },
  });
});

function getPedidos() {
    $.ajax({
      type: "POST",
      url: "../php/pedido.php",
      data: { 'request_type': "readAll"},
      success: (response) => {
        if (response["status"] == true) {
          pedidos = response["body"];
          writeSells(pedidos);
          sellCount(pedidos);
        }else{

        }
        console.log(response);
      },
      error: (response) => {console.log(response)}
    });
  }

  function getProducts() {
    $.ajax({
      type: "POST",
      url: "../php/produto.php",
      data: { request_type: "read" },
      success: (response) => {
        products = response;
        $('#num-produtos').text(products.length);
      },
    });
  }

function writeSells(list){
    $('tbody').html('');
    $.each(list, (key, value)=>{
        let tr = $('<tr>')
        let date = $('<td>').text(value['data']);
        let cliente = $('<td>').text(value['uid']);
        let produtos = $('<td>').text(value['produtos'].length);
        let preco = $('<td>').text(value['preco']);


        tr.append(date);
        tr.append(cliente);
        tr.append(produtos);
        tr.append(preco);

        $('tbody').append(tr);

    });
}

function sellCount(lista){
  let count = 0;
  let amount = 0;
  lista.forEach(element => {
    if(element['estado'] == 'Pago'){
      count++;
      amount += element['preco'];
    }
  });

  $('#num-vendas').text(count);
  $('#num-sell-value').html(amount+' <span>Mzn<span>');
  $('#num-pedidos').text(pedidos.length);

}


