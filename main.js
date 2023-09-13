let localStream;
let remoteStream;
let peerConnection;
let servers = {
    iceServers:[
        {
            urls:['stun:stun1.1.google.com:19302', 'stun:stun2.1.google.com:19302']
        }
    ]
}
const init=async () =>{
    localStream=await navigator.mediaDevices.getUserMedia({video:true,audio:false})

    document.querySelector("#user-1").srcObject=localStream
}

init()

const createOffer=async()=>{
    peerConnection=new RTCPeerConnection(servers)

    remoteStream= new MediaStream()
    document.querySelector("#user-2").srcObject=remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack=async (event) =>{
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    peerConnection.onicecandidate=async (event)=>{
        if(event.candidate){
            document.querySelector("#offer-sdp").value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer=await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
}

const createAnswer=async()=>{
    let peerConnection=new RTCPeerConnection(servers)

    remoteStream= new MediaStream()
    document.querySelector("#user-2").srcObject=remoteStream

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream)
    })

    peerConnection.ontrack=async (event) =>{
        event.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track)
        })
    }

    peerConnection.onicecandidate=async (event)=>{
        if(event.candidate){
            document.querySelector("#answer-sdp").value = JSON.stringify(peerConnection.localDescription)
        }
    }

    let offer=document.querySelector("#offer-sdp").value
    if(!offer) return alert("offer not get")
    await peerConnection.setRemoteDescription(JSON.parse(offer))

    let answer=await peerConnection.createAnswer()
 
    await peerConnection.setLocalDescription(answer)



}

const Answer=async()=>{
    let answer = document.getElementById('answer-sdp').value
    if(!answer) return alert('Retrieve answer from peer first...')

    answer = JSON.parse(answer)

    if(!peerConnection.currentRemoteDescription){
        peerConnection.setRemoteDescription(answer)
    }
}


document.querySelector("#create-offer").addEventListener("click",createOffer)
document.querySelector("#create-answer").addEventListener("click",createAnswer)
document.querySelector("#add-answer").addEventListener("click",Answer)
