<?php
//======= Exit if Try to Access Directly =======//
defined('ABSPATH') || exit;
//======== Extend WP Widget with Custom Widget ========//
class blog_categories extends WP_Widget {
    //======= Assign Widget Information ======//
    public function __construct() {
        $widget_options = array( 
            'classname' => 'blog_categories',
            'description' => __('Blog Categories List', 'tornado'),
        );
        parent::__construct( 'blog_categories', 'Blog Categories', $widget_options );
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
        //======= Dynamic Data Store ======//
        $categories = get_categories( array(
            'orderby' => 'name',
            'order'   => 'ASC'
        ));
?>
<!-- Widget Block -->
<div class="widget-block">
    <h3 class="head ti-filing"><?php echo __('Blog Categories', 'tornado') ?></h3>
    <ul class="links">
        <?php foreach ($categories as $category) : ?>
        <li><a href="<?php echo get_category_link($category->cat_ID); ?>" class="ti-folder-bookmark" title="<?php echo $category->name; ?>"><?php echo $category->name; ?></a></li>
        <?php endforeach; ?>
    </ul>
</div>
<!-- // Widget Block -->

<?php  }} /*======= End Widget Frontend Output ======*/
//==== Register ====//
add_action( 'widgets_init', function(){
    register_widget( 'blog_categories' );
});
?>