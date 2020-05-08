<?php
/**
 * إعدادات الووردبريس الأساسية
 *
 * عملية إنشاء الملف wp-config.php تستخدم هذا الملف أثناء التنصيب. لا يجب عليك
 * استخدام الموقع، يمكنك نسخ هذا الملف إلى "wp-config.php" وبعدها ملئ القيم المطلوبة.
 *
 * هذا الملف يحتوي على هذه الإعدادات:
 *
 * * إعدادات قاعدة البيانات
 * * مفاتيح الأمان
 * * بادئة جداول قاعدة البيانات
 * * المسار المطلق لمجلد الووردبريس
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** إعدادات قاعدة البيانات - يمكنك الحصول على هذه المعلومات من مستضيفك ** //

/** اسم قاعدة البيانات لووردبريس */
define( 'DB_NAME', 'tornado-starter' );

/** اسم مستخدم قاعدة البيانات */
define( 'DB_USER', 'root' );

/** كلمة مرور قاعدة البيانات */
define( 'DB_PASSWORD', '' );

/** عنوان خادم قاعدة البيانات */
define( 'DB_HOST', 'localhost' );

/** ترميز قاعدة البيانات */
define( 'DB_CHARSET', 'utf8mb4' );

/** نوع تجميع قاعدة البيانات. لا تغير هذا إن كنت غير متأكد */
define( 'DB_COLLATE', '' );

/**#@+
 * مفاتيح الأمان.
 *
 * استخدم الرابط التالي لتوليد المفاتيح {@link https://api.wordpress.org/secret-key/1.1/salt/}
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '~Of}H[)P$1?Wz1:AIY|f~aq0k2c(MPxV5ioURP5n]etAYUvom0[]ls?B.~!(HAuJ' );
define( 'SECURE_AUTH_KEY',  'x]&X0$xF-BH;hXI0[B,g4d(U=<hH$)5r d|Z,+UCwg`hyU|2<rW,|&#+Cm!,]-#0' );
define( 'LOGGED_IN_KEY',    '4].nez1TagrQhaMGOVj#:zm~3fS<-!ecUvGZxYPOP5AEP>E*_+CO2IFdks<(36S[' );
define( 'NONCE_KEY',        '9VCbuksna%=sz@+NL{H}w)xH;.nuN:6eNJj:7:(5(J~e4db:[W`r4@ZQ20$KG2HU' );
define( 'AUTH_SALT',        'ps{^!aB<b-XeoEm=&bA(yN6To<{VO>>A9{:@GZd/X@y*qlo-yS/^+i*IozWgXvW@' );
define( 'SECURE_AUTH_SALT', 'JiLcX$Fb(J_on&R~GOGfBE/QZY|V@2dBsa>5]%Lir<g:!</?es.^cEd!?vt+CMs!' );
define( 'LOGGED_IN_SALT',   'O}R.]8YNT$$>e3nV(tYRrG~q=:ra{B_`Zz(L61pmX~.4U_yx!T7j%-r3v[>/enfd' );
define( 'NONCE_SALT',       'hHs `2<Aew5k- ZP}-$t(]HZUL,.]x#A0p?IV.?h{ w%,=t9~Q<*rle;%dH(<e/A' );

/**#@-*/

/**
 * بادئة الجداول في قاعدة البيانات.
 *
 * تستطيع تركيب أكثر من موقع على نفس قاعدة البيانات إذا أعطيت لكل موقع بادئة جداول مختلفة
 * يرجى استخدام حروف، أرقام وخطوط سفلية فقط!
 */
$table_prefix = 'wp_';

/**
 * للمطورين: نظام تشخيص الأخطاء
 *
 * قم بتغييرالقيمة، إن أردت تمكين عرض الملاحظات والأخطاء أثناء التطوير.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', false );

/* هذا هو المطلوب، توقف عن التعديل! نتمنى لك التوفيق. */

/** المسار المطلق لمجلد ووردبريس. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );
}

/** إعداد متغيرات الووردبريس وتضمين الملفات. */
require_once( ABSPATH . 'wp-settings.php' );
