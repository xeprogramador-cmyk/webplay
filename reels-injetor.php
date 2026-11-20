<?php
/* REELS INJETOR — serve o index.html EXATAMENTE como está, só acrescentando
   uma linha (o reels-loader.js) antes de </body>. O index.html (96) nunca é editado.
   Para ligar: ver o .htaccess (RewriteRule abaixo). Para desligar: apague a regra. */
header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: no-cache');
$ficheiro = __DIR__ . '/index.html';
if (!is_file($ficheiro)) { http_response_code(404); exit('index.html não encontrado'); }
$html = file_get_contents($ficheiro);
$tag  = '<script src="reels-loader.js?v=' . @filemtime(__DIR__ . '/reels-loader.js') . '"></script>';
$pos  = strripos($html, '</body>');
echo ($pos !== false) ? substr($html, 0, $pos) . $tag . "\n" . substr($html, $pos) : $html . $tag;
