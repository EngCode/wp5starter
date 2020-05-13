<!-- H1 for SEO -->
<h1 class="hidden">
    <?php bloginfo('name'); ?> | 
    <?php if ( !is_home() && !is_front_page() ) { echo wp_title(); } else { echo bloginfo('description'); } ?>
</h1>
<?php
/**
 * this template repersent Breadcrumb design component
 * @package Tornado Wordpress
 * @subpackage Developing Starter Template
 * @since Tornado UI Starter 1.0
*/
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //======== Breadcrumb ========//
    if ( !is_home() && !is_front_page() ) {
        // <!-- Breadcrumb -->
        if ( function_exists('yoast_breadcrumb') ) { yoast_breadcrumb('<div class="breadcrumb">','</div>') ;}
    } 
?>