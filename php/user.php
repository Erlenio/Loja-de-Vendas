<?php

    $connection;
    $login_status;

    
    session_start();

    if(isset($_GET['request_type'])){
        if($_GET['request_type'] == 'readAll'){
            $connection = new PDO("mysql:host=localhost;dbname=estore", "root", "");
            $user = $connection -> query("SELECT * FROM user") -> fetchAll();
            
    
            $response = array(
                "status" => true,
                "body" => $user
            );
    
            // Definir o cabeçalho da resposta como JSON
            header('Content-Type: application/json');
    
            $json = json_encode($response);
    
            echo $json;
        }else{
            echo 'dump';
        }
    }else{

        //Virificar se o usuario esta conectado
        if(isset($_SESSION['loged'])){
            if($_SESSION['loged']){

                //Conertar a base de dados
                $connection = new PDO("mysql:host=localhost;dbname=estore", "root", "");
        
                //Buscar o ID do usuario        
                $id = $_SESSION['uid'];
        
                //Carregar dados do usuario na BD
                $user = $connection -> query("SELECT * FROM user WHERE uid = $id") -> fetchAll();
        
                $login_status = true; 
        
                $response = array(
                    "status" => true,
                    "body" => $user
                );
        
                // Definir o cabeçalho da resposta como JSON
                header('Content-Type: application/json');
        
                $json = json_encode($response);
        
                echo $json;
            }else{
                $login_status = false;
                $response = array(
                    "status" => false,
                    "body" => "Usuário não conectado"
                );
        
                // Definir o cabeçalho da resposta como JSON
                header('Content-Type: application/json');
                $json = json_encode($response);
        
                echo $json;
            }
        }else{
            $login_status = false;
                $response = array(
                    "status" => false,
                    "body" => "Usuário não conectado"
                );

                // Definir o cabeçalho da resposta como JSON
                header('Content-Type: application/json');
                $json = json_encode($response);
        
                echo $json;
            
        }

    }
?>
