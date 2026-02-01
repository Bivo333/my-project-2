<?php
// ==========================================
// НАСТРОЙКИ (ВАШИ ДАННЫЕ УЖЕ ВСТАВЛЕНЫ)
// ==========================================
$token = "8562372197:AAExSEMR-Ff8X35tU4-j9YbTrv-zSryWPXc"; 
$chat_id = "-5035486829"; 
$admin_email = "moslistva@yandex.ru";

// ==========================================
// ОБРАБОТКА ДАННЫХ ИЗ ФОРМЫ
// ==========================================
// Получаем данные и очищаем их от лишних пробелов и тегов
$name = strip_tags(trim($_POST['name'] ?? 'Не указано'));
$phone = strip_tags(trim($_POST['phone'] ?? 'Не указано'));
$subject = strip_tags(trim($_POST['subject'] ?? 'Заявка с сайта'));

// Подготовка ссылки для кнопки вызова (только цифры и плюс)
$phone_link = preg_replace('/[^0-9+]/', '', $phone);

// Формируем красивый текст для Telegram
$txt = "<b>🚀 Новая заявка с Moslistva.ru</b>%0A%0A";
$txt .= "<b>📦 Тема:</b> " . $subject . "%0A";
$txt .= "<b>👤 Имя:</b> " . $name . "%0A";
$txt .= "<b>📞 Тел:</b> <code>" . $phone . "</code>";

// Создаем кнопку «Позвонить» под сообщением
$keyboard = json_encode([
    'inline_keyboard' => [
        [
            ['text' => '📞 Позвонить клиенту', 'url' => 'tel:' . $phone_link]
        ]
    ]
]);

// ==========================================
// ОТПРАВКА В TELEGRAM
// ==========================================
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.telegram.org/bot{$token}/sendMessage");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    'chat_id' => $chat_id,
    'parse_mode' => 'html',
    'text' => urldecode($txt),
    'reply_markup' => $keyboard
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);

// ==========================================
// ОТПРАВКА НА ПОЧТУ (РЕЗЕРВ)
// ==========================================
$mail_body = "Новая заявка на сайте:\n\n";
$mail_body .= "Тема: $subject\n";
$mail_body .= "Имя: $name\n";
$mail_body .= "Телефон: $phone\n";

$headers = "From: info@moslistva.ru\r\n";
$headers .= "Content-Type: text/plain; charset=utf-8\r\n";

@mail($admin_email, "Заявка: $subject", $mail_body, $headers);

// Отдаем ответ скрипту на сайте
if ($result) {
    echo "success";
} else {
    echo "error";
}
?>