<?php
require_once "connection.php";

$dni=htmlspecialchars($_REQUEST['dni']);

$jsondata["data"] = array();

try {
	$stmt = $pdo->prepare("SELECT * FROM pacientes where dni=?");
	$stmt->execute([$dni]);
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

