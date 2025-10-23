<?php
class CardTxnService {
  public static function authorize($pdo,$cardId,$userId,$amount,$currency,$mcc){
    $pdo->beginTransaction();
    $pdo->prepare('INSERT INTO transactions(card_id,user_id,mcc,amount,currency,status,auth_at) VALUES(?,?,?,?,?,?,NOW())')
        ->execute([$cardId,$userId,$mcc,$amount,$currency,'authorized']);
    $txnId=$pdo->lastInsertId();
    $w=$pdo->prepare('SELECT * FROM wallets WHERE user_id=? AND currency=? FOR UPDATE');
    $w->execute([$userId,'USD']);
    $wallet=$w->fetch();
    if($wallet['available']<$amount){ $pdo->rollBack(); throw new Exception('Insufficient'); }
    $pdo->prepare('UPDATE wallets SET available=available-?, frozen=frozen+? WHERE id=?')
        ->execute([$amount,$amount,$wallet['id']]);
    $pdo->prepare('INSERT INTO journals(jtype,ref_id,description) VALUES("card_auth",?,?)')
        ->execute([$txnId,'auth hold']);
    $jid=$pdo->lastInsertId();
    $pdo->prepare('INSERT INTO ledger_entries(journal_id,wallet_id,entry_type,amount) VALUES(?,?,"credit",?)')
        ->execute([$jid,$wallet['id'],$amount]);
    $pdo->prepare('INSERT INTO ledger_entries(journal_id,wallet_id,entry_type,amount) VALUES(?,?,"debit",?)')
        ->execute([$jid,$wallet['id'],$amount]);
    $pdo->commit();
    return $txnId;
  }
}
