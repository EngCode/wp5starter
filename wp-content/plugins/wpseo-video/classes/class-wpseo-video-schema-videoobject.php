<?php
/**
 * Class to generate VideoObject Schema.
 *
 * @package    WordPress SEO
 * @subpackage WordPress SEO Video
 *
 * @since      11.1
 */

/**
 * Class WPSEO_Video_Schema_VideoObject
 */
class WPSEO_Video_Schema_VideoObject implements WPSEO_Graph_Piece {

	/**
	 * Holds the video data.
	 *
	 * @var array
	 */
	private $video;

	/**
	 * Holds the schema data.
	 *
	 * @var array
	 */
	private $data;

	/**
	 * A value object with context variables.
	 *
	 * @var WPSEO_Schema_Context
	 */
	private $context;

	/**
	 * WPSEO_Video_Schema_VideoObject constructor.
	 *
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 *
	 * @return void
	 */
	public function __construct( WPSEO_Schema_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Determines whether we need to run our VideoObject piece.
	 *
	 * @return bool True if it should be run, false if not.
	 */
	public function is_needed() {
		if ( ! is_singular() ) {
			return false;
		}

		if ( WPSEO_Video_Utils::is_videoseo_active_for_posttype( get_post_type() ) === false ) {
			return false;
		}

		$this->get_video_data();
		if ( ! $this->should_have_video_schema() ) {
			return false;
		}

		return true;
	}

	/**
	 * Generates the Schema data for a video.
	 *
	 * @link  https://schema.org/VideoObject
	 * @link  https://developers.google.com/search/docs/data-types/video
	 *
	 * @return array $this->data VideoObject Schema data for video.
	 */
	public function generate() {
		$post = get_post( $this->context->id );

		$this->data = array(
			'@type'        => 'VideoObject',
			'@id'          => $this->context->canonical . WPSEO_Video_Schema::VIDEO_HASH,
			'name'         => $this->context->title,
			'thumbnailUrl' => $this->video['thumbnail_loc'],
			'description'  => $this->context->description,
			'uploadDate'   => gmdate( 'c', strtotime( $post->post_date ) ),
		);

		if ( empty( $this->data['description'] ) ) {
			$this->data['description'] = trim( wp_html_excerpt( strip_shortcodes( $post->post_content ), 300 ) );
		}

		$this->add_video_size();
		$this->add_video_urls();
		$this->add_duration();
		$this->add_video_family_friendly();

		return $this->data;
	}

	/**
	 * Checks if the post should have video schema.
	 *
	 * @return bool True if video schema should be output for the post, false if not.
	 */
	private function should_have_video_schema() {
		if ( ! is_array( $this->video ) || $this->video === array() ) {
			return false;
		}

		$disable = WPSEO_Meta::get_value( 'videositemap-disable', $this->context->id );
		if ( $disable === 'on' ) {
			return false;
		}

		return true;
	}

	/**
	 * Grabs the video data from meta data.
	 *
	 * @return void
	 */
	private function get_video_data() {
		$this->video = WPSEO_Meta::get_value( 'video_meta', $this->context->id );
		// We add on video details to the same array. Ugly.
		$this->video = WPSEO_Video_Utils::get_video_image( $this->context->id, $this->video );
	}

	/**
	 * Adds the video size.
	 *
	 * @return void
	 */
	private function add_video_size() {
		if ( ! empty( $this->video['width'] ) && ! empty( $this->video['height'] ) ) {
			$this->data['width']  = $this->video['width'];
			$this->data['height'] = $this->video['height'];
		}
	}

	/**
	 * Adds the video's URLs.
	 *
	 * @return void
	 */
	private function add_video_urls() {
		if ( isset( $this->video['player_loc'] ) ) {
			$this->data['embedUrl'] = $this->video['player_loc'];
		}
		if ( isset( $this->video['content_loc'] ) ) {
			$this->data['contentUrl'] = $this->video['content_loc'];
		}
	}

	/**
	 * Adds the video's duration.
	 *
	 * @return void
	 */
	private function add_duration() {
		$video_duration = WPSEO_Video_Utils::get_video_duration( $this->video, $this->context->id );
		if ( $video_duration !== 0 ) {
			$this->data['duration'] = WPSEO_Video_Utils::iso_8601_duration( $video_duration );
		}
	}

	/**
	 * Adds the family friendly attribute.
	 *
	 * @return void
	 */
	private function add_video_family_friendly() {
		$is_family_friendly = 'true';
		if ( WPSEO_Video_Utils::is_video_family_friendly( $this->context->id ) === false ) {
			$is_family_friendly = 'false';
		}
		$this->data['isFamilyFriendly'] = $is_family_friendly;
	}
}
