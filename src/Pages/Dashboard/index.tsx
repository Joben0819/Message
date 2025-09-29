import { useEffect, useRef, useState } from 'react'
import  {Zustand}  from '../../store'
import styles from './style.module.scss'
import Sidebar from '../../Component/Sidebar/index'
import Content from '../../Component/Content/index'
import { fetchApi } from '../../api/api'
interface tSidebar{
  persons: []
}
interface tContents{
  subtotal: Tsubtotal[]
}
interface Tsubtotal{
  created_at : string
  group : string
  message : string 
  sender : string
  user_id: string
  __v: number
  _id: string
}
interface Tmessage{
  message: string | null,
  group: string
}

const Dashboard = () => {
  const { session} = Zustand();
  const [sidebar, setSidebar] = useState<tSidebar>({persons:[]})
  const [message, setmessage] = useState<tContents>({subtotal: []})
  const [person, setperson] = useState<string>('')
  const [notification, setnotification] = useState<Tsubtotal[]>([])
  const [call, setcall] = useState(false)
  const [incomingCall, setIncomingCall] = useState<null | { from: string; sdp: string }>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const ApiSidebar = async() =>{
    fetchApi('users',{}, session?.token).then(
    res =>{
      setSidebar(res)
    })

  }

  const Person = (e: string) =>{
    const group = {group: e}
    setperson(e)
    fetchApi('allcomment', group, session?.token).then(
    res =>{
      setmessage(res)
    })
  }

  const OtherComment = () =>{
    fetchApi('othercomment', {}, session?.token).then(
    res =>{
      setnotification(res.subtotal)
    })
  }


  const Websocket = (message?: string, group?: string) =>{
    const websocket = new WebSocket('ws://localhost:8080', session?.token)
    const text: Tmessage =  {
      message: message as string,
      group: group as string
    }
    console.log(message, group)
    websocket.onopen = () =>{
      if(message !== undefined){
        websocket.send(JSON.stringify(text))

      }else{
        alert('no message')
      }
      websocket.onmessage = (e) => {
        const data =  JSON.parse(e.data)
        console.log(data.group === `${person}, ${session?.username}` || data.group === `${session?.username}, ${person}`, `${session?.username}, ${person}`)
        if(data.group === `${person}, ${session?.username}` || data.group === `${session?.username}, ${person}`){
        setmessage(prev => ({ subtotal: [...prev.subtotal, data] }))
        }else{
          const value = [...notification  , data]
          
          setnotification(value)
        }
      }
    }
    return websocket
  }

  const resetNotif = () => {
    setnotification([])
    ApiSidebar();
    OtherComment();
  }

  useEffect(() => {
    ApiSidebar();
    OtherComment();

    // prevent double init
    if (wsRef.current || pcRef.current) {
      console.log("⚠️ WebSocket/PeerConnection already initialized");
      return;
    }

    const ws = new WebSocket("ws://localhost:8080", session?.token || "");
    wsRef.current = ws;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(
      (stream) => {
        const localVideo = document.getElementById("local") as HTMLVideoElement;
        if (localVideo) localVideo.srcObject = stream;

        if (pc.signalingState !== "closed") {
          stream.getTracks().forEach((track) => {
            try {
              pc.addTrack(track, stream);
            } catch (err) {
              console.warn("Skipping addTrack, PC closed:", err);
            }
          });
        }
      }
    );

    pc.ontrack = (event) => {
      console.log("📥 Received remote track:", event.track.kind);
      setcall(true)
      const remoteVideo = document.getElementById("remote") as HTMLVideoElement;

      if (event.streams && event.streams[0]) {
        // attach the remote peer's combined stream (audio + video if available)
        remoteVideo.srcObject = event.streams[0];
      }
    };
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(JSON.stringify({ 
        type: "candidate",
        from: session?.username,
        target: person,
        candidate: event.candidate,  }));
      }
    };

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    ws.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      console.log("Received message:", e);
      // --- Chat ---
      if (data.group) {
        if (
          data.group === `${person}, ${session?.username}` ||
          data.group === `${session?.username}, ${person}`
        ) {
          setmessage((prev) => ({ subtotal: [...prev.subtotal, data] }));
        } else {
          setnotification((prev) => [...prev, data]);
        }
      }

      if (data.type === "offer") {
        if(data.target === session?.username){
        console.log("📞 Incoming call from", data.from);

        // Save the offer so we can accept/reject later
        setIncomingCall({ from: data.from, sdp: data.sdp });
        }
      }

      //  else if (data.type === "answer") {
      //   await pc.setRemoteDescription(new RTCSessionDescription(data));
      // } 
      else if (data.type === "answer") {
        if (pc.signalingState === "have-local-offer") {
          console.log('here',data)
          await pc.setRemoteDescription(new RTCSessionDescription(data));
        } else {
          console.warn(
            "Skipping setRemoteDescription for answer. Wrong state:",
            pc.signalingState
          );
        }
      }

      else if (data.type === "candidate") {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        } catch (err) {
          console.error("Error adding ice candidate:", err);
        }
      }
    };

    return () => {
      ws.close();
      pc.close();
      wsRef.current = null;
      pcRef.current = null;
    };
  }, []);


  // --- inside Dashboard component ---

// function to start a call
const startCall = async () => {
  if (!pcRef.current || !wsRef.current) {
    console.warn("⚠️ PeerConnection or WebSocket not ready");
    return;
  }
  if (!person) {
    console.warn("⚠️ No person selected to call");
    return;
  }
  const offer = await pcRef.current!.createOffer();
  await pcRef.current!.setLocalDescription(offer);

  // send via the SAME websocket stored in wsRef
  if (wsRef.current.readyState === WebSocket.OPEN) {
    wsRef.current.send(
      JSON.stringify({
        type: "offer",
        from: session?.username,
        target: 'Anne',
        sdp: offer.sdp,
      })
    );
    console.log("📞 Calling", person, "with offer");
    setcall(true)
  } else {
    console.warn("⚠️ WebSocket not open when trying to start call");
  }
};

const acceptCall = async (call: { from: string; sdp: string }) => {
  const pc = pcRef.current!;
  const ws = wsRef.current!;
  // // Apply remote offer
  await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: call.sdp }));

  // Create + send answer
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  ws.send(JSON.stringify({
    type: "answer",
    from: session?.username,
    target: call.from,
    sdp: answer.sdp,
  }));

  // Clear popup
  setIncomingCall(null);
};

const rejectCall = () => {
  console.log("❌ Call rejected");
  setIncomingCall(null);
};

 const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget)
    //console.log(formdata.get("content"), person)
    Websocket(formdata.get("content") as string, person)
  //const ws = Websocket(formdata.get("content") as string, person); // capture socket

    //ws?.close(); // close when component unmounts
  
  }
  useEffect(()=>{
    const handleResize = () => {
    const el = document.body;
    const container = document.getElementById('container')
    container!.style.width = el.clientWidth - 72 + 'px'
    //console.log(el.clientWidth)
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () =>{
      window.removeEventListener('resize', handleResize)
    }
  } ,[])


  return (
    <div className={styles.container} id='container'>
      <div className={styles.videocall} style={{display: call ? 'block' : 'none'}}>
      <video width='100' id="local" autoPlay playsInline muted></video>
      <video width='100' id="remote" autoPlay playsInline></video>
      </div>
        {incomingCall && (
          <div className="call-popup">
            <p>{incomingCall.from} is calling…</p>
          <button onClick={() => acceptCall(incomingCall)}>Accept</button>
            <button onClick={rejectCall}>Reject</button>
          </div>
        )}
 
      <Sidebar api={sidebar} func={Person} notification={notification} resetNotif={resetNotif} token={session?.token} active={person}/>
      <Content api={message} onSubmit={onSubmit} user={person} onClick={startCall}/>
    </div>
  )
}

export default Dashboard