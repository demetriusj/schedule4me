'use strict';
import mongoose from 'mongoose';
import SlackBot from 'slackbots';
import fetch from 'node-fetch';
import axios from 'axios';

import trainer from './trainer'
import oauth from './oauth'

import Event from '../models/Event';

export default function bot(app) {
    let bot = new SlackBot({token: process.env.SLACKBOT_OAUTH_TOKEN, name: 'schedule4me'});

    // bot.run();
    //
    // bot.on('start', function() {
    //      more information about additional params https://api.slack.com/methods/chat.postMessage
    //         var params = {
    //             icon_emoji: ':cat:'
    //         };
    //
    //          define channel, where bot exist. You can adjust it there https://my.slack.com/services
    //         bot.postMessageToChannel('general', 'meow!', params);
    //
    //          define existing username instead of 'user_name'
    //         bot.postMessageToUser('user_name', 'meow!', params);
    //
    //          If you add a 'slackbot' property,
    //          you will post to another user's slackbot channel instead of a direct message
    //         bot.postMessageToUser('user_name', 'meow!', { 'slackbot': true, icon_emoji: ':cat:' });
    //
    //          define private group instead of 'private_group', where bot exist
    //         bot.postMessageToGroup('private_group', 'meow!', params);
    // });

    /**
     * @param {object} data
     */

    bot.on('message', function(data) {

        if (typeof(data.text) !== "undefined") {
            let url = "https://slack.com/api/users.profile.get?" + "token=xoxp-335755701217-337133111606-335741401984-4446b6991406e72e8ab7ae8d460570d4" + "&user=" + data.user;
            trainer(data).then(function(res) {
                axios.get(url).then(function(response) {

                    let newEvent = new Event({
                        event_name: res.result.parameters.Description,
                        full_name: response.data.profile.real_name,
                        email: response.data.profile.email,
                        location: res.result.parameters.location,
                        start: new Date(res.result.parameters.date + "T" + res.result.parameters.time),
                        invitee_emails: response.data.profile.email,
                        description: res.result.resolvedQuery
                    });

                    newEvent.save(function(error, event) {
                        if (error) {
                            return console.error(error);
                        } else {
                            console.log("SUCCESS!");
                            oauth(app, event);
                        }
                    });
                }).catch(function(error) {
                    console.log(error);
                });
            }).catch(function(err) {
                console.log(err);
            });

        }

    });

}
