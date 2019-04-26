<?php
/**
 * Template Name: Blog Category
 * this template for displaying category, tag, taxonomy, author, or date
 * @package Tornado Wordpress
 * @subpackage Developing Starter Template
 * @since Tornado UI Starter 1.0
*/
//======= Exit if Try to Access Directly =======//
defined('ABSPATH') || exit;
?>

<!-- Head Tag -->
<?php get_header(); ?>
<!-- Header -->
<?php get_template_part('inc/template-parts/custom','header'); ?>
<!-- Dynamic Page Head & Breadcumbs -->
<?php get_template_part('inc/template-parts/custom','breadcumb'); ?>

<!-- Page Content -->
<div class="container page-content">
    <!-- Grid -->
    <div class="row row-reverse">
        <!-- Content Side -->
        <div class="col-12 col-m-8 col-l-9">
            <?php 
                if (have_posts()) : 
                    global $wp_query;
                    //===== Start Loop =====//
                    while (have_posts()) : the_post(); 
                    //=== Get the Design Part ===//
                    get_template_part('inc/template-parts/blocks/classic','post');
                    //==== End Loop =====//
                    endwhile;
                    //=== Pagination ===//
                    if (function_exists("pagination")) { pagination($wp_query); };
                    wp_reset_postdata();
                    //==== if have no Posts ====//
                    else : echo '<div class="alert info">' . __( 'Sorry no Posts Have been Found.','tornado' ) . '</div>';
                //==== End Query =====//
                endif; 
            ?>
        </div>
        <!-- Widgets Side -->
        <?php get_sidebar('blog-sidebar'); ?>
    </div>
    <!-- // Grid -->
</div>
<!-- // Page Content -->

<!-- Custom Footer --> 
<?php get_template_part('inc/template-parts/custom','footer'); ?>
<!-- Footer -->
<?php get_footer(); ?> 