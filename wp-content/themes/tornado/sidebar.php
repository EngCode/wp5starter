<?php
/**
 * this template for displaying Sidebars
 * @package Tornado Wordpress
 * @subpackage Developing Starter Template
 * @since Tornado UI Starter 1.0
*/
?>

<div class="col-12 col-m-4 col-l-3">
    <?php if ( is_active_sidebar( 'tornado-sidebar' ) ) : ?>
        <?php dynamic_sidebar( 'tornado-sidebar' ); ?>
    <?php else : ?>
        <!-- Time to add some widgets! -->
        <p><?php echo __('Sidebar is not ativated','tornado'); ?></p>
    <?php endif; ?>
</div>