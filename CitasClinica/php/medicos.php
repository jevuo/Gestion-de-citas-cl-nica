<?php
require_once "connection.php";

$espe=htmlspecialchars($_REQUEST['espe']);

$jsondata["data"] = array();

try {
	$stmt = $pdo->prepare("SELECT * FROM medicos where especialidad=?");
	$stmt->execute([$espe]);
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

 