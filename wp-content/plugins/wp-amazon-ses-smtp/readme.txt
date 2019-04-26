=== WP Amazon SES SMTP ===
Contributors: pankajagarwal
Tags: amazon ses, ses, ses smtp, ses protocol, smtp, amazon ses smtp, wp ses smtp, amazon, autoresponder, deliverability, email, mail, newsletter, service, smtp, webservice, wp_mail, email sending, outgoing emails, tls, wp mail
Requires at least: 3.0.1
Tested up to: 4.9.8
Stable tag: 1.0.5
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

== Description ==

With WP Amazon SES SMTP plugin you can connect Amazon SES to your WordPress website for sending emails. It bypasses the normal WP mail function and sends email using Amazon SES service.
Simply add your Amazon SES Hostname, Choose the Region of your SES account, Add Username and Password and start delivering emails through Amazon SES.

###Below are the list of settings that you have to add to start using the plugin:

1. SES Region: Choose the location in which your SES account has been approved.
2. Hostname: Based on selected region Hostname field will be automatically pre-filled.
3. Username: Add SMTP username that's been provided by Amazon for sending emails.
4. Password: Add SMTP password to connect with SES.
5. Protocol: Usually the SES SMTP connects over the TLS protocol so we will be using the same in the plugin.

You can also try sending a test email with the plugin to check whether all your configurations are working correctly.


== Installation ==

1. Upload the plugin to your WordPress site.
2. Activate the plugin.
3. Set the options like From Email, From Name, Return Path, Ses Region, Username and Password etc, inside the plugin options by going to Settings -> Amazon SES SMTP
4. Send a test email to check everything is working properly.
5. Enjoy


== Screenshots ==
1. Screenshot of Email and SMTP options.
2. Screenshot of test email option.

== Changelog ==
= 1.0.0 =
* Initial Release

= 1.0.1 =
* Added a new SMTP server link.

= 1.0.2 =
* Tested with the new version of WordPress and also added a new message.

= 1.0.3 =
* Added the admin notice function.

== Upgrade Notice ==
= 1.0.0 =
* Initial release

= 1.0.1 =
* Please upgrade to latest version