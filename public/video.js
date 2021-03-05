const socket = io.connect("http://localhost:4000");
const mainPage = document.getElementById("main-page")
const joinButton = document.getElementById("join-btn")
const meetingRoom = document.getElementById("video-room")
const localVideo = document.getElementById("local-video")
const peerVideo = document.getElementById("peer-video")
const roomName = document.getElementById("roomName")
let isHost = false;


joinButton.addEventListener("click" , ()=>{
    console.log("trying to join the room")

    function attemptConnect(){
        console.log("Joining the room");
        navigator.getUserMedia({audio : false , video : {width:400 , height:300}}
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
    }
    if (roomName.value !== "") {
        socket.emit("joining" , roomName.value);
    } else {
        console.log("Can't join, please provide a name first");
        alert("Please provide a name first");
    }


    socket.on("created" , () => {
        attemptConnect();
        isHost = true;
    })
    socket.on("joined" , () => {
        attemptConnect();
    })
    socket.on("full" , () => {
        alert("Room is full, Can not join");
    })
    socket.on("ready" , () => {

    })
    socket.on("candidate" , () => {

    })
    socket.on("offer" , () => {

    })
    socket.on("answer" , () => {

    })
})
