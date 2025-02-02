<?php
/**
 * Yoast SEO: Local plugin file.
 *
 * @package WPSEO_Local\Admin\
 * @since   4.1
 * @ToDo    CHECK THE @SINCE VERSION NUMBER!!!!!!!!
 */

if ( ! defined( 'WPSEO_LOCAL_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! class_exists( 'WPSEO_Local_Admin_API_Keys' ) ) {

	/**
	 * WPSEO_Local_Admin_API_Keys class.
	 *
	 * Build the WPSEO Local admin form.
	 *
	 * @since   11.8
	 */
	class WPSEO_Local_Admin_API_Keys {

		/**
		 * Holds the slug for this settings tab.
		 *
		 * @var string
		 */
		private $slug = 'api_keys';

		/**
		 * Holds WPSEO Local Core instance.
		 *
		 * @var WPSEO_Local_Core;
		 */
		private $wpseo_local_core;

		/**
		 * Holds the API keys repository.
		 *
		 * @var WPSEO_Local_Api_Keys_Repository $wpseo_local_api_key_repository
		 */
		private $wpseo_local_api_key_repository;

		/**
		 * @var WPSEO_Local_Timezone_Repository $wpseo_local_timezone_repository Holds the Timezone repository object;
		 */
		private $wpseo_local_timezone_repository;

		/**
		 * WPSEO_Local_Admin_API_Keys constructor.
		 */
		public function __construct() {
			$this->get_core();
			$this->get_timezone_repository();
			$this->get_api_keys_repository();

			add_filter( 'wpseo_local_admin_tabs', array( $this, 'create_tab' ) );
			add_filter( 'wpseo_local_admin_help_center_video', array( $this, 'set_video' ) );

			add_action( 'wpseo_local_admin_' . $this->slug . '_content', array( $this, 'tab_content' ), 10 );

			add_action( 'Yoast\WP\Local\before_option_content_' . $this->slug, [ $this, 'maybe_show_google_maps_api_key_update_notification' ] );
		}

		/**
		 * Set WPSEO Local Core instance in local property.
		 */
		private function get_core() {
			global $wpseo_local_core;
			$this->wpseo_local_core = $wpseo_local_core;
		}

		/**
		 * Set WPSEO Local Core Timezone Repository in local property.
		 */
		private function get_timezone_repository() {
			$this->wpseo_local_timezone_repository = new WPSEO_Local_Timezone_Repository();
		}

		/**
		 * Set WPSEO Local API Keys Repository in local property.
		 */
		private function get_api_keys_repository() {
			$this->wpseo_local_api_key_repository = new WPSEO_Local_Api_Keys_Repository();
		}

		/**
		 * @param array $tabs Array holding the tabs.
		 *
		 * @return mixed
		 */
		public function create_tab( $tabs ) {
			$tabs[ $this->slug ] = array(
				'tab_title'     => __( 'API key', 'yoast-local-seo' ),
				'content_title' => __( 'Google Maps API Key', 'yoast-local-seo' ),
			);

			return $tabs;
		}

		/**
		 * @param array $videos Array holding the videos for the help center.
		 *
		 * @return mixed
		 */
		public function set_video( $videos ) {
			$videos[ $this->slug ] = 'https://yoa.st/screencast-local-settings-api-keys';

			return $videos;
		}

		/**
		 * Create tab content for API Settings.
		 */
		public function tab_content() {

			$api_key         = $this->wpseo_local_api_key_repository->get_api_key();
			$browser_api_key = $this->wpseo_local_api_key_repository->get_api_key( 'browser' );

			/* Only show this bit of copy if the old API keys are filled and the new one is not filled or defined as a constant in wp_config. */
			if ( empty( $api_key ) ) {
				echo '<p>' . esc_html__( 'Google has changed their API key functionality, so you only need one key for all the services. After you have generated this key you can enter the key here. The other two keys will then no longer be used.', 'yoast-local-seo' ) . '</p>';
			}
			/* translators: %1$s extends to the anchor opening tag '<a href="https://yoa.st/gm-api-browser-key" target="_blank">', %2$s closes that tag. */
			echo '<p>' . sprintf( esc_html__( 'For more information on how to create and set your Google Maps API key, open the help center or %1$scheck our knowledge base%2$s.', 'yoast-local-seo' ), '<a href="https://yoa.st/gm-api-browser-key" target="_blank">', '</a>' ) . '</p>';

			if ( ! defined( 'WPSEO_LOCAL_GOOGLEMAPS_API_KEY' ) ) {
				WPSEO_Local_Admin_Wrappers::textinput( 'googlemaps_api_key', __( 'Google Maps API key', 'yoast-local-seo' ) );
			}
			if ( defined( 'WPSEO_LOCAL_GOOGLEMAPS_API_KEY' ) ) {
				/* translators: %s extends to the API Key constant name */
				echo '<p class="help">' . sprintf( esc_html__( 'You defined your Google Maps API key using the %s PHP constant.', 'yoast-local-seo' ), '<code>WPSEO_LOCAL_GOOGLEMAPS_API_KEY</code>' ) . '</p>';
			}

			/**
			 * Only show this section if the Google API key is not set (by input field or constant) and the browser and server key are set.
			 * This means that it's an old install that might still use the old Google API keys.
			 */
			if ( empty( $api_key ) && ! empty( $browser_api_key ) ) {
				echo '<h3>' . esc_html__( 'API browser key for Google Maps', 'yoast-local-seo' ) . '</h3>';
				/* translators: %1$s extends to the anchor opening tag '<a href="https://yoa.st/gm-api-browser-key" target="_blank">', %2$s closes that tag. */
				echo '<p>';
				echo sprintf( esc_html__( 'A Google Maps browser key is required to show Google Maps and make use of the Store Locator. For more information on how to create and set your %1$sGoogle Maps browser key%2$s, open the help center or %3$scheck our knowledge base%4$s.', 'yoast-local-seo' ), '<a href="https://yoa.st/gm-api-browser-key" target="_blank">', '</a>' );
				echo '</p>';
				if ( ! defined( 'WPSEO_LOCAL_API_KEY_BROWSER' ) ) {
					WPSEO_Local_Admin_Wrappers::textinput( 'local_api_key_browser', __( 'Google Maps API browser key (required)', 'yoast-local-seo' ) );
				}
			}
		}

		/**
		 * Maybe display a notification that the API key has been changed.
		 */
		public function maybe_show_google_maps_api_key_update_notification() {
			if ( get_transient( 'wpseo_local_api_key_changed' ) ) {
				$message = sprintf(
				/* translators: 1: HTML <a> open tag; 2: <a> close tag. */
					esc_html__( 'You\'ve successfully set a Google Maps API Key! Now you\'re able to display Google Maps on your website. Also you can automatically calculate the coordinates of your business location under the %1$sBusiness info tab%2$s.', 'yoast-local-seo' ),
					'<a href="' . esc_url( admin_url( 'admin.php?page=wpseo_local#top#general' ) ) . '" data-action="link-to-tab" data-tab-id="general">',
					'</a>'
				);

				if ( wpseo_has_multiple_locations() ) {
					$message = sprintf(
					/* translators: 1: HTML <a> open tag; 2: <a> close tag. */
						esc_html__( 'You\'ve successfully set a Google Maps API Key! Now you\'re able to display Google Maps on your website. Also you can automatically calculate the coordinates of your %1$sbusiness locations%2$s.', 'yoast-local-seo' ),
						'<a href="' . esc_url( admin_url( 'edit.php?post_type=wpseo_locations' ) ) . '">',
						'</a>'
					);
				}

				WPSEO_Local_Admin::display_notification( $message, 'success' );

				delete_transient( 'wpseo_local_api_key_changed' );
			}
		}
	}
}
