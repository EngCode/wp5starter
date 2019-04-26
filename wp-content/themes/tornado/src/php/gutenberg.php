<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    if (!defined('WPINC')) {die;}

    //==== Custom Block Categories ====//
    function tornado_categories( $categories, $post ) {
        return array_merge( $categories, array(
            //==== Tornado =====//
            array(
                'slug' => 'tornado',
                'title' => __( 'Tornado Blocks', 'tornado' ),
            ),
            //==== Cards =====//
            array(
                'slug' => 'tornado-cards',
                'title' => __( 'Tornado Cards', 'tornado' ),
            ),
        ));
    }

    add_filter( 'block_categories', 'tornado_categories', 10, 2);

    //==== Allowed Blocks for Docs ====//
    add_filter( 'allowed_block_types', 'docs_allowed_blocks' );
    function docs_allowed_blocks( $allowed_blocks ) {
        //====== Global ======//
        $allowed_blocks = array(
            'core/image',
            'core/paragraph',
            'core/audio',
            'core/cover',
            'core/video',
            'core/file',
            'core/table',
            'core/html',
            'core/shortcode',
            'core/embed',
            'core/youtube',
            'tornado/docs-paragraph',
            'tornado/docs-code',
        );

        //====== Return Block List ======//
        return $allowed_blocks;
    }
?>