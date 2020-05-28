<?php

require_once "connection.php";

$cita=htmlspecialchars($_REQUEST['cita']);

$jsondata = array();

try {
	$stmt = $pdo->prepare("DELETE FROM `citas` WHERE `idCitas`=?");
	$stmt->execute([$cita]);
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

