/*** NotificationChannelNtfy Z-Way HA module *******************************************

Version: 1.0.0
-----------------------------------------------------------------------------
Author: Jens Poxleitner <jpoxleitner@gmail.com>
Description:
    This module allows to send notifications via ntfy.
	Module based on Pushover Module from Vitaliy Yurkin/Z-Wave.me

******************************************************************************/

// ----------------------------------------------------------------------------
// --- Class definition, inheritance and setup
// ----------------------------------------------------------------------------

function NotificationChannelNtfy (id, controller) {
    // Call superconstructor first (AutomationModule)
    NotificationChannelNtfy.super_.call(this, id, controller);
}

inherits(NotificationChannelNtfy, AutomationModule);

_module = NotificationChannelNtfy;

// ----------------------------------------------------------------------------
// --- Module instance initialized
// ----------------------------------------------------------------------------

NotificationChannelNtfy.prototype.channelID = function() {
        return this.getName() + "_" + this.id;
};

NotificationChannelNtfy.prototype.init = function (config) {
    NotificationChannelNtfy.super_.prototype.init.call(this, config);

    var self = this;
    this.controller.registerNotificationChannel(this.channelID(), config.user, "Push to " + config.ntfyURL + " (prio "+config.priority+")", function(message) {
        self.sender(message);
    });
};

NotificationChannelNtfy.prototype.stop = function () {
    NotificationChannelNtfy.super_.prototype.stop.call(this);

    this.controller.unregisterNotificationChannel(this.channelID());
};

// ----------------------------------------------------------------------------
// --- Module methods
// ----------------------------------------------------------------------------

NotificationChannelNtfy.prototype.sender = function (message) {
    console.log(this.getName() + " Sending a message to " + this.config.ntfyURL);

    http.request({
        method: 'POST',
        url: this.config.ntfyURL,
        async: true,
        data: message,
        headers: {
            'Title': this.config.prefix,
            'Tags': this.config.tags,
            'Priority': this.config.priority			
        },
        error: function(response) {
            console.log("NotificationChannelNtfy-ERROR: " + response.statusText);
        }
    });
}
