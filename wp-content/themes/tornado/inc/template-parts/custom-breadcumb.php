<?php
/**
 * this template repersent Breadcrumb design component
 * @package Tornado Wordpress
 * @subpackage Developing Starter Template
 * @since Tornado UI Starter 1.0
*/
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
?>
<?php if ( !is_home() && !is_front_page() ) { ?>
<!-- Inner Pages Head -->
<div class="page-head">
    <div class="container">
        <!-- Page Title -->
        <h1><?php echo wp_title(); ?></h1>
        <!-- Breadcrumb -->
        <?php 
            //=== Yoast Breadcrumb ===//
            if ( function_exists('yoast_breadcrumb') ) { yoast_breadcrumb('<div class="breadcrumb">','</div>') ;}
        ?>
    </div>
</div>
<!-- // Inner Pages Head -->
<?php } ?>