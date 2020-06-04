<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //=========== Theme Customizer ===========//
    function tornado_meta_options($wp_customize) {
        //=========== Create Meta Section ===========//
        $wp_customize->add_section('metaseo_options' , array(
            'title'       => __('Meta Tags Options'),
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
            'label'      => __('SEO Keywords', 'tornado'),
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
                'label'      => __('Open Graph Cover', 'tornado'),
                'section'    => 'metaseo_options',
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
            'label'      => __('Footer Copyrights', 'tornado'),
            'section'    => 'metaseo_options',
            'settings'   => 'theme_copyright',
            'priority'   => 21
        ));

        //===== Meta Options [Copyrights] =====//
        $wp_customize->add_setting('theme_copyright_rtl' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('theme_copyright_rtl',array(
            'label'      => __('RTL Footer Copyrights ', 'tornado'),
            'section'    => 'metaseo_options',
            'settings'   => 'theme_copyright_en',
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

        } elseif ($option == 'theme-copyright-rtl') {
            //===== Meta Options [Copyrights] Output =====//
            return get_option('theme_copyright_rtl');
        }
    }
?>