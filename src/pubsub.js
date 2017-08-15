/*
      publish
      subscribe


     */
var PubSub = {},
    messages = {},
    lastUid = -1,
    PRE = 'uid_';

function isFunc(value){
    return Object.prototype.toString.apply(value) === '[Object Function]';
}

function getKey(obj, key){

    if(obj.hasOwnProperty(key)){
        return key;
    }
    return false;
}

function throwException(ex){
    return function tException(){
        throw ex;
    }
}

function publish(message, data, sync){
    var subscribers = messages[message];
    if(!subscribers){
        return false;
    }

    for(var p in subscribers){
        if(subscribers.hasOwnProperty(p)){
            subscribers[p](message, data);
        }
    }
}

function subscribe(message, func){
    if(typeof func !== 'function'){
        return false;
    }

    if(!getKey(messages, message)){
        messages[message] = {};
    }

    var token = PRE + (++lastUid);
    messages[message][token] = func;

    return token;
}


function unsubscribe(value){
    var subscribers,
        isMessage = typeof value === 'string' && value in messages,
        token = !isMessage && typeof value === 'string',
        func = isFunc(value);


    if(isMessage){
        delete messages[value];
        return;
    }

    for(var p in messages){
        subscribers = messages[p];

        if(token){
            if(value in subscribers){
                delete subscribers[value];
                break;
            }
        }else if(func){
            for(var p in messages){
                subscribers = messages[p];

                for(var s in subscribers){
                    if(subscribers[s] === value){
                        delete subscribers[s];
                        break;
                    }
                }
            }
        }
    }

}

function clearAllSubscriptions(){
    messages = {}
}

function clearSubscriptions(topic){
    var t;

    for(t in messages){
        if(messages.hasOwnProperty(t) && (t === topic || t.indexOf(topic + '.') === 0)){
            delete messages[t];
        }
    }
}

PubSub.subscribe = subscribe;
PubSub.publish = publish;
PubSub.unsubscribe = unsubscribe;
PubSub.clearAllSubscriptions = clearAllSubscriptions;
PubSub.clearSubscriptions = clearSubscriptions;

window.PubSub = PubSub;

module.exports = PubSub