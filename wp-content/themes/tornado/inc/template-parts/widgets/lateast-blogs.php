<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //======== Extend WP Widget with Custom Widget ========//
    class lateast_blogs extends WP_Widget {
        //======= Assign Widget Information ======//
        public function __construct() {
            $widget_options = array( 
                'classname' => 'lateast_blogs',
                'description' => __('Lateast Blogs', 'tornado'),
            );
            parent::__construct( 'lateast_blogs', 'Lateast Blogs', $widget_options );
        }

        //======= Widget Admin Form Output ======//
        public function form( $instance ) {
            $title = ! empty( $instance['title'] ) ? $instance['title'] : ''; 
            //===== Widget title Control ======//
            // echo '<div class="form-ui">';
            //     echo '<label for="'. $this->get_field_id( 'title' ) .'">عنوان الويدجت</label>';
            //     echo '<input type="text" id="'. $this->get_field_id( 'title' ) .'" name="'. $this->get_field_id( 'title' ) .'" value="'. esc_attr( $title ) .'" />';
            // echo '</div>';
        }

        //======= Widget Admin Form Save ======//
        public function update( $new_instance, $old_instance ) {
            $instance = $old_instance;
            $instance[ 'title' ] = strip_tags( $new_instance[ 'title' ] );
            return $instance;
        }

        //======= Widget Frontend Output======//
        public function widget( $args, $instance ) {
            /*==== Grap Query Data =====*/
            $args = array(
                'post_type' => 'post',
                'posts_per_page' => 3,
            );
            $the_query = new WP_Query( $args );
            //==== Start Query =====//
            if ( $the_query->have_posts() ) : 
                //==== Grid Element ====//
                echo '<div class="widget-block">
                <!-- Title -->
                <h3 class="head ti-folder">' . __('Lateast Blogs', 'tornado') . '</h3>';
                //==== Loop Start ====//
                while ( $the_query->have_posts() ) : $the_query->the_post(); 
                //=== Get the Design Part ===//
                get_template_part('inc/template-parts/blocks/widget','post');
                //==== End Loop =====//
                endwhile;
                //==== Grid Element Close ====//
                echo '</div>';
                wp_reset_postdata();
            //==== End Query =====//
            endif; 
        }
    }
    //======== Register Widget ========//
    add_action( 'widgets_init', function(){
        register_widget( 'lateast_blogs' );
    });
?>