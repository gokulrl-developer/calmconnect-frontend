import { useContext, useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useAppSelector } from "../../hooks/customReduxHooks";
import type { IRootState } from "../../store";
import { useParams } from "react-router-dom";
import { checkSessionAccessAPI } from "../../services/psychologistService";
import { toast } from "sonner";
import type {
  ChatMessage,
  ChatMessagePayload,
  JoinDeniedPayload,
  PeerJoinedPayload,
  SignalPayload,
  SocketConnectionErrorPayload,
  SocketErrorPayload,
} from "../../types/domain/socket.types";
import { logOut, refreshTokenAPI } from "../../services/authService";
import { CallContext } from "../../contexts/CallContext";
import { MessageSquare, Mic, MicOff, Send, Video, VideoOff, X } from "lucide-react";

const SIGNALING_URL = import.meta.env.VITE_API_URL;
const stunUrls = import.meta.env.VITE_STUN_SERVERS?.split(",") || [
  "stun:stun.l.google.com:19302",
];

const configuration: RTCConfiguration = {
  iceServers: stunUrls.map((url: string) => ({ urls: url })),
};

export const PsychVideoRoom = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const localRef = useRef<HTMLVideoElement | null>(null);
  const remoteRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [joined, setJoined] = useState(false);
  const [info, setInfo] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isChatMode, setIsChatMode] = useState(false);
  const { sessionId } = useParams<{ sessionId: string }>();

  const psychId = useAppSelector((state: IRootState) => state.auth.accountId);
  const isAuthenticated = useAppSelector(
    (state: IRootState) => state.auth.isAuthenticated
  );

  const { setInCall } = useContext(CallContext)!;

  // -------Mute toggling----------------
  useEffect(() => {
    toggleMute();
  }, [isMuted]);

  useEffect(() => {
    return () => {
      setInCall(false);
    };
  }, []);
  useEffect(() => {
    const s = io(`${SIGNALING_URL}/meeting`, { transports: ["websocket"] });
    setSocket(s);

    s.on("connect_error", async (err: SocketConnectionErrorPayload) => {
      const msg = err instanceof Error ? err.message : "Connection error";
      if (
        err.code === "INVALID_CREDENTIALS" ||
        err.code === "SESSION_EXPIRED"
      ) {
        await refreshTokenAPI();
      } else if (err.code === "BLOCKED") {
        if (isAuthenticated === true) {
          await logOut();
        }
      } else {
        console.error(msg);
        toast.error(msg);
      }
    });

    s.on("error", (payload: SocketErrorPayload) => {
      toast.error(payload.message);
    });

    s.on("join-accepted", async () => {
      setJoined(true);
      toast.success("successfully joined");
    });

    s.on("join-denied", (payload: JoinDeniedPayload) => {
      setInfo(`Join denied: ${payload.reason}`);
      toast.warning(`Join denied: ${payload.reason}`);
    });

    s.on("chat-history", (history: ChatMessage[]) => {
      setMessages(history);
    });

    s.on("chat-message", (m: ChatMessage) => {
      setMessages((prev) => [...prev, m]);
    });

    s.on("peer-joined", (payload: PeerJoinedPayload) => {
      console.log("peer joined", payload);
      toast.info("User joined the meeting");
    });

    s.on("signal", async (payload: SignalPayload) => {
      if (!pcRef.current) await initPeerConnection();
      const pc = pcRef.current!;
      if (payload.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.data as RTCSessionDescriptionInit));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        s.emit("signal", {
          sessionId,
          type: "answer",
          data: pc.localDescription,
        });
      } else if (payload.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.data as RTCSessionDescriptionInit));
      } else if (payload.type === "ice") {
        try {
          await pc.addIceCandidate(payload.data as RTCIceCandidateInit);
        } catch (e: unknown) {
          console.warn("addIceCandidate failed", e);
        }
      }
    });

    s.on("peer-left", () => {
      toast.info("The client left the call");

      if (remoteRef.current && remoteRef.current.srcObject) {
        const tracks = (remoteRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
        remoteRef.current.srcObject = null;
      }

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      setJoined(false);
      handleLeave();
      setInfo("Peer left the session");
    });
    return () => {
      s.disconnect();
    };
  }, []);

  async function checkAndJoin() {
    try {
      const res = await checkSessionAccessAPI(sessionId!);
      if (res.data?.allowed) {
        socket?.emit("join-room", { sessionId });
        await startLocalStream();
        await initPeerConnection(true);
        setInCall(true);
        setInfo("You joined the meeting");
      } else {
        setInfo("Not allowed to join");
        toast.warning("Not allowed to join");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setInfo(err.message);
        toast.error(err.message);
      } else if (typeof err === "string") {
        setInfo(err);
        toast.error(err);
      } else {
        setInfo("Cannot join session");
        toast.error("Cannot join session");
      }
    }
  }

  async function startLocalStream() {
    if (localStreamRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      stream.getAudioTracks().forEach((track) => (track.enabled = false));
      localStreamRef.current = stream;
      if (localRef.current) localRef.current.srcObject = stream;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("media error", err.message);
        toast.error(err.message);
      } else {
        console.error("Unknown media error", err);
        toast.error("Cannot access camera/mic");
      }
    }
  }

  async function initPeerConnection(makeOffer = false) {
    if (pcRef.current) return pcRef.current;
    const pc = new RTCPeerConnection(configuration);

    pc.onicecandidate = (e) => {
      if (e.candidate)
        socket?.emit("signal", { sessionId, type: "ice", data: e.candidate });
    };

    pc.ontrack = (ev) => {
      if (remoteRef.current) {
        const [stream] = ev.streams;
        remoteRef.current.srcObject = stream;
      }
    };

    if (localStreamRef.current) {
      for (const track of localStreamRef.current.getTracks()) {
        pc.addTrack(track, localStreamRef.current);
      }
    } else {
      try {
        await startLocalStream();
        for (const track of localStreamRef.current!.getTracks()) {
          pc.addTrack(track, localStreamRef.current!);
        }
      } catch (e: unknown) {
        console.warn(e);
      }
    }

    pcRef.current = pc;

    if (makeOffer) {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socket?.emit("signal", {
        sessionId,
        type: "offer",
        data: pc.localDescription,
      });
    }
    return pc;
  }

  const handleLeave = async () => {
    socket?.emit("leave-room", { sessionId });
    setJoined(false);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    pcRef.current?.close();
    pcRef.current = null;

    if (localRef.current) localRef.current.srcObject = null;
    if (remoteRef.current) remoteRef.current.srcObject = null;
    setInCall(false);
    toast.info("You left the meeting");
  };
  async function sendMessage() {
    if (!text.trim()) return;
    socket?.emit("chat-message", { sessionId, text } as ChatMessagePayload);
    setText("");
  }

  function toggleMute() {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }
  return (
    <div className="flex h-screen text-gray-900 relative">
      {/* Left: Video Area */}
      <div className={`flex flex-col w-full flex-1 p-6 relative z-10 ${isChatMode === true ? "md:w-3/4" : ""}`}>
        <div className={`flex items-center gap-3 mb-4 ${joined === true ? "hidden" : ""}`}>
          {!joined && (<button
            onClick={checkAndJoin}
            disabled={joined}
            className={`px-4 py-2 rounded-lg font-medium text-white transition ${joined
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
              }`}
          >
            <Video />
          </button>
          )}
          {!joined && (
          <p className="hidden">{info}</p>
          )}
        </div>

        {/* Live Videos */}
        <div className="h-[90%] w-full flex items-center gap-2 relative">
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            className="md:w-1/2 w-full h-full bg-black object-cover absolute md:relative top-0 bottom-0 right-0 left-0"
          />
          <video
            ref={localRef}
            autoPlay
            playsInline
            muted
            className="w-1/4 md:w-1/2 h-1/5 md:h-full bg-black border-black border-4 md:border-0 object-cover z-20 md:z-auto absolute md:relative bottom-2 right-2 md:bottom-0 md:right-0"
          />
        </div>
        <div className={`h-[10%] w-full flex justify-center gap-3 items-center ${joined === false ? "hidden" : ""}`}>
          <button
            onClick={handleLeave}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
          >
            <VideoOff />
          </button>
          <button
            onClick={() => setIsMuted((prev) => !prev)}
            className={`px-4 py-2 rounded-lg font-medium text-white transition ${isMuted
              ? "bg-gray-500 hover:bg-gray-600"
              : "bg-yellow-500 hover:bg-yellow-600"
              }`}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </button>
          <button
            onClick={() => setIsChatMode((prev) => !prev)}
            className={`px-4 py-2 rounded-lg font-medium text-white transition ${isChatMode
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-500 hover:bg-gray-600"
              }`}
          >
            <MessageSquare />
          </button>
        </div>
      </div>

      {/* Right: Chat */}
        {joined && isChatMode===true &&(
        <div className={`md:w-1/4 w-3/4 h-full border-l border-gray-200 bg-white flex flex-col z-20 md:z-auto md:relative absolute right-0 top-0`}>
          <div className="p-4 border-b border-gray-100 relative">
            <h4 className="font-semibold text-lg">Chat</h4>
            <button className="absolute right-1 top-1"
            onClick={()=>setIsChatMode((prev)=>!prev)}
            >
              <X/>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.chatMessageId || `${m.senderId}:${m.createdAt}`}
                className={`max-w-[80%] px-3 py-2 rounded-xl shadow-sm ${m.senderId === psychId
                    ? "self-end bg-green-100 text-right ml-auto"
                    : "self-start bg-gray-100"
                  }`}
              >
                <div className="text-xs text-gray-500 mb-1">
                  {m.senderId === psychId ? "You" : m.senderName}
                </div>
                <div className="text-sm">{m.text}</div>
                <div className="text-[10px] text-gray-400 mt-1">
                  {new Date(m.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>

          <div className="p-1 border-t border-gray-100 flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-5/6 px-2 py-2 border border-black rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm"
            />
            <button
              onClick={sendMessage}
              className="w-1/6 px-2 py-2 bg-green-500 hover:bg-green-700 text-white text-sm font-medium flex justify-center items-center"
            >
              <Send size={16}/>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
