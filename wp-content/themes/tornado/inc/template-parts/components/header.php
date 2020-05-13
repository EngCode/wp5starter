<?php
/**
 * this template repersent header design component
 * @package Tornado Wordpress
 * @subpackage Developing Starter Template
 * @since Tornado UI Starter 1.0
*/
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
?>
<!-- Main Header -->
<header class="tornado-header" data-sticky="absolute">
    <div class="container">
        <!-- Logo -->
        <?php if ( is_rtl() ) { ?>
            <a href="<?php echo site_url();?>" class="logo"> <img src="<?php echo get_design_options('logo_rtl');?>" alt="<?php echo bloginfo('name');?>"> </a> 
        <?php } else { ?>
            <a href="<?php echo site_url();?>" class="logo"> <img src="<?php echo get_design_options('logo');?>" alt="<?php echo bloginfo('name');?>"> </a> 
        <?php } ?>
        <!-- Navigation Menu -->
        <div class="navigation-menu" data-id="main-menu">
            <?php echo wp_nav_menu(array(
                'menu' => 'main-menu',
                'theme_location' => 'main-menu',
                'container' => false,
                'container_class' => false,
            ));?>
        </div>
        <!-- Action Buttons -->
        <div class="action-btns social-btns">
            <a href="https://wa.me/<?php echo get_design_options('whatsapp_number');?>" class="ti-whatsapp whatsapp-bg"></a>
            <a href="<?php echo get_design_options('facebook_url');?>" class="ti-facebook"></a>
            <a href="<?php echo get_design_options('twitter_url');?>" class="ti-twitter"></a>
            <a href="<?php echo get_design_options('instagram_url');?>" class="ti-instagram"></a>
            <!-- Categories Mobile Button -->
            <a href="#" class="icon-btn tooltip-bottom menu-btn ti-menu-round" title="<?php echo pll__('القائمة الرئيسية','tornado');?>" data-id="main-menu"></a>
        </div>
        <!-- // Action Buttons -->
    </div>
</header>
<!-- // Main Header -->