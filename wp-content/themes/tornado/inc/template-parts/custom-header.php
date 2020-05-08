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
<!-- Header -->
<header class="tornado-header main-header wow fadeInDown" data-sticky>
    <div class="container">
        <!-- Logo -->
        <?php if ( is_rtl() ) { ?>
            <a href="<?php echo site_url();?>" class="logo" title="<?php bloginfo('name'); ?>"></a> 
        <?php } else { ?>
            <a href="<?php echo site_url();?>" class="logo" title="<?php bloginfo('name'); ?>"></a> 
        <?php } ?>
        <!-- Menu -->
        <div class="navigation-menu" data-id="main-menu" data-logo="<?php echo get_design_options('mobile_menu_logo');?>">
            <?php echo wp_nav_menu(array(
                'menu' => 'main-menu',
                'theme_location' => 'main-menu',
                'container' => false,
                'container_class' => false,
            ));?>
        </div>
    </div>
</header>
<!-- // Header -->