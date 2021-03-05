var mainPage = document.getElementById("main-page")
var joinButton = document.getElementById("join-btn")
var meetingRoom = document.getElementById("video-room")
var localVideo = document.getElementById("local-video")
var peerVideo = document.getElementById("peer-video")
var roomName = document.getElementById("roomName")


joinButton.addEventListener("click" , ()=>{
    console.log("trying to join the room")

    if (roomName.value !== "") {
        console.log("Joining the room");
        navigator.getUserMedia({audio : true , video : {width:400 , height:300}}
            ,(stream)=>{
            console.log('Media access success');
            localVideo.srcObject = stream;
            localVideo.onloadedmetadata = function (e){
                localVideo.play().then(r => console.log("video is playing"));
            }
            mainPage.style = "display : none";
            }
            , ()=>{
            console.log('Media access failed');
            })
    } else {
        console.log("Can't join, please provide a name first");
        alert("Please provide a name first");
    }
})
