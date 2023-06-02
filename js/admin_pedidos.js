let produtos;
$(document).ready(() => {
    $(".bx-menu").click(() => {
      $(".menu").toggleClass("open");
    });
    $("#request-header").css("marginTop", $("header").height() + "px");
    getAllUsers();
    
  });

  function getAllUsers(){
    $.ajax({
        type: "GET",
        url: "../php/user.php",
        data: {'request_type': 'readAll'},
        success: (response) => {
          if (response["status"]) {
            users = response["body"];
            fetchProducts();
          } else {
            users = undefined;
            $(".dashboard-link").hide();
          }
        },
        error: (response)=>{console.log(response);}
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
            writeRequest(pedidos);
        }else{
            
        }
        console.log(response);
      },
      error: (response) => {console.log(response)}
    });
}
function writeRequest(requestList) {
    $(".tb-open").html("");
    $(".tb-verified").html("");
    $(".tb-payed").html("");

    let openCount = verifiedCount = payedCount = 0;
  
    $.each(requestList, (key, value) => {
      let requestItem = $("<div>").attr("class", "request-item");
      let left = $("<div>").attr("class", "left");
  
      let status = $("<div>").attr("class", "status");
      let statusIndicator = $("<span>").attr("class", "status-indicator "+value['estado'].toLowerCase());
      let statusText = $("<span>").text(value["estado"]);
  
      status.append(statusIndicator);
      status.append(statusText);
      left.append(status);
  
  
      let shortDescription = $("<div>").attr("class", "short-description");
  
      let len = value['produtos'].length;
      console.log(len);
      let out = (len > 1)? 'Produtos': 'Produto';
      shortDescription.text(value['id'] + ': '+ len + ' ' +out);
  
      left.append(shortDescription);
      requestItem.append(left);
  
      
      let price = $("<div>").attr("class", "price");
      price.text(value['preco'] + ' Mzn');
      requestItem.append(price);
  
      

      if(value['estado'] == 'Aberto'){
        $(".tb-open").append(requestItem);
        openCount++;
        requestItem.click(() =>{
            showBill(value);
          });
      }else if(value['estado'] == 'Verificado'){
        $(".tb-verified").append(requestItem);
        verifiedCount++;
        requestItem.click(() =>{
          let usercode = prompt('Introduza o codigo do usuario para fechar a compra');
          if(usercode == value['uid']){
            $('.request-view-footer button').click(() => {
              $.ajax({
                type: 'POST',
                url: '../php/pedido.php',
                data: {'request_type': 'update', 'novo_estado': 'Pago', 'id': $value['id']},
                success: (response)=>{
                  getPedidos();
                }
              });
            });
          }else{
            alert('Codigo invalido');
          }
        });
      }else if(value['estado'] == 'Pago'){
        $(".tb-payed").append(requestItem);
        payedCount++;
      }
    });

    $('#open-count').text(openCount);
    $('#verified-count').text(verifiedCount);
    $('#payed-count').text(payedCount);

  }

  function showBill(request){
    $('.request-view .items').html("");
    $('.request-view').css('display', 'flex');
    $('.request-view .date').text('Pedido nº: ' +request['id']);
    $('.request-view .total-price').text(request['preco'] + ' Mzn');
    request['produtos'].forEach((value) =>{
      let mProduto = getProduct(value['pid']);
      let item = $('<div>');
      let htmlItem = `<div class='item'>
      <div class='left'>
        <span class='name'>${mProduto['nome']}</span>  x <item-quantity>${value['quantidade']}</item-quantity>
      </div> 
      <div class='price'>${value['preco']} Mzn</div>
    </div>`;
      item.html(htmlItem);
      $('.request-view .items').append(item);
    });
  
    if(request['estado'] == 'Cancelado' || request['Verificado'] == 'Verificado'){
      $('.request-view-footer button').hide();
      $('.request-view-footer').css('justifyContent', 'end');
    }else{
      $('.request-view-footer button').show();
      $('.request-view-footer').css('justifyContent', 'space-between');
    }
  
    $('.request-view-footer button').attr('id', request['id']);
    $('.request-view-footer button').click(() => {
      $.ajax({
        type: 'POST',
        url: '../php/pedido.php',
        data: {'request_type': 'update', 'novo_estado': 'Verificado', 'id': $('.request-view-footer button').attr('id')},
        success: (response)=>{
          getPedidos();
        }
      });
    });
  
  
    $('.request-view .bx-x').click(() => {$('.request-view').hide()});
  
  }

  function getProduct(id) {
    let produto;
  
    $.each(products, (key, value) => {
      if (value["id"] == id) {
        produto = value;
      }
    });
  
    return produto;
  }

  function fetchProducts() {
    $.ajax({
      type: "POST",
      url: "../php/produto.php",
      data: { request_type: "read" },
      success: (response) => {
        products = response;
        getPedidos();
      },
    });
  }