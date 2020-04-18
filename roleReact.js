const { Client } = require("discord.js"); //imports for Client, emoji handling and reactions for discord.js
const client = new Client();
const { commands } = require("commands.js");

var messageID = "668623232861208596";

client.login(process.env.BOT_TOKEN);

client.on("ready", () => {
  //to check if bot is awake
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setGame("with Node.JS :)");
});

//create a raw event handler for grabbing the user who reacted

client.on('raw', event => {
  const eventName = event.t;
  //check event handler for reaction add
  if (eventName === 'MESSAGE_REACTION_ADD') {
    if (event.d.message_id === messageID) {
      var reactChannel = client.channels.get(event.d.channel_id);
      //check if we ALREADY have cached the message we shall react to.
      if (reactChannel.messages.has(event.d.message_id)) {
        return;
      } else {
        //this will get the message if we haven't cached it. THEN it will grab the emoji
        reactChannel.fetchMessage(event.d.message_id)
          .then(msg => {
            //get ok emoji reaction, future: make into a list to choose from.
            var msgReaction = msg.reactions.get("👌");
            //grab id of users who have reacted to the message.
            var user = client.users.get(event.d.user_id);
            //GOTO: messageReactionAdd event
            client.emit('customMessageReactionAdd', msgReaction, user);
          })
          .catch(error => console.log(error));//log any errors with message handling (expected when no msg available).
      }
    }
  }
  //check event handler for reaction removal.
  else if (eventName === 'MESSAGE_REACTION_REMOVE') {
    if (event.d.message_id === messageID) {
      var reactChannel = client.channels.get(event.d.channel_id);
      if (reactChannel.messages.has(event.d.message_id)) {
        return;
      } else {
        //this will get the message if we haven't cached it. THEN it will grab the emoji
        reactChannel.fetchMessage(event.d.message_id)
          .then(msg => {
            //get ok emoji reaction, future: make into a list to choose from.
            var msgReaction = msg.reactions.get("👌");
            //grab id of users who have reacted to the message.
            var user = client.users.get(event.d.user_id);
            //GOTO: messageReactionRemove event
            client.emit('customMessageReactionRemove', msgReaction, user);
          })
          .catch(error => console.log(error));//log any errors with message handling (expected when no msg available).
      }
    }
  }
});

//handler for giving roles on reaction add
// TODO: We can use the MessageReaction(Add/Remove) event here, but it will be a relatively big change.
// Reference: https://discordjs.guide/popular-topics/reactions.html#listening-for-reactions-on-old-messages
client.on('customMessageReactionAdd', (messageReaction, user) => {

  //find role with name of phiRole
  var phiRole = "PHI";
  var role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === phiRole.toLowerCase());


  if (role) {
    //when we found the role, we need to get the user's id to add the role.
    var member = messageReaction.message.guild.members.find(member => member.id === user.id);
    if (member) {
      member.addRole(role.id);
    }
  }

});


client.on('customMessageReactionRemove', (messageReaction, user) => {
  //find role with name of phiRole
  var phiRole = "PHI";
  var role = messageReaction.message.guild.roles.find(role => role.name.toLowerCase() === phiRole.toLowerCase());


  if (role) {
    //when we found the role, we need to get the user's id to remove the role.
    var member = messageReaction.message.guild.members.find(member => member.id === user.id);
    if (member) {
      member.removeRole(role.id);
    }
  }
});

// Message handlers
client.on('message', msg => {
  var command = msg.content.split(" ")[0];

  if (command.substring(0,1) == "!") {
    console.log(`Command received from ${msg.author}: ${command}`);

	// Only run the command if it exists
	if( command in commands ) {
		commands[command]( msg );
	}
  }
});
