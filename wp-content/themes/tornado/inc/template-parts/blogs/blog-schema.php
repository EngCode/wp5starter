<?php
    /**
     * Tornado Theme - Blog Schema Data Component
     * @package Tornado Wordpress
    */

    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
?>

<!-- Schema -->
<div class="hidden">
    <div class="hidden" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
        <img itemprop="url" src="<?php the_field('custom-image');?>" />
        <meta itemprop="width" content="570" />
        <meta itemprop="height" content="310" />
    </div>
    <span itemprop="author"><?php bloginfo('name'); ?></span>
    <span itemprop="datePublished"><?php the_date('d M Y'); ?></span>
    <span itemprop="publisher"><?php the_date('d M Y'); ?></span>
    <span itemprop="dateModified"><?php the_date('d M Y'); ?></span>
    <span itemprop="mainEntityOfPage"><?php if ( has_excerpt() ) { the_excerpt();  } else { echo __('لا يوجد محتوي فى الوصف القصير [المقتطف] يرجي وضع محتوي ليظهر هنا', 'tornado'); }; ?></span>
    <span itemprop="description"><?php if ( has_excerpt() ) { the_excerpt();  } else { echo __('لا يوجد محتوي فى الوصف القصير [المقتطف] يرجي وضع محتوي ليظهر هنا', 'tornado'); }; ?></span>
</div>
<!-- // Schema -->