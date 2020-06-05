<?php
    /**
     * Tornado Theme - Options Tab
     * @package Tornado Wordpress
    */
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
?>

<!-- Page Head -->
<div class="page-head">
    <h1><?php echo __('General Settings','tornado'); ?></h1>
</div>

<!-- Panel Block -->
<div class="options-panel">
    <!-- Panel Title -->
    <h2 class="panel-title"><?php echo __('Design Options','tornado'); ?></h2>
    <div class="row no-gutter">
        <!-- Control Item -->
        <div class="control-item col-12 col-l-6 <?php if (is_rtl()) { echo 'rtl'; }?>">
            <label for="theme_logo"><?php echo __('Theme Logo','tornado'); ?></label>
            <!-- Image Uploader -->  
            <div class="media-uploader-control iconic">
                <?php 
                    if (!get_option('theme_logo')) {
                        $image_value = 'https://via.placeholder.com/320x50?text=PLACEHOLDER';
                    } else {
                        $image_value = get_option('theme_logo');
                    }
                ?>
                <input type="hidden" name="theme_logo" class="uploader-input" placeholder="<?php echo __('Image URL','tornado'); ?>">
                <img src="<?php echo $image_value; ?>" alt="" class="image-prev">
                <button type="button" class="uploader-btn button button-primary ti-play-work-up"></button>
            </div>
        </div>
        <!-- // Control Item -->
    </div>
</div>
<!-- // Panel Block -->