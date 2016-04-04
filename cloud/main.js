
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi Toni');
});

Parse.Cloud.define("addFriendToFriendsRelation", function(request, response) {

    Parse.Cloud.useMasterKey();

    var friendRequestId = request.params.friendRequest;
    var query = new Parse.Query("FriendRequest");

    //get the friend request object
    query.get(friendRequestId, {

        success: function(friendRequest) {

            //get the user the request was from
            var fromUser = friendRequest.get("requestFrom");
            //get the user the request is to
            var toUser = friendRequest.get("requestTo");

            var relation = fromUser.relation("friends");
            //add the user the request was to (the accepting user) to the fromUsers friends
            relation.add(toUser);

            //save the fromUser
            fromUser.save(null, {

                success: function() {

                    //saved the user, now edit the request status and save it
                    friendRequest.set("status", "APPROVED");
                    //friendRequest.set("channelId", fromUser.get("objectId")+"$"+toUser.get("objectId"));
                    friendRequest.save(null, {

                        success: function() {

                            response.success("saved relation and updated friendRequest");
                        }, 

                        error: function(error) {

                            response.error(error);
                        }

                    });

                },

                error: function(error) {

                 response.error(error);

                }

            });

        },

        error: function(error) {

            response.error(error);

        }

    });

});