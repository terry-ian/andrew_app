<?php
function send_mail($to, $subject, $body){
  // 簡易寄信：優先使用 PHP mail()。若主機未啟用，請改用 SMTP 函式庫（PHPMailer）。
  $headers = "From: no-reply@yourdomain.com\r\n".
             "Content-Type: text/plain; charset=UTF-8\r\n";
  @mail($to, $subject, $body, $headers);
}
