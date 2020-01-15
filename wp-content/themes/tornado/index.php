<?php
/**
 * Template Name: Home Page
 * this template reprsent the Home Page
 * @package Tornado Wordpress
 * @subpackage Developing Starter Template
 * @since Tornado UI Starter 1.0
*/
?>

<!-- Head Tag -->
<?php get_header(); ?>
<!-- Header -->
<?php get_template_part('inc/template-parts/custom','header'); ?>
<!-- H1 for SEO -->
<h1 class="hidden">
    <?php bloginfo('name'); ?> | 
    <?php if ( !is_home() && !is_front_page() ) { echo wp_title(); } else { echo bloginfo('description'); } ?>
</h1>

<!-- Page Content -->
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <?php the_content(); ?>
<?php endwhile; endif; ?>

<!-- Custom Footer --> 
<?php get_template_part('inc/template-parts/custom','footer'); ?>
<!-- Footer -->
<?php get_footer(); ?> 