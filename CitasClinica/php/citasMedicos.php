<?php

require_once "connection.php";

$idMedico=htmlspecialchars($_REQUEST['idMedico']);
$fecha=htmlspecialchars($_REQUEST['fecha']);

$jsondata = array();

try {
	$stmt = $pdo->prepare("SELECT `hora` FROM citas WHERE `idMedico`=$idMedico AND `fecha`= '$fecha'");
	$stmt->execute([]);
	while ($row = $stmt->fetch()) {
        $jsondata["data"][] = $row;
    }
} catch (PDOException $e) {
	$jsondata["mensaje"][]="Error";
}

header('Content-type: application/json; charset=utf-8');
echo json_encode($jsondata);
$pdo=null;

exit();

