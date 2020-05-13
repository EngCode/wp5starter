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
<div class="page-content container-xl">
    <?php if (have_posts()) : while (have_posts()) : the_post(); ?>
        <?php the_content(); ?>
    <?php endwhile; endif; ?>

    <!-- ck_67c3472a45e22b373c5ff47e27de3ae979c50fe6 -->
    <!-- cs_de157c507a51642735c81acd010dc81884aaaf4d -->
</div>

<script>
    //====> WooCommerce API Keys <=====//
    const wooConsumerKey = 'ck_12542341c39b6b0783e8e87b3bcf2d32bc14e324';
    const wooConsumerSecret = 'cs_93c657dca5155fa5c4a56ce668bbf116cd52b492';
    //====> Encoding WooCommerce Keys <=====//
    const wooAuth = (key, secret) => {
        let hash = btoa(key + ':' + secret);
        return "Basic " + hash;
    }

    let auuth = wooAuth(wooConsumerKey, wooConsumerSecret);
    //====> Get WooCommerce Data <=====//
    async function getWooData() {
        // Default options are marked with *
        const response = await fetch('http://localhost/wordpress/flash-dukan/wp-json/wc/v3/products', {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Authorization": auuth
            },
        });

        return response.json(); // parses JSON response into native JavaScript objects
    }

    getWooData().then(data => {
        console.log(data); // JSON data parsed by `response.json()` call
    });
</script>
<!-- Custom Footer --> 
<?php get_template_part('inc/template-parts/custom','footer'); ?>
<!-- Footer -->
<?php get_footer(); ?> 