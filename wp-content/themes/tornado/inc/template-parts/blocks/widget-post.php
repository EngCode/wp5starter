<?php
/**
 * this template repersent Blog Block Design component
 * @package Tornado Wordpress
 * @subpackage Developing Starter Template
 * @since Tornado UI Starter 1.0
*/
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    $excerpt_msg = __('no Short Discription in [excerpt] Please Write a Short Discription.', 'tornado');
?>
<!-- Widget Post -->
<div class="widget-post">
    <a href="<?php the_permalink(); ?>" data-src="<?php thumbnail_link('https://via.placeholder.com/570x310'); ?>" title="<?php the_title(); ?>"></a>
    <div class="info">
        <a href="<?php the_permalink(); ?>"><h3><?php the_title(); ?></h3></a>
        <h4><?php get_category_name(); ?></h4>
    </div>
</div>
<!-- // Widget Post -->