<?php
    /**
     * Theme Customizer Panel => Section Functions
     * $wp_customize->add_section();
     * $wp_customize->get_section();
     * $wp_customize->remove_section();
     * ********************************
     * Theme Customizer ==> Section => Controls Functions
     * $wp_customize->add_control();
     * $wp_customize->get_control();
     * $wp_customize->remove_control();
     * ********************************
     * Theme Customizer Section ==> Controls => Settings Functions
     * $wp_customize->add_setting();
     * $wp_customize->get_setting();
     * $wp_customize->remove_setting();
     * ******************************
     * Core Section's ID's
     *  title_tagline - Site Identity 
     *  colors - Colors
     *  nav_menus - Menus
     *  widgets - Widgets
     *  static_front_page - Home Page
     * *****************************
     * Controls Validation Options
     * 'sanitize_callback' => 'wp_filter_nohtml_kses', // No  HTML Content
     * 'sanitize_callback' => 'sanitize_email',  // Email Validation
     * 'sanitize_callback' => 'chkbox_sanitization', // Checkbox's Validation
     * 'sanitize_callback' => 'sanitize_hex_color', // Colors Validation
     * 'sanitize_callback' => 'sanitize_text_field', // Text Validation
    */
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;

    //=========== Default Customizer Change ===========//
    function tornado_customizer($wp_customize) {
        //=========== Core Section's Rename ===========//
        $wp_customize->get_section( 'title_tagline' )->title = __('Design Options', 'tornado'); // Rename The Identity Section
        // Hide Home Page Change Section
        $wp_customize->get_section( 'static_front_page' )->active_callback = 'is_front_page';
        // Rename Site icon Control
        $wp_customize->get_control( 'site_icon' )->label = 'Fevicon/Site Icon';
        $wp_customize->get_control( 'site_icon' )->priority = 1;
        $wp_customize->get_control( 'site_icon' )->description = esc_html__( 'Site Icons size should be square like 512×512 pixels.', 'tornado' );
    }

    add_action('customize_register', 'tornado_customizer');

    //==== Customizer Meta Options ====//
    include( dirname(__FILE__) . '/theme-customizer/meta-seo-options.php' );
    //==== Customizer Design Options ====//
    include( dirname(__FILE__) . '/theme-customizer/design-options.php' );
    //==== Default Settings ====//
    include( dirname(__FILE__) . '/theme-customizer/default-settings.php' );
?>