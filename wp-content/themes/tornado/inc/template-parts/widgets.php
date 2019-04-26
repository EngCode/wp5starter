<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //======== Register Theme Sidebars ========//
    function tornado_sidebars() {
        //====== Tornado Sidebar ======//
        register_sidebar(array(
            'name'          => __( 'Tornado Sidebar', 'tornado' ),
            'id'            => 'tornado-sidebar',
            'description'   => __( 'Drag the Widget to Show in Tornado Sidebar', 'tornado-wp' ),
        ));
    }
    //====== Run Register Sidebars ======//
    add_action( 'widgets_init', 'tornado_sidebars' );

    //======= Blog Categories =======//
    include( dirname(__FILE__) . '/widgets/blog-categories.php' );
    //======= Lateast Blogs =======//
    include( dirname(__FILE__) . '/widgets/lateast-blogs.php' );
    //======= Blog Search =======//
    include( dirname(__FILE__) . '/widgets/blog-search.php' );
?>