<?php

require_once "connection.php";

$dni=htmlspecialchars($_REQUEST['dni']);

$jsondata = array();

try {
	$stmt = $pdo->prepare("SELECT medicos.apellidosNombre as medico,especialidades.descripcion as especialidad, citas.idCitas, citas.fecha, citas.hora FROM citas, medicos, especialidades where citas.idEspecialidad=especialidades.idEspecialidad and medicos.idMedico=citas.idMedico  and citas.dni=?");
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

