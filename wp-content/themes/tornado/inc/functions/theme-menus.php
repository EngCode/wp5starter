<?php 
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;

    //======== Register Menu's Locations ========//
    function tornado_menus() {
        register_nav_menus( array(
            'main-menu' => 'Header Main Menu',
            'sidebar-menu' => 'Sidebar Menu',
        ));
    };

    //==== Active Menu's Location's ====//
    add_action('init','tornado_menus'); 
    
    //======== Menu's Custom Structure ========//
    function menus_structure() {
        //===== Main Menu ===== //
        wp_nav_menu(array(
            'menu_class' => false,
            'container' => false,
            'container_class' => false,
            'theme_location' => 'main-menu',
        ));
        //===== Sidebar Menu ===== //
        wp_nav_menu(array(
            'menu_class' => false,
            'container' => false,
            'container_class' => false,
            'theme_location' => 'sidebar-menu',
        ));
    };
?>