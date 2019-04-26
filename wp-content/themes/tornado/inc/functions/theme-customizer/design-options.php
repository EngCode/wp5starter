<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //=========== Theme Customizer ===========//
    function tornado_design_options($wp_customize) {
        //===== Design Options [Logo] =====//
        $wp_customize->add_setting('logo' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
        ));

        $wp_customize->add_control(new WP_Customize_Image_Control(
            $wp_customize,'logo',array(
                'label'      => __('رفع اللوجو', 'mahacode'),
                'section'    => 'title_tagline',
                'settings'   => 'logo',
                'priority'   => 21
            )
        ));

        //===== Design Options [RTL Logo] =====//
        $wp_customize->add_setting('logo_rtl' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
        ));

        $wp_customize->add_control(new WP_Customize_Image_Control(
            $wp_customize,'logo_rtl',array(
                'label'      => __( 'رفع اللوجو العربي', 'mahacode'),
                'section'    => 'title_tagline',
                'settings'   => 'logo_rtl',
                'priority'   => 22
            )
        ));

        //===== Design Options [RTL Logo] =====//
        $wp_customize->add_setting('mobile_menu_logo' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
        ));

        $wp_customize->add_control(new WP_Customize_Image_Control(
            $wp_customize,'mobile_menu_logo',array(
                'label'      => __( 'رفع لوجو قائمة الموبايل', 'mahacode'),
                'section'    => 'title_tagline',
                'settings'   => 'mobile_menu_logo',
                'priority'   => 22
            )
        ));

        //===== Design Options [Primary Color] =====//
        $wp_customize->add_setting('primary_color' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_hex_color',
        ));

        $wp_customize->add_control(new WP_Customize_Color_Control(
            $wp_customize,'primary_color',array(
                'label'      => __( 'اختيار اللون الاساسي', 'mahacode'),
                'section'    => 'title_tagline',
                'settings'   => 'primary_color',
                'priority'   => 23
            )
        ));

        //===== Design Options [Primary Hover Color] =====//
        $wp_customize->add_setting('primary_hvr_color' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_hex_color',
        ));

        $wp_customize->add_control(new WP_Customize_Color_Control(
            $wp_customize,'primary_hvr_color',array(
                'label'      => __( 'اللون الاساسي عند مرور الماوس', 'mahacode'),
                'section'    => 'title_tagline',
                'settings'   => 'primary_hvr_color',
                'priority'   => 23
            )
        ));
        
        //===== Design Options [Secondary Color] =====//
        $wp_customize->add_setting('secondary_color' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_hex_color',
        ));

        $wp_customize->add_control(new WP_Customize_Color_Control(
            $wp_customize,'secondary_color',array(
                'label'      => __( 'اختيار اللون الفرعي', 'mahacode'),
                'section'    => 'title_tagline',
                'settings'   => 'secondary_color',
                'priority'   => 23
            )
        ));

        //===== Design Options [Secondary Hover Color] =====//
        $wp_customize->add_setting('secondary_hvr_color' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_hex_color',
        ));

        $wp_customize->add_control(new WP_Customize_Color_Control(
            $wp_customize,'secondary_hvr_color',array(
                'label'      => __( 'اللون الفرعي عند مرور الماوس', 'mahacode'),
                'section'    => 'title_tagline',
                'settings'   => 'secondary_hvr_color',
                'priority'   => 23
            )
        ));

        //===== Contact Information =====//
        $wp_customize->add_setting('phone_number' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('phone_number',array(
            'label'      => __('رقم الهاتف', 'mahacode'),
            'section'    => 'title_tagline',
            'settings'   => 'phone_number',
            'priority'   => 21
        ));

        $wp_customize->add_setting('phone_number_2nd' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('phone_number_2nd',array(
            'label'      => __('رقم الهاتف الثاني', 'mahacode'),
            'section'    => 'title_tagline',
            'settings'   => 'phone_number_2nd',
            'priority'   => 21
        ));

        $wp_customize->add_setting('mc_email' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('mc_email',array(
            'label'      => __('البريد الالكتروني', 'mahacode'),
            'section'    => 'title_tagline',
            'settings'   => 'mc_email',
            'priority'   => 21
        ));

        $wp_customize->add_setting('mc_email_2nd' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('mc_email_2nd',array(
            'label'      => __('البريد الالكتروني الثاني', 'mahacode'),
            'section'    => 'title_tagline',
            'settings'   => 'mc_email_2nd',
            'priority'   => 21
        ));

        $wp_customize->add_setting('mc_address' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('mc_address',array(
            'label'      => __('عنوان الشركة', 'mahacode'),
            'section'    => 'title_tagline',
            'settings'   => 'mc_address',
            'priority'   => 21
        ));
    }
    add_action('customize_register', 'tornado_design_options');
    
    //==== Design Options Color Activate =====//
    add_action( 'wp_head', 'tornado_design_colors');    
    function tornado_design_colors() {?>
            <style type="text/css">
                :root{
                    --primary-color:<?php echo get_option('primary_color');?>;
                    --primary-color-hover:<?php echo get_option('primary_hvr_color');?>;
                    --secondary-color:<?php echo get_option('secondary_color');?>;
                    --secondary-color-hover:<?php echo get_option('secondary_hvr_color');?>;
                }
            </style>
        <?php
    }

    //===== Design Options Output =====//
    function get_design_options($option) {
        if ($option == 'logo') {
            //===== Design Options [Logo] Output =====//
            return get_option('logo');
            
        } elseif ($option == 'logo_rtl') {
            //===== Design Options [RTL Logo] Output =====//
            return get_option('logo_rtl');

        } elseif ($option == 'mobile_menu_logo') {
            //===== Design Options [RTL Logo] Output =====//
            return get_option('mobile_menu_logo');

        } elseif ($option == 'phone_number') {
            //===== Contact Informations Output [phone_number] =====//
            return get_option('phone_number');

        } elseif ($option == 'phone_number_2nd') {
            //===== Contact Informations Output [phone_number_2nd] =====//
            return get_option('phone_number_2nd');

        } elseif ($option == 'mc_email') {
            //=====Contact Informations Output [mc_email] =====//
            return get_option('mc_email');

        } elseif ($option == 'mc_email_2nd') {
            //===== Contact Informations Output [mc_email_2nd] =====//
            return get_option('mc_email_2nd');

        } elseif ($option == 'mc_address') {
            //===== Contact Informations Output [mc_address] =====//
            return get_option('mc_address');
        }
    }
?>