'use strict';
import mongoose from 'mongoose';
import SlackBot from 'slackbots';
import fetch from 'node-fetch';
import axios from 'axios';

import trainer from './trainer'
import oauth from './oauth'

import Event from '../models/Event';
import User from '../models/User';

export default function bot(app) {
    let bot = new SlackBot({token: process.env.SLACKBOT_OAUTH_TOKEN, name: 'ScheduleRightMeow'});

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
            if (!data.user) {
                console.log('Message send by bot, ignoring');
                return;
            }
            let url = "https://slack.com/api/users.profile.get?" + `token=${process.env.SLACK_OAUTH}`+ "&user=" + data.user;
            trainer(data).then(function(dialogresponse) {
                let emails = [];
                let names = dialogresponse.result.parameters['given-name'];
                for(let i=0; i < names.length; i++) {
                    User.findOne({name: names[i].toLowerCase()}).then(function(user) {
                        emails.push({'email': user.email});
                    }).catch(function(error) {
                        console.log(error);
                    });
                }
                axios.get(url).then(function(response) {
                    // console.log('Does it get here')
                    if (dialogresponse.result.actionIncomplete) {
                        bot.postMessage(data.channel, `${dialogresponse.result.fulfillment.speech}`, {icon_emoji: ':cat:'});
                    } else {
<<<<<<< HEAD
                        // bot.postMessage(data.channel, `ACTiON COMPLETE `, {icon_emoji: ':cat:'});
                        axios.get('https://slack.com/api/chat.postMessage',{
                          params: {
                            token: process.env.SLACKBOT_OAUTH_TOKEN,
                            channel: data.channel,
                            text:'Checking if this works',
                            "attachments": JSON.stringify([
                                {
                                  "fallback": "Required plain-text summary of the attachment.",
                                  "color": "#2eb886",
                                  "pretext": "Optional text that appears above the attachment block",
                                  "author_name": "Bobby Tables",
                                  "author_link": "http://flickr.com/bobby/",
                                  "author_icon": "http://flickr.com/icons/bobby.jpg",
                                  "title": "Slack API Documentation",
                                  "title_link": "https://api.slack.com/",
                                  "text": "Optional text that appears within the attachment",
                                  "callback_id": "game_selection",
                                  "actions": [
                                      {
                                          "name": "games_list",
                                          "text": "Pick a game...",
                                          "type": "select",
                                          "options": [
                                              {
                                                  "text": "Hearts",
                                                  "value": "hearts"
                                              },
                                              {
                                                  "text": "Bridge",
                                                  "value": "bridge"
                                              },
                                              {
                                                  "text": "Checkers",
                                                  "value": "checkers"
                                              },
                                              {
                                                  "text": "Chess",
                                                  "value": "chess"
                                              },
                                              {
                                                  "text": "Poker",
                                                  "value": "poker"
                                              },
                                              {
                                                  "text": "Falken's Maze",
                                                  "value": "maze"
                                              },
                                              {
                                                  "text": "Global Thermonuclear War",
                                                  "value": "war"
                                              }
                                        ]
                                }
                            ]
                          }]),
                          icon_emoji: ':cat:'
                          }
                        }).then(resp => {
                          console.log(resp)
                        })
                        .catch(err => {
                          console.log(err)
                        })
=======
                        bot.postMessage(data.channel, `I have scheduled your ${dialogresponse.result.parameters.Description} for ${dialogresponse.result.parameters.date ? new Date(dialogresponse.result.parameters.date + "T" + dialogresponse.result.parameters.time) : new Date()}!`, {icon_emoji: ':cat:'});
>>>>>>> 8d8cb9b07b4dd53f031a2a85f17f8eec3b826d7a
                        let newEvent = new Event({
                            event_name: dialogresponse.result.parameters.Description,
                            full_name: response.data.profile.real_name,
                            email: response.data.profile.email,
                            location: dialogresponse.result.parameters.location.toString(),
                            start: dialogresponse.result.parameters.date ? new Date(dialogresponse.result.parameters.date + "T" + dialogresponse.result.parameters.time) : new Date(),
                            invitee_emails: emails,
                            description: dialogresponse.result.resolvedQuery
                        });

                        // newEvent.save(function(error, event) {
                        //     if (error) {
                        //         return console.error(error);
                        //     } else {
                        //         console.log("SUCCESS!");
                        //         oauth(app, event);
                        //     }
                        // });
                    }
                }).catch(function(error) {
                    console.log(error);
                });
            }).catch(function(err) {
                console.log(err);
            });

        }

    });

}
