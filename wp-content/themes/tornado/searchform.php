<?php
/**
 * this template for displaying Search Form
 * @package Tornado Wordpress
 * @subpackage Developing Starter Template
 * @since Tornado UI Starter 1.0
*/
//======= Exit if Try to Access Directly =======//
defined('ABSPATH') || exit;
?>
<!-- Search Form -->
<div class="widget-block">
    <h3 class="head ti-search"><?php echo __('Quick Search','tornado'); ?></h3>
    <form class="form-ui" method="get" action="<?php echo home_url( '/' ); ?>">
		<input type="text" placeholder="<?php echo __('Search Keywords','tornado'); ?>" name="s" id="search-input">
        <input type="submit" value="Search Now" class="btn primary block-lvl">
    </form>
</div>