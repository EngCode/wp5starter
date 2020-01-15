### Tornado UI Starter Template [ قالب لبدأ مشاريع جديدة على الووردبريس ]
------------------
Tornado Starter Template is a Advanced Wordpress Theme Startup Enviroment With Tools and Baisc Structure To Help Your Get Ready and Speed the Development Process Current Wordpress Version 5.1

---------------------
##### 13/03/2019 Changelog
	Adding new Customizer Options for Social Media and Organize the Meta/Schema Options
	 -- Existen Social URLs [Facebook,Twitter,Instagram]
	 -- new added [LinkedIn, Whatsapp, Youtube, Google, Dribble, ]
---------------------
##### 11/03/2019 Changelog
	Cleaning Head Tag and Improving Preformance and Speed By Removing the List Below / Source in [/inc/functions/preformance.php]
	 -- Removing (RSD) Link [Remove this Line if You Ment to integrate with services like flicker]
	 -- Removing "Windows Live Writer" link for Editing Shortcut
	 -- Remove "WordPress version" tag and Hide it from RSS
	 -- Remove RSS Feed for Comments
	 -- Remove Emoji Scripts and Styles
	 -- Remove WP Embed Scripts  [this is for embeding WordPress posts from other people's blogs/websites.]
	 -- Remove Gutenberg Default CSS File
	 -- Remove Recent Comments Default Widget Inline CSS
	 -- Removing Rich Content inline Styles
	 -- Remove Media Gallery Inline Styling
	 -- Disable Assets Versioning [Remove CSS/JS Files Versions]
---------------------
##### First Steps Checklist
	-'Setting up Your Config.php File and Install the CMS'
	-'Config the Theme by Replacing Images and Frontend CSS/JS Files for the New Project'
	-'Config the Theme Assets for the New Project in /inc/functions/theme-assets.php'
	-'Do Not Forget to Activate Debug Mode for Professional Development'
	-'Config the Theme Setting Page in Customizer You Can Track it From ==> [functions.php]'
	-'Create/Add Your Own Theme Setting as The New Frontend Needs or Provide'
	-'Do Not Forget the Customizer Design Options Default Values Change it With The New One'
	-'Config the Gutenberg Default Filters and Names From [src/php/gutenberg.php]'
	-'Start Customize and Confige the Core Post Types for the New Frontend'
	-'Create and Customize Your Custom Post Types as the Frontend Provide or Needs'
	-'Validate and Create Default Values for Any Interactive Part in Your Theme'
	-'Create and Integrate the Theme Design With Gutenberg Editor'

---------------------
##### Tornado Theme Structure
	# dist       [CSS/JS/Images for Frontend and Gutenberg Production Files]
	# header.php          [Theme Head Tag for Scripts and Stylesheets Calling Requests].
	# footer.php          [Theme Footer the HTML/Body Closing Tags and Footer Hooks]
	# index.php           [the Home Page File By Default Always Use it as Main Template]
	# 404.php             [Wordpress Core Error 404 Page by Default]
	# archive.php         [Archive is the Post Type Category that contains all Posts]
	# category.php        [WP Taxonomy thats shows all related posts to Category Taxonomy]
	# single.php          [Core WP Posts Details Page/Rich Content Page/Single Page]
	# comments.php        [Comments File that Contain Commenting Form and Comments List]
	# tag.php             [WP Taxonomy thats shows all related posts to Tags Taxonomy]
	# search.php          [Search Page is for Showing Search Result]
	# searchform.php      [Search Form for the get_search_form() Function]
	# sidebar.php         [the Core Sidebar Frontend Structure for the Widgets Container]
--------------------
##### Page Post Type Files/Templates
	# page.php                 [WP Page's Post Type for Creating Custom Pages]
	# page-empty.php           [Empity Page Template for the WP Page Post Type]
	# page-no-head.php         [Page Template Without a Page Head or Breadcrumb]
	# page-with-container.php  [Page Template With Grid System Container]

--------------------
##### Important Files/Folders

	# functions.php
	 --the Most Important File Where all Your Functions and Core Base Code Runs Deal With it
	   Carefully and Track all the Call Back in There
	---------------------------------------------------------------------------------------
	# inc        [Core PHP Files and Design Template Blocks/Parts ]
	 -- functions/                  '[Theme Core Functions Goes in functions.php]'
	  -- custom-post-types.php      '[Sample for Create Custom Post Types and Taxonomies]'
	  -- theme-assets.php           '[The Theme Frontend/Backend Assets Call Backs]'
	  -- theme-menus.php            '[Create and Register the Theme Menus Locations]'
	  -- theme-customizer.php       '[the Theme Settings/Options Page in the Customizer]'
	  -- theme-customizer (Folder)  '[the Customizer Options Functions Organized]'
	 ------------------------------------------------------------------------------------
	 -- template-parts/             '[Theme Frontend Dynamic Parts and Templates]'
	  -- custom-breadcumb.php       '[Custom Breadcrumb Using Yoast and Core WP Functions]'
	  -- custom-header.php          '[Custom Designed Header for Keeping header.php Clean]'
	  -- custom-footer.php          '[Custom Designed Footer or Keeping footer.php Clean]'
	  ------------------------------------------------------------------------------------
	  -- widgets.php                '[Create/Register Sidebar Widgets]'
	  -- widgets (Folder)           '[The Widgets Frontend Templates]'
	   -- blog-categories.php       '[a Widget for Showing the Category Taxonomy List]'
	   -- blog-search.php           '[a Widget Template for Showing Search Form]'
	   -- lateast-blogs.php         '[a Widget Template for Showing Lateast Posts]'
	   ------------------------------------------------------------------------------------
	  -- blocks (Folder)            '[the Dynamic Theme Design Blocks/Parts Organized]'
	   -- classic-post.php          '[Classic Post Template for Using it inside Loops]'
	   -- widget-post.php           '[Small Classic Post Template for Widget Loops]'
	 ---------------------------------------------------------------------------------------
	# src               '[the Source Files for the Frontend and the Gutenberg Editor]'
	 -- javascript      '[for Frontend Only]'
	 -- SCSS            '[Core CSS for Frontend & Gutenberg & Customizer]'
	 -- blocks          '[React.JS Core Files for Gutenberg Blocks]'
	  -- 01_Tornado     '[Tornado Framework Blocks Helpful for Any Project as Extra Assets]'
	 -- php             '[Gutenberg Blocks Dynamic Integration With Wordpress RESET APIs]'
	  -- gutenberg.php  '[Gutenberg Settings/Filters for Changing Default Settings]'
--------------------
##### Other Files/Folders
	# .eslintrc.json      [ES Linter Setting for ES6 JS Code ]
	# node_modules        [Node.JS Packages and Tools For Development Enviroment]
	# package.json
	  --the NPM Packages Manager Settings and CMD Scripts Runner Keep this in Mind if you 
	    are Working With the JS of Gutenberg and Frontend Code
---------------------
##### Quality Checklist
	# SEO Testing
	# Performance and Speed
	# Data Structure [Schema.Org] Testing
	# Open Graph Checking
	# Activating SSL Mode
	# W3C Mark-up Structure Validation
	# Responsive and Interactive
	# Default Settings/Values as Placeholder for no Error
	# Form's Controls Validation for [Errors/Warining/Success/Thank You] Interactive
	# Activate Errors Pages and Controling Every [css/js/images] Files Request
	# Spam and Robots Protection Captcha for Interactive Form's

---------------------
##### Included Functions in [functions.php] file
	---------------------------------------------------------------------------------------
	thumbnail_link($placholder)
	 '- [Prints Thumbnail/Fetured Image Link With Alternative Link if its Empty]'
	---------------------------------------------------------------------------------------
	get_category_name()
	 '- [Prints the Post Category Name related to Category Taxonomy]'
	---------------------------------------------------------------------------------------
	pagination($wp_query_variable)
	 '- Prints a Pagination List With Class Name pagination Be Careful the Pagination
	    Functionality it a bit Tricky'
	---------------------------------------------------------------------------------------
	getPostViews($postID) ==> to get the Post ID use get_the_ID()
	 '- Prints the Post Views Count'
---------------------
##### Tips and Hints
	Always Use the [ new WP_Query() ] Function for Custom Post Type Loops for
	no Confilcts or Erros With the Core Query'
	---------------------------------------------------------------------------------------
	Always Use the Core Wordpress File Naming for Creating the Archive or Category
	List for Custom Post Types if you Want the Pagination to Work Perfectly
	Without Any Dropdowns or Errors
	---------------------------------------------------------------------------------------
	Hint for Frontend Navigation Menu Active Classes ==> [
	 -- current-menu-item,
	 -- current-menu-parent,
	 -- current-menu-ancestor,
	 -- menu-item-has-children
	 -- current_page_item,
	 -- current-post-ancestor
	 -- current-post-parent
	]

---------------------

##### Wordpress Core Naming Pattern
	for creating an archive for the Custom Post Type or Taxonomy name the file with core Pattern here is the list
	----------------------------------
	• archive-{post-type-slug}.php             [Creates Archive for Custom Post Type]
	• single-{post-type-slug}.php              [Creates Single Page for Custom Post Type]
	• taxonomy-{taxonomy-slug}.php             [Create Archive for Custom Taxonomy]
	• taxonomy-{taxonomy-slug}-{term}.php      [Create Archive for Custom Taxonomy Term]
	----------------------------------
	• category-{slug}.php                      [Create Custom Archive for Category Term]
	• tag-{slug}.php                           [Create Custom Archive for Tags Term]
	• page-{slug}.php                          [Create Custom Page for Specific Page Post]
	----------------------------------
	use thes name Pattern for creating an archive for custom post types witch represent a module category to
	make your custom module loop list and to be able to use the core main query instead of the Custom Query
	Witch May Causing Problems in some situations
---------------------
##### Included Plugins and Tools
	# PolyLang                                   [ Multi Language Manager ]
	# Yoast SEO                                  [ SEO Manager ]
	# Contact 7                                  [ Custom Frontend Forms ]
	# WP Amazon SES SMTP                         [ Email Sending Client for Forms ]
	# Duplicate Post (Developing Mode Only)      [ Posts Duplicator for Fast Testing ] 
---------------------
**Developers Note : Alwayes Turn On Debug Mode and Eleminate any Warning/Error or even Notes ,** 
Standard and Clean / Human... Readable Code Please for Evolving Opportunities.

---------------------
**Created With ♥ By Abdullah.Ramadan for the Team**