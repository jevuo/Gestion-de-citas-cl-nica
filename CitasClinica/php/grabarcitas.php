<?php

require_once "connection.php";

$dni = htmlspecialchars($_REQUEST['dni']);
$especialidad = htmlspecialchars($_REQUEST['espe']);
$medico = htmlspecialchars($_REQUEST['med']);
$fecha = htmlspecialchars($_REQUEST['fecha']);
$hora = htmlspecialchars($_REQUEST['hora']);


$jsondata = array();

try {
	$stmt = $pdo->prepare("INSERT INTO citas VALUES(NULL,?,?,?,?,?)");
	$stmt->execute([$dni, $especialidad, $medico,$fecha,$hora]);
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

error_reporting(E_ALL);
ini_set('display_errors', '1');
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$dbserver = "localhost";
$dbuser = "root";
$password = "";
$dbname = "clinica";


$dni = $_REQUEST['dni'];
$especialidad = $_REQUEST['espe'];
$medico = $_REQUEST['medico'];
$fecha = $_REQUEST['fecha'];
$hora = $_REQUEST['hora'];

$insertar = "INSERT INTO citas VALUES(NULL,'$dni',$especialidad,$medico,'$fecha','$hora')";
;

$clinicaDB = new mysqli($dbserver, $dbuser, $password, $dbname);
$clinicaDB->query($insertar);

$clinicaDB->close();

exit();