<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    if ( the_tags() ) :
?>
<!-- Tags -->
<div class="primary-block">
    <h3 class="head ti-tag"><?php echo __('الكلمات الدلالية'); ?></h3>
    <div class="tags clear-after">
        <?php the_tags(' ',' ',' '); ?>
    </div>
</div>
<?php endif; ?>