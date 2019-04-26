<?php

class WPAmazonSES_Settings {

	var $options;

	function __construct() {
		$this->options = get_option( 'wp_ses_smtp_option' );
	}

	/**
	 * Register and add settings
	 */
	function settings() {
		register_setting(
				'wp_ses_smtp_option_group', // Option group
				'wp_ses_smtp_option', // Option name
				array( $this, 'sanitize' ) // Sanitize
		);

		add_settings_section(
				'wp_ses_setting_id', // ID
				__( 'Email Options', 'amgsessmtp' ), // Title
				array( $this, 'print_section_info' ), // Callback
				'amgsessmtp' // Page
		);
		add_settings_field(
				'is_active', // ID
				sprintf( '<label for="is_active">%s</label>', __( 'Is Active?', 'amgsessmtp' ) ), // Title 
				array( $this, 'is_active_callback' ), // Callback
				'amgsessmtp', // Page
				'wp_ses_setting_id' // Section           
		);

		add_settings_field(
				'from_email', // ID
				sprintf( '<label for="from_email">%s</label>', __( 'From Email', 'amgsessmtp' ) ), // Title 
				array( $this, 'from_email_callback' ), // Callback
				'amgsessmtp', // Page
				'wp_ses_setting_id' // Section           
		);

		add_settings_field(
				'from_name', sprintf( '<label for="from_name">%s</label>', __( 'From Name', 'amgsessmtp' ) ), // Title 
				array( $this, 'from_name_callback' ), 'amgsessmtp', 'wp_ses_setting_id'
		);
		add_settings_field(
				'mail_set_return_path', __( 'Return Path', 'amgsessmtp' ), // Title 
				array( $this, 'return_path_callback' ), 'amgsessmtp', 'wp_ses_setting_id'
		);
		add_settings_section(
				'wp_ses_smtp_setting_id', // ID
				__( 'SMTP Options', 'amgsessmtp' ), // Title
				array( $this, 'print_smtp_section_info' ), // Callback
				'amgsessmtp' // Page
		);
		add_settings_field(
				'ses_region', // ID
				sprintf( '<label for="ses_region">%s</label>', __( 'Select Region', 'amgsessmtp' ) ), // Title 
				array( $this, 'region_callback' ), // Callback
				'amgsessmtp', // Page
				'wp_ses_smtp_setting_id' // Section           
		);
		add_settings_field(
				'smtp_encryption', // ID
				sprintf( '<label for="smtp_encryption">%s</label>', __( 'Encryption', 'amgsessmtp' ) ), // Title 
				array( $this, 'smtp_encryption_callback' ), // Callback
				'amgsessmtp', // Page
				'wp_ses_smtp_setting_id' // Section           
		);
		add_settings_field(
				'smtp_authentication', // ID
				sprintf( '<label for="smtp_authentication">%s</label>', __( 'Authentication', 'amgsessmtp' ) ), // Title 
				array( $this, 'smtp_authentication_callback' ), // Callback
				'amgsessmtp', // Page
				'wp_ses_smtp_setting_id' // Section           
		);
		add_settings_field(
				'smtp_username', // ID
				sprintf( '<label for="smtp_username">%s</label>', __( 'Username', 'amgsessmtp' ) ), // Title 
				array( $this, 'smtp_username_callback' ), // Callback
				'amgsessmtp', // Page
				'wp_ses_smtp_setting_id' // Section           
		);
		add_settings_field(
				'smtp_password', // ID
				sprintf( '<label for="smtp_password">%s</label>', __( 'Password', 'amgsessmtp' ) ), // Title 
				array( $this, 'smtp_password_callback' ), // Callback
				'amgsessmtp', // Page
				'wp_ses_smtp_setting_id' // Section           
		);
	}

	/**
	 * Sanitize each setting field as needed
	 *
	 * @param array $input Contains all settings fields as array keys
	 */
	function sanitize( $input ) {
		$new_input = array();
		if ( isset( $input['from_email'] ) ) {
			$new_input['from_email'] = sanitize_email( $input['from_email'] );
		}
		if ( isset( $input['is_active'] ) ) {
			$new_input['is_active'] = sanitize_text_field( $input['is_active'] );
		}
		if ( isset( $input['from_name'] ) ) {
			$new_input['from_name'] = sanitize_text_field( $input['from_name'] );
		}
		if ( isset( $input['mail_set_return_path'] ) ) {
			$new_input['mail_set_return_path'] = sanitize_text_field( $input['mail_set_return_path'] );
		}
		if ( isset( $input['ses_region'] ) ) {
			$new_input['ses_region'] = sanitize_text_field( $input['ses_region'] );
		}
		if ( isset( $input['smtp_encryption'] ) ) {
			$new_input['smtp_encryption'] = sanitize_text_field( $input['smtp_encryption'] );
		}
		if ( isset( $input['smtp_authentication'] ) ) {
			$new_input['smtp_authentication'] = sanitize_text_field( $input['smtp_authentication'] );
		}
		if ( isset( $input['smtp_username'] ) ) {
			$new_input['smtp_username'] = sanitize_text_field( $input['smtp_username'] );
		}
		if ( isset( $input['smtp_password'] ) ) {
			$new_input['smtp_password'] = sanitize_text_field( $input['smtp_password'] );
		}

		return $new_input;
	}

	/**
	 * Print the Section text
	 */
	public function print_section_info() {
		
	}

	public function print_smtp_section_info() {
		print __( 'These options only apply if you have chosen to send mail by SMTP above.', 'amgsessmtp' );
	}

	public function is_active_callback() {
		?>
		<fieldset>
			<legend class="screen-reader-text"><span><?php _e( 'Encryption', 'amgsessmtp' ); ?></span></legend>
			<p><input <?php echo!isset( $this->options['is_active'] ) ? 'checked="checked"' : ''; ?> id="yes" type="radio" name="wp_ses_smtp_option[is_active]" value="yes" <?php checked( 'yes', isset( $this->options['is_active'] ) ? $this->options['is_active'] : ''  ); ?> />
				<label for="yes"><?php _e( 'Yes', 'amgsessmtp' ); ?></label></p>			
			<p><input id="no" type="radio" name="wp_ses_smtp_option[is_active]" value="no" <?php checked( 'no', isset( $this->options['is_active'] ) ? $this->options['is_active'] : ''  ); ?> />
				<label for="no"><?php _e( 'No', 'amgsessmtp' ); ?></label></p>
			<span class="description"><?php _e( "Check no if you don't want to use this plugin feature.", 'amgsessmtp' ); ?></span>
		</fieldset>
		<?php
	}

	public function return_path_callback() {
		?>
		<fieldset><legend class="screen-reader-text"><span><?php _e( 'Return Path', 'amgsessmtp' ); ?></span></legend><label for="mail_set_return_path">
				<input name="wp_ses_smtp_option[mail_set_return_path]" type="checkbox" id="mail_set_return_path" value="true" <?php checked( 'true', isset( $this->options['mail_set_return_path'] ) ? $this->options['mail_set_return_path'] : ''  ); ?>>
				<?php _e( 'Set the return-path to match the From Email', 'amgsessmtp' ); ?></label>
		</fieldset>
		<?php
	}

	/**
	 * Get the settings option array and print one of its values
	 */
	public function from_email_callback() {
		printf(
				'<input type="email" id="from_email" class="regular-text" size="40" name="wp_ses_smtp_option[from_email]" value="%s" /><span class="description">%s</span>', isset( $this->options['from_email'] ) ? esc_attr( $this->options['from_email'] ) : '', __( 'You can specify the email address that emails should be sent from. If you leave this blank, the default email will be used.', 'amgsessmtp' )
		);
	}

	/**
	 * Get the settings option array and print one of its values
	 */
	public function from_name_callback() {
		printf(
				'<input type="text" id="from_name" class="regular-text" size="40" name="wp_ses_smtp_option[from_name]" value="%s" /><span class="description">%s</span>', isset( $this->options['from_name'] ) ? esc_attr( $this->options['from_name'] ) : '', __( 'You can specify the name that emails should be sent from. If you leave this blank, the emails will be sent from WordPress.', 'amgsessmtp' )
		);
	}

	public function region_callback() {
		?>
		<fieldset>
			<legend class="screen-reader-text"><span><?php _e( 'Select SES Region for tls Protocol', 'amgsessmtp' ); ?><a target="_blank" href="http://docs.aws.amazon.com/ses/latest/DeveloperGuide/regions.html"><?php _e( 'To know more about SES Region', 'amgsessmtp' ); ?></a></span></legend>
			<select id="ses_region" name="wp_ses_smtp_option[ses_region]" class="fg-select fg-fw">
				<option <?php selected( 'us-east-1', isset( $this->options['ses_region'] ) ? $this->options['ses_region'] : ''  ); ?>  value="us-east-1"><?php _e( 'us-east-1 (N. Virginia)', 'amgsessmtp' ); ?></option>
				<option <?php selected( 'us-west-2', isset( $this->options['ses_region'] ) ? $this->options['ses_region'] : ''  ); ?> value="us-west-2"><?php _e( 'us-west-2 (Oregon)', 'amgsessmtp' ); ?></option>
				<option <?php selected( 'eu-west-1', isset( $this->options['ses_region'] ) ? $this->options['ses_region'] : ''  ); ?>value="eu-west-1"><?php _e( 'eu-west-1 (Ireland)', 'amgsessmtp' ); ?></option>                                    
			</select>	
			<span class="description"><a target="_blank" href="http://docs.aws.amazon.com/ses/latest/DeveloperGuide/regions.html"><?php _e( 'To know more about SES Region', 'amgsessmtp' ); ?> </a></span>
		</fieldset>
		<?php
	}

	public function smtp_encryption_callback() {
		?>
		<fieldset>
			<legend class="screen-reader-text"><span><?php _e( 'Encryption', 'amgsessmtp' ); ?></span></legend>
			<p><input <?php echo!isset( $this->options['smtp_encryption'] ) ? "checked" : ''; ?> id="smtp_ssl_none" type="radio" name="wp_ses_smtp_option[smtp_encryption]" value="none" <?php checked( 'none', isset( $this->options['smtp_encryption'] ) ? $this->options['smtp_encryption'] : ''  ); ?> />
				<label for="smtp_ssl_none"><?php _e( 'No encryption.', 'amgsessmtp' ); ?></label></p>
			<p><input id="smtp_ssl_ssl" type="radio" name="wp_ses_smtp_option[smtp_encryption]" value="ssl" <?php checked( 'ssl', isset( $this->options['smtp_encryption'] ) ? $this->options['smtp_encryption'] : ''  ); ?> />
				<label for="smtp_ssl_ssl"><?php _e( 'Use SSL encryption.', 'amgsessmtp' ); ?></label></p>
			<p><input id="smtp_ssl_tls" type="radio" name="wp_ses_smtp_option[smtp_encryption]" value="tls" <?php checked( 'tls', isset( $this->options['smtp_encryption'] ) ? $this->options['smtp_encryption'] : ''  ); ?> />
				<label for="smtp_ssl_tls"><?php _e( 'Use TLS encryption. This is not the same as STARTTLS. For most servers SSL is the recommended option.', 'amgsessmtp' ); ?></label></p>
		</fieldset>
		<?php
	}

	public function smtp_authentication_callback() {
		?>
		<fieldset>
			<legend class="screen-reader-text"><span><?php _e( 'Authentication', 'amgsessmtp' ); ?></span></legend>
			<p><input id="smtp_auth_true" <?php echo!isset( $this->options['smtp_authentication'] ) ? 'checked="checked"' : ''; ?> type="radio" name="wp_ses_smtp_option[smtp_authentication]" value="true" <?php checked( 'true', isset( $this->options['smtp_authentication'] ) ? $this->options['smtp_authentication'] : ''  ); ?> />
				<label for="smtp_auth_true"><?php _e( 'Yes: Use SMTP authentication.', 'amgsessmtp' ); ?></label></p>	
			<p><input <?php //echo!isset( $this->options['smtp_authentication'] ) ? "checked" : '';                                                                  ?> id="smtp_auth_false" type="radio" name="wp_ses_smtp_option[smtp_authentication]" value="false" <?php checked( 'false', isset( $this->options['smtp_authentication'] ) ? $this->options['smtp_authentication'] : ''  ); ?> />
				<label for="smtp_auth_false"><?php _e( 'No: Do not use SMTP authentication.', 'amgsessmtp' ); ?></label></p>			
			<span class="description"><?php _e( 'If this is set to no, the values below are ignored.', 'amgsessmtp' ); ?></span>
		</fieldset>
		<?php
	}

	public function smtp_username_callback() {
		printf(
				'<input type="text" id="smtp_username" class="regular-text" size="40" name="wp_ses_smtp_option[smtp_username]" value="%s" /><span class="description">%s</span>', isset( $this->options['smtp_username'] ) ? esc_attr( $this->options['smtp_username'] ) : '', __( 'Enter your SMTP username here.', 'amgsessmtp' )
		);
	}

	public function smtp_password_callback() {
		printf(
				'<input type="text" id="smtp_password" class="regular-text" size="40" name="wp_ses_smtp_option[smtp_password]" value="%s" /><span class="description">%s</span>', isset( $this->options['smtp_password'] ) ? esc_attr( $this->options['smtp_password'] ) : '', __( 'Enter your SMTP password here.', 'amgsessmtp' )
		);
	}
	
	public function amgsessmtp_tracking_admin_notice() {
		global $current_user;
		$user_id = $current_user->ID;
		/* Check that the user hasn't already clicked to ignore the message */
		if (!get_user_meta($user_id, 'wp_email_tracking_ignore_notice')) {
			?>
			<div class="updated um-admin-notice"><p><?php _e('Allow WP Amazon SES SMTP Plugin to send you setup guide? Opt-in to our newsletter and we will immediately e-mail you a setup guide along with 20% discount which you can use to purchase any theme.', 'amgsessmtp'); ?></p><p><a href="<?php echo plugin_dir_url(__FILE__) . 'smtp.php?wp_email_tracking=email_smtp_allow_tracking'; ?>" class="button button-primary"><?php _e('Allow Sending', 'amgsessmtp'); ?></a>&nbsp;<a href="<?php echo plugin_dir_url(__FILE__) . 'smtp.php?wp_email_tracking=email_smtp_hide_tracking'; ?>" class="button-secondary"><?php _e('Do not allow', 'amgsessmtp'); ?></a></p></div>
			<?php
		}
	}

}
