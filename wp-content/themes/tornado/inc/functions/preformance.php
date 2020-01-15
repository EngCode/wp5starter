<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;

    //======== Clean Scripts Attribute ======//
    add_filter('style_loader_tag', 'remove_type_attr', 10, 2);
    add_filter('script_loader_tag', 'remove_type_attr', 10, 2);
    function remove_type_attr($tag, $handle) {
        return preg_replace( "/type=['\"]text\/(javascript|css)['\"]/", '', $tag );
    }

    //======== Clean Default Head Tag Files for Preformance and Security ========//
    remove_action('wp_head', 'rsd_link'); // Removing (RSD) Link [Remove it if integrate services like flicker exists]
    remove_action('wp_head', 'wlwmanifest_link'); // Removing "Windows Live Writer" link for Editing Shortcut
    remove_action('wp_head', 'wp_generator'); // Remove "WordPress version" tag
    add_filter('the_generator', '__return_false'); // hide WordPress version from RSS
    add_filter('feed_links_show_comments_feed', '__return_false'); // Remove RSS Feed for Comments
    add_filter( 'use_default_gallery_style', '__return_false' ); // Remove Gallery Inline Styling

    //====== Remove Emoji Scripts and Styles ======//
    remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
    remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
    remove_action( 'wp_print_styles', 'print_emoji_styles' );
    remove_action( 'admin_print_styles', 'print_emoji_styles' );

    //====== Remove WP Embed Scripts ======// 
    //===> Note : embeding WordPress posts from other people's blogs/websites.
    remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
    add_action( 'wp_footer','deregister_wp_embed');
    function deregister_wp_embed() { wp_deregister_script( 'wp-embed' ); }

    //====== Remove Gutenberg Default CSS ======// 
    function wps_deregister_blocks() { wp_dequeue_style( 'wp-block-library' ); }
    add_action( 'wp_print_styles', 'wps_deregister_blocks', 100 );

    //====== Remove Comments Default CSS ======//
    function remove_recent_comments_style() {
        global $wp_widget_factory;
        remove_action('wp_head', array($wp_widget_factory->widgets['WP_Widget_Recent_Comments'], 'recent_comments_style'));
    }
    add_action('widgets_init', 'remove_recent_comments_style');

    //====== Removing Rich Content inline Styles ======//
    add_filter('the_content', function( $content ){
        $content = preg_replace('/ style=("|\')(.*?)("|\')/','',$content);
        return $content;
    }, 20);
    
    //====== Disable asset versioning ======//
    function remove_query_strings() {
        if(!is_admin()) {
            add_filter('script_loader_src', 'remove_query_strings_split', 15);
            add_filter('style_loader_src', 'remove_query_strings_split', 15);
        }
     }
     
    function remove_query_strings_split($src){
        $output = preg_split("/(&ver|\?ver)/", $src);
        return $output[0];
     }

    add_action('init', 'remove_query_strings');

    //======= Remove Admin Bar Inline CSS =======//
    add_action('get_header', 'remove_admin_login_header');
    function remove_admin_login_header() {
        remove_action('wp_head', '_admin_bar_bump_cb');
    }
?>