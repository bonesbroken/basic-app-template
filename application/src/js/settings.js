import $ from "jquery";
import '@shoelace-style/shoelace/dist/themes/dark.css';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/rating/rating.js';
import '@shoelace-style/shoelace/dist/components/divider/divider.js';
import '@shoelace-style/shoelace/dist/components/breadcrumb/breadcrumb.js';
import '@shoelace-style/shoelace/dist/components/breadcrumb-item/breadcrumb-item.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/color-picker/color-picker.js';
import '@shoelace-style/shoelace/dist/components/range/range.js';
import '@shoelace-style/shoelace/dist/components/alert/alert.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/radio/radio.js';
import '@shoelace-style/shoelace/dist/components/radio-button/radio-button.js';
import '@shoelace-style/shoelace/dist/components/radio-group/radio-group.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';
import '@shoelace-style/shoelace/dist/components/tree/tree.js';
import '@shoelace-style/shoelace/dist/components/tree-item/tree-item.js';
import '@shoelace-style/shoelace/dist/components/carousel/carousel.js';
import '@shoelace-style/shoelace/dist/components/carousel-item/carousel-item.js';
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('./shoelace');

// streamlabs api variables
let username, streamlabs, streamlabsOBS;
let activeAppSourceId = 0;

let oldSettings = {};
let appSettings = {};

async function loadElements() {
    await Promise.allSettled([
        customElements.whenDefined('sl-range'),
        customElements.whenDefined('sl-icon'),
        customElements.whenDefined('sl-checkbox'),
        customElements.whenDefined('sl-dialog'),
        customElements.whenDefined('sl-select'),
        customElements.whenDefined('sl-divider'),
        customElements.whenDefined('sl-details'),
        customElements.whenDefined('sl-switch'),
        customElements.whenDefined('sl-range'),
        customElements.whenDefined('sl-tab'),
        customElements.whenDefined('sl-carousel')
    ]);
}

$(function() {
    loadElements();
    init();
});

async function init() {
    streamlabs = window.Streamlabs;
    streamlabs.init({ receiveEvents: true, twitchChat: true }).then(async (data) => {
        appSettings = data;
        console.log('user data', appSettings);
        username = appSettings.profiles.streamlabs.name;

        // load user settings
        initOBSApi();
        await loadUserSettings();
    });

    streamlabs.onChatMessage(event => {
        console.log('chat message', event);
        //let message = event.body;
        if(toggleChatControl) {
            let message = event.body;


            if (message.toLowerCase() == 'up') { 
                upKeyUp = true; 
                upKey.material = activeUpKeyMaterial;
                setTimeout(() => {
                    upKeyUp = false; 
                    upKey.material = upKeyMaterial;
                }, keyDelay);
            }
            if (message.toLowerCase() == 'left') { 
                leftKeyUp = true; 
                leftKey.material = activeLeftKeyMaterial;
                setTimeout(() => {
                    leftKeyUp = false; 
                    leftKey.material = leftKeyMaterial;
                }, keyDelay);
            }
            if (message.toLowerCase() == 'down') { 
                downKeyUp = true; 
                downKey.material = activeDownKeyMaterial;
                setTimeout(() => {
                    downKeyUp = false; 
                    downKey.material = downKeyMaterial;
                }, keyDelay);
            }
            if (message.toLowerCase() == 'right') { 
                rightKeyUp = true; 
                rightKey.material = activeRightKeyMaterial;
                setTimeout(() => {
                    rightKeyUp = false; 
                    rightKey.material = rightKeyMaterial;
                }, keyDelay);
            }
            if (message.toLowerCase() == 'jump' || message.toLowerCase() == 'space') { 
                spaceKey.material = activeSpaceKeyMaterial;
                spaceKeyUp = true;
                setTimeout(() => {
                    spaceKeyUp = false;
                    spaceKey.material = spaceKeyMaterial;
                }, keyDelay);
            }
            if (message.toLowerCase() == 'shift') { 
                if(shiftKey)
                    shiftKey.material = activeShiftKeyMaterial;
                shiftKeyUp = true;
                setTimeout(() => {
                    shiftKeyUp = false;
                    if(shiftKey)
                        shiftKey.material = shiftKeyMaterial;
                }, keyDelay);
            }
            if (message.toLowerCase() == 'ctrl') { 
                if(ctrlKey)
                    ctrlKey.material = activeCtrlKeyMaterial;
                ctrlKeyUp = true;
                setTimeout(() => {
                    ctrlKeyUp = false;
                    if(ctrlKey)
                        ctrlKey.material = ctrlKeyMaterial;
                }, keyDelay);
            }
        }
    });

    streamlabs.onMessage(event => {
        if(event.type == "updateKeyTrak")
            return;

    });

    streamlabs.onFollow(event => {});

    streamlabs.onSubscription(event => {
    });

    streamlabs.onDonation(event => {
    });

    streamlabs.onBits(event => {
    });

    /*
    streamlabs.onRaid(event => {
        if(settings["onRaid"]) {
            lastEventMessage = `${event.message[0].name} raided with ${event.message[0].raiders}!`;
            Keyboard.updateDisplay("event", eventDisplayObj, lastEventMessage, settings["Event Display Color"]);
        }
    });

    streamlabs.onMerch(event => {
        if(settings["onMerch"]) {
            lastEventMessage = `${event.message[0].from} bought ${event.message[0].product}!`;
            Keyboard.updateDisplay("event", eventDisplayObj, lastEventMessage, settings["Event Display Color"]);
        }
    });

    streamlabs.onSuperchat(event => {
        if(settings["onSuperchat"]) {
            lastEventMessage = `${event.message[0].name} Super Chat ${event.message[0].displayString}!`;
            Keyboard.updateDisplay("event", eventDisplayObj, lastEventMessage, settings["Event Display Color"]);
        }
    });

    streamlabs.onStreamlabels(event => {
        if (settings["Enable Stream Label Display"]) {
            let key = settings["Active Stream Label"];
            lastStreamLabelMessage = event.message.data[key];
            Keyboard.updateDisplay("streamlabel", streamLabelDisplayObj, lastStreamLabelMessage, settings["Stream Label Display Color"]);
        }
    })
    */
}

function initOBSApi() {
    streamlabsOBS = window.streamlabsOBS;
    streamlabsOBS.apiReady.then(() => {
        streamlabsOBS.v1.Sources.getSources().then(sources => { // check if app source exists in scene collection
            sources.forEach(source => { 
                if(source.type == "browser_source" && source.appSourceId == "basic_app_source") {
                    hasAppSource = true;
                    activeAppSourceId = source.id;
                    console.log("existing app source found", hasAppSource, activeAppSourceId);
                    updateAddAppSourceButton(hasAppSource);
                }
            });
    
            if(!hasAppSource) {
                updateAddAppSourceButton(hasAppSource);
            }
        });
    
        streamlabsOBS.v1.Sources.sourceAdded(source => {
            if(hasAppSource)  {// existing source in scene
                console.log('existing app source found, returning');
                return;
            }

            if(!hasAppSource && source.appSourceId == "basic_app_source") {
                hasAppSource = true;
                activeAppSourceId = source.id;
                console.log("new app source added", hasAppSource, activeAppSourceId);
                updateAddAppSourceButton(hasAppSource);
            }
        });
    
        streamlabsOBS.v1.Sources.sourceRemoved(id => {
            if(activeAppSourceId == id) {
                console.log('source removed', id)
                hasAppSource = false;
                updateAddAppSourceButton(hasAppSource);

            }
        });
    });
}

async function loadUserSettings() {
    streamlabs.userSettings.get('customKeyboardSettings').then(data => {
        console.log('loading user settings...', data);

        if (!data) {
            console.log("no settings found, reverting to default")
            data = Keyboard.defaultSettings;
            console.log('default data', data);
        }
        if (typeof data == "object") {

            // check for missing values
            for (const [key, value] of Object.entries(Keyboard.defaultSettings)) {
                if(!data.hasOwnProperty(key)) {
                    console.log(`setting '${key}' missing! set to ${value}`);
                    data[key] = Keyboard.defaultSettings[key];
                }
            }
            oldSettings = structuredClone(data);
            settings = structuredClone(data);
            settings['keyboard-logo'] = "";
        }
        
        registerHotkeys();
    });

    streamlabs.userSettings.getAssets().then(response => { 
        customAssets = response;
        saveCustomTextures();
        console.log('=== LOADED CUSTOM ASSETS ===');
    });

    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('=== LOADED USER SETTINGS ===');
            resolve();
        }, 1000);
    });
}

// event handlers
$("#app-link").on('click', () => { streamlabsOBS.v1.External.openExternalLink('https://bonesbroken.com/keyboard-overlay-app/'); });


$(".changelog-dismiss").on('click', () => { 
    $('#changelog').hide();
    settings['dismissChangelog'] = true;
    settings['changeLogVersion'] = Keyboard.changeLogVersion;
    streamlabs.userSettings.set('customKeyboardSettings', settings);
    streamlabs.postMessage('dismissChangelog', {'dismissChangelog': true});
});

$(".button-unsaved").on('click', () => { saveChanges(); });


function showUnsavedChanges() {
    if (equals(oldSettings, settings) == false) {
        $(".button-unsaved").show();
        $("nav").addClass("save-nav");
        $(".button-saved").hide();
    } else {
        $(".button-unsaved").hide();
        $("nav").removeClass("save-nav");
    }
}

function saveChanges() {
    if (equals(oldSettings, settings) == false) {
        streamlabs.userSettings.set('customKeyboardSettings', settings).then(() => {
            showAlert('#keyboardSettingsUpdated', `Your changes have been saved`, 'Your Keyboard Overlay has been updated.');
            $(".button-saved").show();
            $(".button-unsaved").hide();
            settings['keyboard-logo'] = "";
            
            registerHotkeys();

            streamlabs.userSettings.getAssets().then(response => { 
                customAssets = response;
                streamlabs.postMessage('updateTheme', settings);
            });
        });
        oldSettings = structuredClone(settings);
    }
}

function showAlert(element, title, content) {
    $(element)[0].show();
    $(element).find('.alert-title').text(title);
    $(element).find('.alert-content').text(content);
}

$('#onSubscription').on('sl-change', event => {
    settings["onSubscription"] = event.target.checked;
    showUnsavedChanges();
});

$('#onDonation').on('sl-change', event => {
    settings["onDonation"] = event.target.checked;
    showUnsavedChanges();
});

$('#onBits').on('sl-change', event => {
    settings["onBits"] = event.target.checked;
    showUnsavedChanges();
});

$('#onRaid').on('sl-change', event => {
    settings["onRaid"] = event.target.checked;
    showUnsavedChanges();
});

$('#onMerch').on('sl-change', event => {
    settings["onMerch"] = event.target.checked;
    showUnsavedChanges();
});

$('#onSuperchat').on('sl-change', event => {
    settings["onSuperchat"] = event.target.checked;
    showUnsavedChanges();
});

function startFakeChat(minDuration, maxDuration) {
    let fakeChatMessages = ["got it!!", "HEy!", "YOOO", "oof", "ehh", "cool!", "ok!", "huh?", "dude why", "sup?", "HAHA", "jump!", "up?", "left!1!", "down.", "down", "DOWN!", "UP!!", "right?", "RIGHT!", "real", "REAL", "LOL", "meh", "ha", "heh.", "wut", "why", "k dude", "watev", "k", "xDD", "n1 :)", "gg <3", "gg wp" ];
    let fakeChatUsernames = ["sly", "geo", "orgo", "Luna", "FLUX", "fury", "fox", "pulsE", "corn", "josh", "jane", "hails"];
    
    chatTimer = setInterval(() => {
        const rChat = fakeChatMessages[Math.floor(Math.random() * fakeChatMessages.length)];
        const rUser = fakeChatUsernames[Math.floor(Math.random() * fakeChatUsernames.length)];

        lastChatMessage = `${rUser}: ${rChat}`;
        Keyboard.updateDisplay("chat", chatDisplayObj, lastChatMessage, settings["Chat Display Color"]);

    }, Math.random() * ((maxDuration * 1000) - (minDuration * 1000)) + (minDuration * 1000));
}

function stopFakeChat() {
    clearInterval(chatTimer);
}