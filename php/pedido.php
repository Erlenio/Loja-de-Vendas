<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $db = new PDO('mysql:host=localhost;dbname=estore', 'root', '');

    
        
            

            if(isset($_POST['request_type'])){

                if($_POST['request_type'] == 'read'){
                    getPedidos($db);
                }elseif($_POST['request_type'] == 'write'){
                    guardarPedido($db);
                }elseif($_POST['request_type'] == 'update'){
                    updatePedido($db);
                }elseif($_POST['request_type'] == 'readAll'){
                    getPedidos($db, true);
                }

            }else{
                echo 'request ype not found';
            }
}

function updatePedido($db){
    $id =  $_POST['id'];
    $estado =  $_POST['novo_estado'];
    if($estado == 'Verificado'){

        
        
    }
    $query = $db -> prepare('UPDATE PEDIDO SET estado = :newState WHERE id = :id');

    $query -> bindParam(':id', $id);
    $query -> bindParam(':newState', $estado);
    $query -> execute();

        if($query){
            
            echo 'sucesso';
        }else{
            echo 'error';
        }
}
    



function getPedidos($db, $readAll = false){

    

    if($readAll){
        $pedidos = $db -> query("SELECT * FROM PEDIDO") -> fetchAll();
    }else{
        $uid = $_POST['uid'];
        $pedidos = $db -> query("SELECT * FROM PEDIDO WHERE uid = '$uid'") -> fetchAll();
    }

    

    

    if($pedidos){

        $output = [];

        

        header('Content-Type: application/json');

        foreach($pedidos as $pedido){
            $mArray = array(
                'id' => $pedido['id'],
                'uid' => $pedido['uid'],
                'data' => $pedido['data'],
                'preco' => $pedido['preco'],
                'estado' => $pedido['estado'],
                'produtos' => json_decode($pedido['produtos'])  
            );

            array_push($output, $mArray);
        }

        $response  = array(
            'status' => true,
            'body' => $output
        );

        echo json_encode($response);
    }else{
        echo 'error';
    }
    

       
}

function guardarPedido($db){

    $pedidos = $db -> query('SELECT id From PEDIDO') -> fetchAll();

    if ($pedidos || count($pedidos) == 0) {
        $uid = $_POST['uid'];
        $preco = $_POST['preco'];
        $estado = $_POST['estado'];
        $produtos = $_POST['produtos'];
        $cartIds = $_POST['cartIds'];
        $json = json_encode($produtos);

        $id = gerarNumero($pedidos);

        $insert_Query = $db->query("INSERT INTO pedido (id, uid, preco, estado, produtos) VALUES('$id', '$uid', '$preco', '$estado', '$json')");

        if ($insert_Query) {

            foreach ($cartIds as $value) {

                // Prepare the query
                $query = $db->prepare("DELETE FROM CART WHERE id = :cartId");

                // Bind the parameter
                $query->bindParam(":cartId", $value);

                // Execute the query
                $query->execute();
            }

            echo "sucesso";
        }
    } else {
        echo 'error';
    }
}

function gerarNumero($lista)
{
    $numero = "14" . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);

    for ($i = 0; $i < sizeof($lista); $i++) {
        if ($lista[$i]["id"] == $numero) {
            return gerarNumero($lista);
        }
    }

    return $numero;
}

?>