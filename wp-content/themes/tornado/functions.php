<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //======== Debug Mode ========//
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    //==== Setting Page ====//
    include( dirname(__FILE__) . '/inc/functions/theme-customizer.php' );

    //==== Custom Post Types ====//
    include( dirname(__FILE__) . '/inc/functions/custom-post-types.php' );

    //==== Assets Register ====//
    include( dirname(__FILE__) . '/inc/functions/theme-assets.php' );

    //==== Preformance Speed Cleanup ====//
    include( dirname(__FILE__) . '/inc/functions/preformance.php' );
    
    //==== Menus Register ====//
    include( dirname(__FILE__) . '/inc/functions/theme-menus.php' );

    //==== Theme Widgets Sidebars ====//
    include( dirname(__FILE__) . '/inc/template-parts/widgets.php' );

    //==== Editor Register ====//
    include( dirname(__FILE__) . '/src/php/gutenberg.php' );


    //======== Adding Theme Supports ========//
    function theme_support() {
        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'automatic-feed-links' );
        add_theme_support( 'html5', array( 'comment-list', 'comment-form', 'search-form', 'gallery', 'caption' ) );
        add_theme_support( 'customize-selective-refresh-widgets' );
        add_theme_support( 'align-wide' );
    }
    
    add_action( 'init', 'theme_support' );

    //===== Excrept Text Only =====//
    remove_filter( 'the_excerpt', 'wpautop' );

    //==== Stop Generating Image Sizes ====//
    function add_image_insert_override($sizes){
        unset( $sizes['thumbnail']);
        unset( $sizes['medium']);
        unset( $sizes['large']);
        return $sizes;
    }
    add_filter('intermediate_image_sizes_advanced', 'add_image_insert_override' );

    /*======= Thumbnails Link =======*/
    function thumbnail_link($placholder) {
        if ( has_post_thumbnail() ) {
            return the_post_thumbnail_url();
        } else {
            return $placholder;
        }
    }

    /*======= Get Category Name =======*/
    function get_category_name() {
        foreach((get_the_category()) as $category) { echo $category->cat_name . ' '; }
    }

    /*======= Pagination ========*/
    function pagination($query) {
        $pages = paginate_links( array(
            'base'         => str_replace( 999999999, '%#%', esc_url( get_pagenum_link( 999999999 ) ) ),
            'total'        => $query->max_num_pages,
            'current'      => max( 1, get_query_var( 'paged' ) ),
            'format'       => '?page=%#%',
            'show_all'     => false,
            'type'         => 'array',
            'end_size'     => 2,
            'mid_size'     => 1,
            'prev_next'    => true,
            'prev_text'    => sprintf( '<i></i> %1$s', __( 'الصفحة السابقة' ) ),
            'next_text'    => sprintf( '%1$s <i></i>', __( 'الصفحة التالية' ) ),
        ));

        if( is_array( $pages ) ) {
            echo '<ul class="pagination col-12">';
            foreach ( $pages as $page ) {
                if (strpos($page, 'current') !== false) {
                    $page = str_replace("span", "a", $page);
                    echo "<li class='active'>$page</li>";
                } else {
                    echo "<li>$page</li>";
                }
            }
            echo '</ul>';
        }
    }

    //======== Track Posts Views Counter ========//
    function getPostViews($postID){
        
        $count_key = 'post_views_count';
        $count = get_post_meta($postID, $count_key, true);
        if ($count=='') {
            delete_post_meta($postID, $count_key);
            add_post_meta($postID, $count_key, '0');
            return "0 ";
        }
        return $count . ' ';
    }

    //======== Set Posts Views Counter ========//
    function setPostViews($postID) {
        $count_key = 'post_views_count';
        $count = get_post_meta($postID, $count_key, true);
        if ($count=='') {
            $count = 0;
            delete_post_meta($postID, $count_key);
            add_post_meta($postID, $count_key, '0');
        } else {
            $count++;
            update_post_meta($postID, $count_key, $count);
        }
    }

    // Remove issues with prefetching adding extra views
    remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0);

    //====== Allow Blank Searchs ========//
    function SearchFilter($query) {
        // If 's' request variable is set but empty
        if (isset($_GET['s']) && empty($_GET['s']) && $query->is_main_query()){
            $query->is_search = true;
            $query->is_home = false;
        }
        return $query;
    }

    add_filter('pre_get_posts','SearchFilter');

    //====== Languages Path ======//
    function languages_install() {
        load_theme_textdomain( 'tornado', get_template_directory() . '/languages' );
    
        $locale = get_locale();
        $locale_file = get_template_directory() . "/languages/$locale.php";
    
        if ( is_readable( $locale_file ) ) {
            require_once( $locale_file );
        }
    }
    
    add_action( 'after_setup_theme', 'languages_install' );

    //===== Contact 7 Structure Edits =====//
    add_filter('wpcf7_form_elements', function($content) {
        $content = preg_replace('/<(span).*?class="\s*(?:.*\s)?wpcf7-form-control-wrap(?:\s[^"]+)?\s*"[^\>]*>(.*)<\/\1>/i', '\2', $content);
        return $content;
    });

    //======== Disable Contact 7 CSS/JS ========//
    add_filter( 'wpcf7_load_js', '__return_false' );
    add_filter( 'wpcf7_load_css', '__return_false' );

    //===== Contact 7 Dynamic Data Passing =====//
    add_filter( 'shortcode_atts_wpcf7', 'Order_Service_Input_Attribute', 10, 3 );
    function Order_Service_Input_Attribute( $out, $pairs, $atts ) {
        $my_attr = 'offer-title';
        if ( isset($atts[$my_attr]) ) { $out[$my_attr] = $atts[$my_attr]; }
        return $out;
    }

    //======== SVG Support ========//
    function add_file_types_to_uploads($file_types){
        $new_filetypes = array();
        $new_filetypes['svg'] = 'image/svg+xml';
        $file_types = array_merge($file_types, $new_filetypes );
        return $file_types;
    }
    add_action('upload_mimes', 'add_file_types_to_uploads');

    //======== SVG Support Alternative ========//
    function cc_mime_types($mimes) {
        $mimes['svg'] = 'image/svg+xml';
        return $mimes;
    }
    add_filter('upload_mimes', 'cc_mime_types');

    //========= Check Polylang ========//
    if (!function_exists('pll__')) {
        function pll__($string,$domain) {
           return __($string,$domain);
        }
    }

    //========= Admin Menu Oprimizer ========//
    function admin_menu_optimizer(){ 
        //====> Dashboard
        remove_menu_page( 'index.php' );
        //====> Posts
        remove_menu_page( 'edit.php' );
        //====> Media
        remove_menu_page( 'upload.php' );
        //====> Comments
        remove_menu_page( 'edit-comments.php' );
        //====> Appearance
        remove_menu_page( 'themes.php' );
        //=====> Add Menus
        add_menu_page(pll__('Menus Settings', 'tornado' ),'Menus Settings','manage_options','nav-menus.php','','dashicons-menu',20);
        add_menu_page(pll__('Theme Settings', 'tornado' ),'Theme Settings','manage_options','customize.php','','dashicons-admin-appearance',21);
        //====> Plugins
        remove_menu_page( 'plugins.php' );
        //====> Tools
        remove_menu_page( 'tools.php' );
        //====> Advanced Custom Fields
        remove_menu_page('edit.php?post_type=acf-field-group');        
    }

    // add_action( 'admin_menu', 'admin_menu_optimizer' );
?>