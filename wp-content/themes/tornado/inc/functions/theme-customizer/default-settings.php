<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;

    //=== Set the Default Settings ===//
    function customizer_defaults(){
        //=== Default Meta Tags Settings ===//
        update_option('site_keywords', __('tornado,wp5,keywords,goes,here,for,this,web,site,its,!important,and,keep,it,dynamic', 'tornado') );
        update_option('og_cover', get_template_directory_uri() . '/screenshot.png' );
        update_option('theme_copyright', __('جميع الحقوق محفوظة لشركة المها كود للتسويق الالكتروني والبرمجيات', 'tornado') );
        update_option('facebook_url', ('https://facebook.com') );
        update_option('twitter_url', ('https://twitter.com') );
        update_option('instagram_url', ('https://instagram.com') );
        //===== Default Design Options =====//
        update_option('logo', get_template_directory_uri() . '/dist/img/logo.png' );
        update_option('logo_rtl', get_template_directory_uri() . '/dist/img/logo-rtl.png' );
        update_option('primary_color','#4A8ECC');
        update_option('primary_hvr_color','#2B9BFF');
        update_option('secondary_color','#EB5445');
        update_option('secondary_hvr_color','#D34436');
        //===== Default Design Options =====//
        update_option('phone_number','00201093678012');
        update_option('phone_number_2nd','00201007717914');
        update_option('mc_email','sales@mahacode.com');
        update_option('mc_email_2nd','info@mahacode.com');
        update_option('mc_address',__('9 شارع ابو بكر الصديق , ارض الحريه, بني سويف , مصر', 'tornado') );
    }

    add_action('after_switch_theme', 'customizer_defaults');

    //=== Checkbox Validation ===//
    function chkbox_sanitization( $input ) {
        if ( true === $input ) { return 1;
        } else { return 0; }
     }
?>