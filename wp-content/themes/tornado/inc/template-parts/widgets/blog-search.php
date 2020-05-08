<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //======== Extend WP Widget with Custom Widget ========//
    class search_widget extends WP_Widget {
        //======= Assign Widget Information ======//
        public function __construct() {
            $widget_options = array( 
                'classname' => 'search_widget',
                'description' => __('Search Widget', 'tornado'),
            );
            parent::__construct( 'search_widget', 'Search Widget', $widget_options );
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
            get_search_form();
        }
    }
    //======== Register Widget ========//
    add_action( 'widgets_init', function(){
        register_widget( 'search_widget' );
    });
?>