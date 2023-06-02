var user;
var cartItems;
var products;
$(document).ready(() => {
  $(".bx-menu").click(() => {
    $(".menu").toggleClass("open");
  });
  $("#user-header").css("marginTop", $("header").height() + "px");

  $.ajax({
    type: "GET",
    url: "./php/user.php",
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
        fetchProducts();
      } else {
        user = undefined;
        $(".dashboard-link").hide();
        document.location.href = "login.html";
      }
      console.log(response);
    },
  });
});

function getCart() {
  $.ajax({
    type: "POST",
    url: "./php/cart.php",
    data: { request_type: "get" },
    success: (response) => {
      if (response["status"]) {
        cartItems = response.body;
        addItemsToCart();
        $('#cart-count').text(cartItems.length);
        if(cartItems.length <= 0){
          $(".cart-content").html("");
        }
      } else {
        $('#cart-count').text(0);
        $(".cart-content").html("");
        $(".tb-carrinho").addClass("empty");
      }
    },
  });
}

function fetchProducts() {
  $.ajax({
    type: "POST",
    url: "./php/produto.php",
    data: { request_type: "read" },
    success: (response) => {
      products = response;
      if (user == undefined) {
        $(".cart-footer").hide();
        $(".cart").addClass("empty");
      } else {
        $(".unloged").hide();
      }
      getCart();
      getPedidos();
    },
  });
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

function addItemsToCart() {
  $(".cart-content").html("");

  let total = 0;

  $.each(cartItems, (key, value) => {
    let product = getProduct(value["pid"]);

    if (product == undefined || product == null) {
      console.log(product);
      return;
    }

    var cartItem = $("<div>").attr("class", "cart-item");
    cartItem.attr("id", value["id"]);

    var left = $("<div>").attr("class", "left");

    var image = $("<img>");
    if (product["imagem"] == "default") {
      image.attr("src", "./images/e-store.jpg");
    } else {
      image.attr("src", product["image"]);
    }
    left.append(image);

    var center = $("<div>").attr("class", "center");

    var itemName = $("<div>").attr("class", "item-name");
    itemName.text(product["nome"]);
    center.append(itemName);

    var itemQuantity = $("<div>").attr("class", "quantity");

    var itemPrice = $("<span>").attr("class", "item-price");
    itemPrice.text(product["preco"] + " Mzn");

    itemQuantity.append(itemPrice);

    var x = $("<span>").attr("class", "x");
    x.text('x');


    itemQuantity.append(x);

    var quantityValue = $("<input>").attr("class", "qauntity-value");
    quantityValue.attr("type", "number");
    quantityValue.attr("max", 5);
    quantityValue.attr("min", 1);
    quantityValue.val(value["quantidade"]);
    itemQuantity.append(quantityValue);

    center.append(itemQuantity);
    left.append(center);

    let action = $("<div>").attr("class", "action");

    let remove = $("<i>").attr("class", "bx bx-x");

    remove.click(() => {
      $.ajax({
        type: 'POST',
        url: './php/cart.php',
        data: {'request_type': "drop", 'id': value['id']},
        success: (response) =>{
          if(response['status']){
            getCart();
          }
        }
      });
    });

    action.append(remove);


    var checkBox = $("<input>").attr("type", "checkbox");
    checkBox.attr("class", "check");
    checkBox.attr("checked", "true");
    checkBox.change(() => {
      updatePrice();
    });
    quantityValue.change(() => {
      updatePrice();
    });

    action.append(checkBox);

    cartItem.append(left);
    cartItem.append(action);

    total += product["preco"] * value["quantidade"];

    $(".cart-content").append(cartItem);
  });

  //$(".total").text(total + " Mzn");
  //updatePrice();
}

function updatePrice() {
  let items = document.querySelectorAll(".cart-item");

  let price = 0;

  items.forEach((element) => {
    if (element.querySelector(".check").checked) {
      price +=
        parseFloat(element.querySelector(".item-price").innerHTML) *
        parseInt(element.querySelector(".qauntity-value").value);
    }
  });

  $(".total").text(price + " Mzn");
}

let pedidos;

function getPedidos() {
  $.ajax({
    type: "POST",
    url: "./php/pedido.php",
    data: { request_type: "read", uid: user["uid"] },
    success: (response) => {
      if (response["status"] == true) {
        pedidos = response["body"];
        writeRequest(pedidos);
        console.log(pedidos);
        $('#request-count').text(pedidos.length);
      }else{
        $('#request-count').text(0);
      }
    },
  });
}

function writeRequest(requestList) {
  $(".tb-pedidos").html("");

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
    shortDescription.text(len + ' ' +out);

    left.append(shortDescription);
    requestItem.append(left);

    
    let price = $("<div>").attr("class", "price");
    price.text(value['preco'] + ' Mzn');
    requestItem.append(price);

    requestItem.click(() =>{
      showBill(value);
    });

    $(".tb-pedidos").append(requestItem);
  });
}

function showBill(request){
  $('.request-view .items').html("");
  $('.request-view').css('display', 'flex');
  $('.request-view .date').text(request['data']);
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

  if(request['estado'] == 'Cancelado' || request['verificado'] == 'Verificado'){
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
      url: './php/pedido.php',
      data: {'request_type': 'update', 'novo_estado': 'Cancelado', 'id': $('.request-view-footer button').attr('id')},
      success: (response)=>{
        console.log(response);
      }
    })
  });


  $('.request-view .bx-x').click(() => {$('.request-view').hide()});

}
