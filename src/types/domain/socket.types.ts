
export type JoinRoomPayload = { sessionId: string };
export type LeaveRoomPayload = { accountId: string };
export type JoinDeniedPayload = {
  reason: string;
};
export type SignalPayload = {
  sessionId: string;
  type: "offer" | "answer" | "ice";
  data: any;
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
  role: "user" | "psychologist";
  sessionId?: string;
}
