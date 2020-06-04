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
        $wp_customize->add_setting('phone_number_2' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('phone_number_2',array(
            'label'      => __('Phone Number #2', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'phone_number_2',
            'priority'   => 21
        ));

        //======== Third Phone =======//
        $wp_customize->add_setting('phone_number_3' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('phone_number_3',array(
            'label'      => __('Phone Number #3', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'phone_number_3',
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
        $wp_customize->add_setting('email_2' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('email_2',array(
            'label'      => __('Email Address #2', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'email_2',
            'priority'   => 21
        ));

        //======== Secondary Email =======//
        $wp_customize->add_setting('email_3' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('email_3',array(
            'label'      => __('Email Address #3', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'email_3',
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

        //===== Meta Options [Whatsapp] =====//
        $wp_customize->add_setting('whatsapp_number' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('whatsapp_number',array(
            'label'      => __('WhatsApp Number', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'whatsapp_number',
            'priority'   => 21
        ));

        //===== Meta Options [Whatsapp] =====//
        $wp_customize->add_setting('whatsapp_number_2' , array(
            'default'     => '',
            'transport'   => 'refresh',
            'type'        => 'option',
            'sanitize_callback' => 'sanitize_text_field',
        ));

        $wp_customize->add_control('whatsapp_number_2',array(
            'label'      => __('WhatsApp Number #2', 'tornado'),
            'section'    => 'title_tagline',
            'settings'   => 'whatsapp_number_2',
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
    }

    add_action('customize_register', 'tornado_design_options');

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

        } elseif ($option == 'phone_number_2') {
            //===== Contact Informations Output [phone_number_3] =====//
            return get_option('phone_number_2');

        } elseif ($option == 'phone_number_3') {
            //===== Contact Informations Output [phone_number_3] =====//
            return get_option('phone_number_3');

        } 
        elseif ($option == 'email') {
            //=====Contact Informations Output [email] =====//
            return get_option('email');

        } elseif ($option == 'email_2') {
            //===== Contact Informations Output [email_2] =====//
            return get_option('email_2');

        } elseif ($option == 'email_3') {
            //===== Contact Informations Output [email_3] =====//
            return get_option('email_3');

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
        } elseif ($option == 'whatsapp_number') {
            //===== Meta Options [Linked In] Output =====//
            return get_option('whatsapp_number');
        } elseif ($option == 'whatsapp_number_2') {
            //===== Meta Options [Linked In] Output =====//
            return get_option('whatsapp_number_2');
        }
    }
?>