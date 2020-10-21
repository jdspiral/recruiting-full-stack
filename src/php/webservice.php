<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents(__DIR__ . '/../data/testdata.json'));

if($_SERVER['REQUEST_METHOD'] == "POST") {
  $entityBody = json_decode(file_get_contents('php://input'), true);
  if (isset($entityBody['collapsed'])) {
    foreach ($data->nodes as $node) {
      if ($node->id === $entityBody['id']) {
        $node->collapsed = !$node->collapsed;
        $data->nodes[$node->id] = $node;
      }

      $json = json_encode($data);
      file_put_contents(__DIR__ . '/../data/testdata.json', $json);
    }
  } else if (isset($entityBody['name'])) {
    $data->settings[0]->value = !$data->settings[0]->value;
    $json = json_encode($data);
    file_put_contents(__DIR__ . '/../data/testdata.json', $json);
  }
}

echo json_encode($data);
