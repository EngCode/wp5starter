<?php
/**
 * Template Name: Default Rich Content
 * this template for displaying Rich Content for any of this pages single.php or page.php
 * @package Tornado Wordpress
 * @subpackage Developing Starter Template
 * @since Tornado UI Starter 1.0
*/
//======= Exit if Try to Access Directly =======//
defined('ABSPATH') || exit;
?>

<!-- Head Tag -->
<?php get_header(); ?>
<!-- Header -->
<?php get_template_part('inc/template-parts/custom','header'); ?>

<!-- Page Content -->
<div class="container page-content">
    <!-- Grid -->
    <div class="row row-reverse">
        <!-- Content Side -->
        <div class="col-12 col-m-8 col-l-9">
            <?php //====== if Have Post Content =======//
                if (have_posts()) : while (have_posts()) : the_post();
                //==== Check Image ====//
                $imageValidation = !has_post_thumbnail();
                $featuredImage = 'https://via.placeholder.com/850x410';
                //==== Track the Views Count =====//
                setPostViews(get_the_ID());
                //===== Get Categories List Data
                $posts_categories = get_categories('taxonomy=category&post_type=surgical');
            ?>
            <!-- Blog Details -->
            <div class="primary-block" itemscope itemtype="http://schema.org/Article">
                <!-- Information Head -->
                <div class="info-head">
                    <span class="ti-event"><?php echo __('تم نشرة '); the_date('d M Y'); ?></span>
                    <span class="ti-comment-bubble"><?php comments_number( __('لا يوجد تعليقات'), __('تعليق واحد'), __('% تعليق') ); ?></span>
                    <span class="ti-eye"><?php echo getPostViews(get_the_ID()) . __('مشاهدة'); ?> </span>
                    <div class="social">
                        <span><?php echo __('مشاركة المقال'); ?></span>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=<?php the_permalink(); ?>" class="ti-facebook" target="_blank"></a>
                        <a href="https://twitter.com/home?status=<?php the_permalink(); ?>" class="ti-twitter" target="_blank"></a>
                        <a href="https://www.linkedin.com/shareArticle?mini=true&url=<?php the_permalink(); ?>&title=<?php the_permalink(); ?>&summary=<?php the_excerpt(); ?>" class="ti-linkedin" target="_blank"></a>
                    </div>
                </div>
                <!-- Blog Cover -->
                <img src="<?php if ($imageValidation) { echo $featuredImage; } else { thumbnail_link(); }; ?>" alt="<?php the_title(); ?>" class="cover-image">
                <!-- Rich Content -->
                <div class="rich-content">
                    <h2 itemprop="headline"><?php the_title(); ?></h2>
                    <!-- Page Content -->
                    <?php the_content(); ?>
                </div>
                <!-- Information Footer -->
                <div class="info-footer">
                    <span class="ti-comment-bubble"><?php comments_number( __('لا يوجد تعليقات'), __('تعليق واحد'), __('% تعليق') ); ?></span>
                    <span class="ti-eye"><?php echo getPostViews(get_the_ID()) . __('مشاهدة'); ?> </span>
                    <div class="social">
                        <span><?php echo __('مشاركة المقال'); ?></span>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=<?php the_permalink(); ?>" class="ti-facebook" target="_blank"></a>
                        <a href="https://twitter.com/home?status=<?php the_permalink(); ?>" class="ti-twitter" target="_blank"></a>
                        <a href="https://www.linkedin.com/shareArticle?mini=true&url=<?php the_permalink(); ?>&title=<?php the_permalink(); ?>&summary=<?php the_excerpt(); ?>" class="ti-linkedin" target="_blank"></a>
                    </div>
                </div>
            </div>
            <!-- Schema -->
            <div class="hidden">
                <div class="hidden" itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
                    <img itemprop="url" src="<?php if ($imageValidation) { echo $featuredImage; } else { thumbnail_link(); }; ?>" />
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
            <!-- Tags -->
            <div class="primary-block">
                <h3 class="head ti-tag"><?php echo __('الكلمات الدلالية'); ?></h3>
                <div class="tags clear-after">
                    <?php the_tags(' ',' ',' '); ?>
                </div>
            </div>
            <!-- Comments List -->
            <?php comments_template(); ?>
            <!-- Pagination -->
            <!-- <ul class="pagination">
                <li><a href="#">الصفحة السابقة</a></li>
                <li class="active"><a href="#">01</a></li>
                <li><a href="#">02</a></li>
                <li><a href="#">الصفحة التالية</a></li>
            </ul> -->
            <?php endwhile; endif;  //====== End if Have Post Content =======// ?>
        </div>
        <!-- Widgets Side -->
        <?php get_sidebar('blog-sidebar'); ?>
    </div>
    <!-- // Grid -->
</div>
<!-- // Page Content -->

<!-- Custom Footer --> 
<?php get_template_part('inc/template-parts/custom','footer'); ?>
<!-- Footer -->
<?php get_footer(); ?>