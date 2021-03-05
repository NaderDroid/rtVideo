const socket = io.connect("http://localhost:4000");
const mainPage = document.getElementById("main-page")
const joinButton = document.getElementById("join-btn")
const meetingRoom = document.getElementById("video-room")
const localVideo = document.getElementById("local-video")
const peerVideo = document.getElementById("peer-video")
const roomName = document.getElementById("roomName")
let isHost = false;
const iceServers = {
    iceServers : [
        {urls:"stun:stun.services.mozilla.com"} ,
        {urls: "stun:stun1.l.google.com:19302"}
    ]
}
var rtcPeerConnection;
let userStream;

joinButton.addEventListener("click" , ()=>{
    console.log("trying to join the room")

    function attemptConnect(){
        console.log("Joining the room");
        navigator.getUserMedia({audio : false , video : {width:468 , height:380}}
            ,(stream)=>{
                console.log('Media access success');
                userStream = stream;
                localVideo.srcObject = stream;
                localVideo.onloadedmetadata = function (e){
                    localVideo.play().then(r => console.log("video is playing"));
                }
                mainPage.style = "display : none";
                socket.emit("ready" , roomName.value)
            }
            , ()=>{
                console.log('Media access failed');
            })
    }
    if (roomName.value !== "") {
        socket.emit("joining" , roomName.value);
    } else {
        console.log("Can't join, please provide a name first");
        alert("Please provide a name first");
    }


    socket.on("created" , () => {
        isHost = true;
        attemptConnect();
    })
    socket.on("joined" , () => {
        isHost = false;
        attemptConnect();
    })
    socket.on("full" , () => {
        alert("Room is full, Can not join");
    })
    socket.on("ready" , () => {
        if (isHost){
            rtcPeerConnection = RTCPeerConnection(iceServers);
            rtcPeerConnection.onicecandidate = onCandidate;
            rtcPeerConnection.ontrack = onTrack;
            rtcPeerConnection.addTrack(userStream.getTracks()[0] , userStream);
            rtcPeerConnection.addTrack(userStream.getTracks()[1] , userStream);
            rtcPeerConnection.createOffer((offer) => {
                socket.emit("offer" , offer,  roomName)
                console.log(offer)
            } , (error) => {
                console.log(error)
            })
        }
    })
    socket.on("candidate" , () => {

    })
    socket.on("offer" , () => {
        if (!isHost){
            rtcPeerConnection = RTCPeerConnection(iceServers);
            rtcPeerConnection.onicecandidate = onCandidate;
            rtcPeerConnection.ontrack = onTrack;
            rtcPeerConnection.addTrack(userStream.getTracks()[0] , userStream);
            rtcPeerConnection.addTrack(userStream.getTracks()[1] , userStream);
            rtcPeerConnection.createAnswer((answer) => {
                socket.emit("offer" , answer,  roomName.value)
                console.log(answer)
            } , (error) => {
                console.log(error)
            })
        }
    })
    socket.on("answer" , () => {

    })
})

function onCandidate(event){
    console.log("finding candidate")
    if (event.candidate){
        socket.emit("candidate" , event.candidate , roomName.value)

    }
}

function onTrack(event){
    console.log("remote video found");
    peerVideo.srcObject = event.streams[0];
    peerVideo.onloadedmetadata = function (e) {
        peerVideo.play().then(r => console.log("video is playing"));
    }
}