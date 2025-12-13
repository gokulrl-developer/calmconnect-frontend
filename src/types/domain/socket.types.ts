import { Role } from "../../constants/Role";
import type { SignalPayloadType } from "../../constants/signal-payload.-type";
export type JoinRoomPayload = { sessionId: string };
export type LeaveRoomPayload = { accountId: string };
export type JoinDeniedPayload = {
  reason: string;
};
export type SignalPayload = {
  sessionId: string;
  type: SignalPayloadType;
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
};

export type ChatMessagePayload = {
  sessionId: string;
  text: string;
};

export interface ChatMessage {
  sessionId: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: Date;
  id: string;
}

export type PeerJoinedPayload = {
  accountId: string;
  name?: string;
};

export type PeerLeftPayload = {
  accountId: string;
};

export interface SocketData {
  accountId: string;
  role: typeof Role.USER| typeof Role.PSYCHOLOGIST;
  sessionId?: string;
}

export interface SocketErrorPayload {
  message:string
}

export interface SocketConnectionErrorPayload {
  message:string,
  code:string
}