<?php
class DepositService {
  public static function createUsdtRequest($pdo,$userId,$amount){
    $rule=$pdo->query("SELECT * FROM deposit_rules WHERE method='usdt_trc20' AND active=1 ORDER BY id DESC LIMIT 1")->fetch();
    if(!$rule) throw new Exception('Deposit disabled');
    if($amount<$rule['min_amount'] || $amount>$rule['max_amount']) throw new Exception('Out of limits');
    $fee = round($amount * $rule['fee_percent'], 6);
    $net = $amount - $fee;
    $pdo->beginTransaction();
    $pdo->prepare('INSERT INTO deposit_requests(user_id,method,amount,fee_amount,net_amount) VALUES(?,?,?,?,?)')
        ->execute([$userId,'usdt_trc20',$amount,$fee,$net]);
    $reqId=$pdo->lastInsertId();
    $address = 'T'.bin2hex(random_bytes(16)); // placeholder
    $pdo->prepare('INSERT INTO deposit_usdt_trc20(deposit_request_id,address,required_confirmations) VALUES(?,?,?)')
        ->execute([$reqId,$address,20]);
    $pdo->commit();
    return [$reqId,$address,$rule['eta_minutes']];
  }
}
