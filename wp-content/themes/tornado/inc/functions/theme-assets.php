<?php 
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //======== Register CSS Files ========//
    function tornado_css() {
        //=== RTL CSS ===//
        if ( is_rtl() ) {
            wp_enqueue_style('tornado-rtl', get_template_directory_uri() . '/dist/css/tornado-rtl.css', false , NULL , 'all'); 
        } 
        //=== LTR CSS ===//
        else { wp_enqueue_style('tornado', get_template_directory_uri() . '/dist/css/tornado.css', false , NULL , 'all'); }
    };

    //======== Register Javascript Files ========//
    function tornado_js() {
        // Include Tornado JS File
        wp_enqueue_script('tornado_js', get_template_directory_uri() . '/dist/js/tornado.min.js', false , NULL , true);
    };

    //==== Run Assets Files By Hooks ====//
    add_action ('enqueue_block_assets','tornado_css');
    add_action ('enqueue_block_assets','tornado_js');

    //===== Customizer Design CSS =====//
    function tornado_customizer_stylesheet() {
        wp_register_style( 'my-customizer-css', get_template_directory_uri() . '/dist/css/customizer.css', NULL, NULL, 'all' );
        wp_enqueue_style( 'my-customizer-css' );
    }

    add_action('customize_controls_print_styles', 'tornado_customizer_stylesheet' );

    //==== Gutenberg Assets ====//
    function gutenberg_tornado() {
        // Include Blocks JS
        wp_enqueue_script('tornado_admin_js', get_template_directory_uri() . '/dist/js/blocks.min.js' , array( 'wp-blocks', 'wp-element' ) , NULL , true);
        // Include Blocks CSS
        wp_enqueue_style('tornado_admin_css', get_template_directory_uri() . '/dist/css/gutenburg.css', false , NULL , 'all');
    }

    //==== Hook Gutenberg assets ====//
    add_action( 'enqueue_block_editor_assets', 'gutenberg_tornado' );
?>