<?php
    /**
     * Tornado Theme Custom Options Pages
     * @package Tornado Wordpress
     * Creating Custom Options for Easy Theme and Design Control.
     * 
     * ========> Reference by Comments <=======
     * 00 - Pages Render Functions Files
     * 01 - Global Theme Options
     * 02 - Theme Menus Options
     * 
    */

    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    
    //========> Pages Render Functions Files <=======//
    include( dirname(__FILE__) . '/admin/global-options.php' );

    function tornado_options_pages () {
        //========> Global Theme Options <=======//
        add_menu_page(
            pll__('Theme Options - Global Options', 'tornado'), //===> Page Title
            pll__('Theme Options', 'tornado'), //===> Menu Item
            'manage_options',                 //===> Capability
            'theme-options',                 //===> Menu Slug
            'tornado_global_options',       //===> Page Render Function
            get_template_directory_uri() . '/inc/template-parts/admin/img/menu-icon.png', //===> Menu Icon Path
            59 //===> Menu Position
        
        );

        //========> Theme Menus Options <=======//
        add_submenu_page (
            'theme-options',
            pll__('Menus Settings', 'tornado' ),
            pll__('Menus Settings', 'tornado' ),
            'manage_options',
            'nav-menus.php',
            '',
            'dashicons-menu',1
        );
    }

    add_action( 'admin_menu', 'tornado_options_pages');
?>