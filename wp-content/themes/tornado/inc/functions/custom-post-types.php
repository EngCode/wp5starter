<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;

    //======== Docementation Post Type ========//
    function docementation_cpt() {
        //===== CPT Labels ====//
        $labels = array(
            'name'                => __( 'docementation', 'tornado'),
            'singular_name'       => __( 'docementation', 'tornado'),
            'menu_name'           => __( 'docementation', 'tornado'),
            'all_items'           => __( 'All Posts', 'tornado'),
            'view_item'           => __( 'View', 'tornado'),
            'add_new_item'        => __( 'Add Docement', 'tornado'),
            'add_new'             => __( 'Add Docement', 'tornado'),
            'edit_item'           => __( 'Edit', 'tornado'),
            'update_item'         => __( 'Update', 'tornado'),
            'search_items'        => __( 'Search in Posts', 'tornado'),
            'not_found'           => __( 'No Posts Found', 'tornado'),
            'not_found_in_trash'  => __( 'No Posts Found', 'tornado'),
        );
        //===== CPT Arguments ====//
        $args = array(
            'labels' => $labels,
            'rewrite' => array('slug' => 'docementation'),
            'menu_icon' => 'dashicons-sos',
            'supports' => array( 'title', 'editor' , 'excerpt', 'author', 'thumbnail', 'revisions'),
            'public' => true,
            'query_var' => true,
            'has_archive' => true,
            'hierarchical' => false,
            'menu_position' => 3,
            'can_export' => true,
            'show_in_rest'  => true,
            'show_in_nav_menus'  => true,
            'exclude_from_search' => false,
            'taxonomies' => array('docementation-categories'),
        );

        register_post_type('docementation', $args);
    }
    //==== Hooking The Custom Post Type ====//
    add_action( 'init', 'docementation_cpt' );

    //======== docementation Categories ========//
	function docs_categories() {
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
	add_action( 'init', 'docs_categories', 0 );
?>