<?php
    //======= Exit if Try to Access Directly =======//
    defined('ABSPATH') || exit;
    //=========== Theme Customizer ===========//
    function tornado_design_options($wp_customize) {
        //===== Primary Phone =====//
        $wp_customize->add_setting('phone_number' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('phone_number',array(
            'label'      => __('Phone Number', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'phone_number',
            'priority'   => 21
        ));

        //======== Secondary Phone =======//
        $wp_customize->add_setting('phone_number_2nd' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('phone_number_2nd',array(
            'label'      => __('Secondary Phone Number', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'phone_number_2nd',
            'priority'   => 21
        ));

        //======== Primary Email =======//
        $wp_customize->add_setting('email' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('email',array(
            'label'      => __('Email Address', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'email',
            'priority'   => 21
        ));

        //======== Secondary Email =======//
        $wp_customize->add_setting('email_2nd' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('email_2nd',array(
            'label'      => __('Secondary Email Address', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'email_2nd',
            'priority'   => 21
        ));

        //======== Primary Address =======//
        $wp_customize->add_setting('address' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('address',array(
            'label'      => __('Company Address', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'address',
            'priority'   => 21
        ));

        //======== English Address =======//
        $wp_customize->add_setting('address_rtl' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('address_rtl',array(
            'label'      => __('RTL Company Address', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'address_rtl',
            'priority'   => 21
        ));

        //===== Meta Options [facebook] =====//
        $wp_customize->add_setting('facebook_url' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('facebook_url',array(
            'label'      => __('Facebook URL', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'facebook_url',
            'priority'   => 21
        ));

        //===== Meta Options [twitter] =====//
        $wp_customize->add_setting('twitter_url' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('twitter_url',array(
            'label'      => __('Twitter URL', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'twitter_url',
            'priority'   => 21
        ));

        //===== Meta Options [instagram] =====//
        $wp_customize->add_setting('instagram_url' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('instagram_url',array(
            'label'      => __('Instagram URL', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'instagram_url',
            'priority'   => 21
        ));

        //===== Meta Options [linked in] =====//
        $wp_customize->add_setting('linkedin_url' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('linkedin_url',array(
            'label'      => __('Linked-In URL', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'linkedin_url',
            'priority'   => 21
        ));

        //===== Meta Options [pinterest] =====//
        $wp_customize->add_setting('pinterest_url' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('pinterest_url',array(
            'label'      => __('Pinterest URL', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'pinterest_url',
            'priority'   => 21
        ));

        //===== Meta Options [youtube] =====//
        $wp_customize->add_setting('youtube_url' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('youtube_url',array(
            'label'      => __('Youtube URL', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'youtube_url',
            'priority'   => 21
        ));

        //===== Design Options [Logo] =====//
        $wp_customize->add_setting('logo' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
        ));

        $wp_customize->add_control(new WP_Customize_Image_Control(
            $wp_customize,'logo',array(
                'label'      => __('Site Logo', 'tornado'),
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
                'label'      => __( 'RTL Site Logo', 'tornado'),
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
                'label'      => __( 'Mobile Menu Logo', 'tornado'),
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
                'label'      => __( 'Theme Primary Color', 'tornado'),
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
                'label'      => __( 'Theme Primary Hover Color', 'tornado'),
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
                'label'      => __( 'Theme Secondary Color', 'tornado'),
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
                'label'      => __( 'Theme Secondary Hover Color', 'tornado'),
                'section'    => 'title_tagline',
                'settings'   => 'secondary_hvr_color',
                'priority'   => 23
            )
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

        } elseif ($option == 'email') {
            //=====Contact Informations Output [email] =====//
            return get_option('email');

        } elseif ($option == 'email_2nd') {
            //===== Contact Informations Output [email_2nd] =====//
            return get_option('email_2nd');

        } elseif ($option == 'address') {
            //===== Contact Informations Output [address] =====//
            return get_option('address');
        } elseif ($option == 'address_rtl') {
            //===== Contact Informations Output [address] =====//
            return get_option('address_rtl');
        } elseif ($option == 'facebook_url') {
            //===== Meta Options [Facebook] Output =====//
            return get_option('facebook_url');
        } elseif ($option == 'twitter_url') {
            //===== Meta Options [Twitter] Output =====//
            return get_option('twitter_url');
        } elseif ($option == 'instagram_url') {
            //===== Meta Options [Instagram] Output =====//
            return get_option('instagram_url');
        } elseif ($option == 'linkedin_url') {
            //===== Meta Options [Linked In] Output =====//
            return get_option('linkedin_url');
        } elseif ($option == 'pinterest_url') {
            //===== Meta Options [Pinterest] Output =====//
            return get_option('pinterest_url');
        } elseif ($option == 'youtube_url') {
            //===== Meta Options [Youtube] Output =====//
            return get_option('youtube_url');
        }
    }
?>