var previousSong = "?";
var isStarted = false;
var looped = false;
var host = false;

function newSong(e){
    document.getElementById("hide").style.visibility = 'visible ';
    $('#previous').text(previousSong);
    $('#correct').text("");
        $.getJSON($SCRIPT_ROOT + '/_next_song', {
            code: e
        }, function(data) {
            if(data.song_name === previousSong){
                newSong(e)
            }
            else{
                previousSong = data.song_name;
                document.getElementById("song").src=data.result;
                document.getElementById("song").width=0;
                document.getElementById("song").height=0;
            }

      });
}

function game(e){
    host = true;
    document.getElementById('start').style.visibility = 'hidden';
    newSong(e);
    setInterval(newSong, 30000, e);
}

$(document).ready(function () {
    setInterval(update, 100);

    function update(){
        $.getJSON($SCRIPT_ROOT + '/_update', {
        }, function(data) {
            var toAdd = '';
            isStarted = data.started;
            for(var i=0; i<data.players.length; i++){
                if(data.players[i].hasGuessed){
                    toAdd += '<div class="player-background-correct">' + data.players[i].username + ': ' + data.players[i].pointsInRoom + '</div>';
                }else{
                    toAdd += '<div class="player-background">' + data.players[i].username + ': ' + data.players[i].pointsInRoom + '</div>';
                }

            }
            $('#player_list').html(toAdd);

            if(isStarted){
                if(!looped){
                    gameLoop();
                    looped = true;
                }
            }

            if(data.correct){
                document.getElementById("hide").style.visibility = 'hidden';
                document.getElementById("song").width=704;
                document.getElementById("song").height=369;
            }
      });

    }

    function gameLoop(){
        if(!host){
            syncSong();
            setInterval(syncSong, 30010)
        }

    }

    function syncSong(){
        $('#previous').text(previousSong);
        document.getElementById("hide").hidden=false;
        $.getJSON($SCRIPT_ROOT + '/_sync_song', {
        }, function(data) {
            previousSong = data.song_name;
            document.getElementById("song").src=data.result;
            document.getElementById("song").width=0;
            document.getElementById("song").height=0;
      });
    }

    function sendMessage(){
        socket.send($('#myMessage').val());
        $('#myMessage').val('');
    }

    var socket = io.connect('https://' + document.domain + ':' + location.port);
            socket.on('echo', function(data){
                $('#response').html('<p>'+data.echo+'</p>');
            });

    //var socket = io.connect(location.protocol + "//" + document.domain + ":" + location.port + "/" );

    socket.on('message', function (msg) {
       $("#messages").append('<li>' + msg +'</li>')
    });

    $('#sendButton').on('click', function (){
        socket.send($('#myMessage').val());
        $('#myMessage').val('');
    });

   $(document).keypress(function(event){
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
		sendMessage();
	}

});


});
