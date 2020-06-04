<?php
    /**
     * Tornado Theme Custom Options Pages
     * @package Tornado Wordpress
     * Creating Custom Options for Easy Theme and Design Control.
     * 
    */

    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;

    //========> Page Render Function <========//
    function tornado_global_options() {
?>

<!-- Theme Options -->
<div class="theme-options">
    <!-- Header -->
    <?php get_template_part('inc/template-parts/admin/header'); ?>
    
</div>
<!-- // Theme Options -->
<?php } ?>