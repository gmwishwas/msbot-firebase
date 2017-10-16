'use strict';

const functions = require('firebase-functions');

exports.moderator = functions.database
        .ref('/messages/{messageId}').onWrite(event => {
        const message = event.data.val();

if (message && !message.updated) {
    // Retrieved the message values.
    console.log('Retrieved message content: ', message);

    const updatedMessage = "wishwas "+message;

    // Update the Firebase DB with checked message.
    console.log('Message has been updated. Saving to DB: ', updatedMessage);
    return event.data.adminRef.update({
        text: updatedMessage,
        updated: true
    });
}
});