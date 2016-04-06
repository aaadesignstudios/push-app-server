
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
            
            var relation1 = toUser.relation("friends");


            //add the user the request was to (the accepting user) to the fromUsers friends
            relation.add(toUser);
			relation1.add(fromUser);

            //save the fromUser
            fromUser.save(null, {

                success: function() {

		               toUser.save(null, {

		                success: function() {

		                    //get the user the request was from
		                    var fromUserM = friendRequest.get("requestFrom");
		                    //get the user the request is to
		                    var toUserM = friendRequest.get("requestTo");

		                    //saved the user, now edit the request status and save it
		                    friendRequest.set("status", "APPROVED");
		                    friendRequest.set("channelId", fromUserM.id+"$channel$"+toUserM.id);
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

        },

        error: function(error) {

            response.error(error);

        }

    });

});


Parse.Cloud.define("removeFriendToFriendsRelation", function(request, response) {

    Parse.Cloud.useMasterKey();

    var friendRequestId = request.params.friendRequest;
    var state = request.params.state;
    var query = new Parse.Query("FriendRequest");

    //get the friend request object
    query.get(friendRequestId, {

        success: function(friendRequest) {

            //get the user the request was from
            var fromUser = friendRequest.get("requestFrom");
            //get the user the request is to
            var toUser = friendRequest.get("requestTo");

            var relationFrom = fromUser.relation("friends");
            //add the user the request was to (the accepting user) to the fromUsers friends
            relationFrom.remove(toUser);

            var relationTo = toUser.relation("friends");
            //add the user the request was to (the accepting user) to the fromUsers friends
            relationTo.remove(fromUser);

            //save the fromUser
            fromUser.save(null, {

                success: function() {

                    toUser.save(null, {

                    success: function() {

                        //saved the user, now edit the request status and save it
                        friendRequest.set("status", state);
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

        },

        error: function(error) {

            response.error(error);

        }

    });

});