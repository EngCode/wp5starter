<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;

    //======== Blog Post Type ========//
    function blog_cpt() {
        //===== CPT Labels ====//
        $labels = array(
            'name'                => __( 'post', 'tornado'),
            'singular_name'       => __( 'post', 'tornado'),
            'menu_name'           => __( 'Blog', 'tornado'),
            'all_items'           => __( 'All Blogs', 'tornado'),
            'view_item'           => __( 'View', 'tornado'),
            'add_new_item'        => __( 'Add Blog', 'tornado'),
            'add_new'             => __( 'Add Blog', 'tornado'),
            'edit_item'           => __( 'Edit', 'tornado'),
            'update_item'         => __( 'Update', 'tornado'),
            'search_items'        => __( 'Search in Posts', 'tornado'),
            'not_found'           => __( 'No Posts Found', 'tornado'),
            'not_found_in_trash'  => __( 'No Posts Found', 'tornado'),
        );
        //===== CPT Arguments ====//
        $args = array(
            'labels' => $labels,
            'rewrite' => array('slug' => 'post'),
            'menu_icon' => 'dashicons-format-aside',
            'supports' => array( 'title', 'editor' , 'excerpt', 'thumbnail', 'revisions'),
            'public' => true,
            'query_var' => true,
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => 3,
            'can_export' => true,
            'show_in_rest'  => true,
            'show_in_nav_menus'  => true,
            'exclude_from_search' => false,
            'taxonomies' => array('tag','category'),
        );

        register_post_type('post', $args);
    }
    // add_action( 'init', 'blog_cpt' );

    //======== Custom Taxonomy Example ========//
	function tax_name() {
		//===== Taxonomies Labels ====//
		$labels = array(
			'label'             => __( 'Categories', 'tornado'),
			'singular_name'     => __( 'docementation-categories', 'tornado'),
			'search_items'      => __( 'Search in Categories', 'tornado'),
			'all_items'         => __( 'All Categories', 'tornado'),
			'parent_item'       => __( 'Parent', 'tornado'),
			'parent_item_colon' => __( 'Parent:', 'tornado'),
			'edit_item'         => __( 'Edit', 'tornado'),
			'update_item'       => __( 'Update', 'tornado'),
			'add_new_item'      => __( 'Add New Category', 'tornado'),
			'new_item_name'     => __( 'Category Name', 'tornado'),
			'menu_name'         => __( 'Categories', 'tornado'),
		);
		//===== Taxonomies Arguments ====//
		$args = array(
			'hierarchical'      => true,
			'labels'            => $labels,
			'show_ui'           => true,
			'show_admin_column' => true,
			'show_in_rest'      => true,
			'show_in_nav_menus'  => true,
			'query_var'         => true,
			'rewrite'           => array( 'slug' => 'docementation-categories' ),
		);

		register_taxonomy( 'docementation-categories', array( 'docementation' ), $args );
	}
	//==== Hooking The Custom Taxonomies ====//
	// add_action( 'init', 'tax_name', 0 );
?>