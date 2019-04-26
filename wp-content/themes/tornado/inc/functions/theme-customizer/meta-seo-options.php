<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //=========== Theme Customizer ===========//
    function tornado_meta_options($wp_customize) {
        //=========== Create Meta Section ===========//
        $wp_customize->add_section('metaseo_options' , array(
            'title'       => __('اعدادات الميتاتاجز'),
            'priority'    => 10,
        ));

        //===== Meta Options [Keywords] =====//
        $wp_customize->add_setting('site_keywords' , array(
            'default'     => '',
            'transport'   => 'postMessage',
            'type'        => 'option',
            'sanitize_callback' => 'wp_filter_nohtml_kses',
        ));

        $wp_customize->add_control('site_keywords',array(
            'label'      => __('الكلمات الدلاليه', 'mahacode'),
            'section'    => 'metaseo_options',
            'settings'   => 'site_keywords',
            'priority'   => 21
        ));

        //===== Meta Options [Open Graph Cover Image] =====//
        $wp_customize->add_setting('og_cover' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
        ));

        $wp_customize->add_control(new WP_Customize_Image_Control(
            $wp_customize,'og_cover',array(
                'label'      => __('صورة الاوبن جراف', 'mahacode'),
                'section'    => 'metaseo_options',
                'description'=> 'صورة الاوبن جراف للظهور عند مشاركة الموقع على السوشيال ميديا',
                'settings'   => 'og_cover',
                'priority'   => 21
            )
        ));

        //===== Meta Options [Copyrights] =====//
        $wp_customize->add_setting('theme_copyright' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('theme_copyright',array(
            'label'      => __('حقوق الموقع', 'mahacode'),
            'section'    => 'metaseo_options',
            'settings'   => 'theme_copyright',
            'priority'   => 21
        ));

        //===== Meta Options [facebook] =====//
        $wp_customize->add_setting('facebook_url' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('facebook_url',array(
            'label'      => __('رابط الفيس بوك', 'mahacode'),
            'section'    => 'metaseo_options',
            'settings'   => 'facebook_url',
            'priority'   => 21
        ));

        //===== Meta Options [twitter] =====//
        $wp_customize->add_setting('twitter_url' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('twitter_url',array(
            'label'      => __('رابط تويتر', 'mahacode'),
            'section'    => 'metaseo_options',
            'settings'   => 'twitter_url',
            'priority'   => 21
        ));

        //===== Meta Options [instagram] =====//
        $wp_customize->add_setting('instagram_url' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('instagram_url',array(
            'label'      => __('رابط انستاجرام', 'mahacode'),
            'section'    => 'metaseo_options',
            'settings'   => 'instagram_url',
            'priority'   => 21
        ));
    }
    add_action('customize_register', 'tornado_meta_options');

    //===== Meta Options Output =====//
    function get_meta_options($option) {
        if ($option == 'keywords') {
            //===== Meta Options [Keywords] Output =====//
            return get_option('site_keywords');

        } elseif ($option == 'og-cover') {
            //===== Meta Options [Open Graph Cover] Output =====//
            return get_option('og_cover');

        } elseif ($option == 'theme-copyright') {
            //===== Meta Options [Copyrights] Output =====//
            return get_option('theme_copyright');

        } elseif ($option == 'facebook_url') {
            //===== Meta Options [Github] Output =====//
            return get_option('facebook_url');

        } elseif ($option == 'twitter_url') {
            //===== Meta Options [Download] Output =====//
            return get_option('twitter_url');
            
        } elseif ($option == 'instagram_url') {
            //===== Meta Options [Download] Output =====//
            return get_option('instagram_url');
        }
    }
?>