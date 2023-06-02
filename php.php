<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Verifique se o arquivo foi enviado corretamente
  if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileTmpPath = $_FILES['image']['tmp_name'];
    $fileName = $_FILES['image']['name'];
    $fileSize = $_FILES['image']['size'];
    $fileType = $_FILES['image']['type'];

    // Pasta onde a imagem será salva
    $targetDirectory = "./images/produto/";

    // Gere um nome único para a imagem (opcional)
    $newFileName = gerarNumero().'.'. explode('.',$fileName)[1];

    // Crie o caminho completo para a imagem
    $targetFilePath = $targetDirectory . $newFileName;

    // Mova o arquivo temporário para o destino final
    if (move_uploaded_file($fileTmpPath, $targetFilePath)) {
      echo $targetFilePath;
    } else {
      echo "Erro ao realizar o upload da imagem.";
    }
  }
}

function gerarNumero()
{
    $numero = "12" . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9) . rand(0, 9);

    
    return $numero;
}

?>