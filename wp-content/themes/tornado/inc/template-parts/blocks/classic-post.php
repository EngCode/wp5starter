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
<!-- Media Object -->
<div class="media-object boxed primary-block">
    <a href="#" class="media"><img src="<?php thumbnail_link('https://via.placeholder.com/570x310'); ?>" alt="<?php the_title(); ?>"></a>
    <div class="media-content">
        <a href="<?php the_permalink(); ?>" title="<?php the_title(); ?>"><h6><?php the_title(); ?></h6></a>
        <p><?php if ( has_excerpt($post->ID) ) { the_excerpt();  } else { echo $excerpt_msg; }; ?></p>
        <div class="info">
            <span class="ti-event"><?php echo __('Puplished in ', 'tornado'); the_date('Y-m-d'); ?></span>
            <span class="ti-comment-bubble"><?php comments_number( __('no Comments Yet', 'tornado'), __('One Comment', 'tornado'), __('% Comments', 'tornado') ); ?></span>
            <span class="ti-comment-bubble"><?php echo __('Categories : ', 'tornado'); the_category(', '); ?></span>
        </div>
    </div>
</div>
<!-- // Media Object -->