export const SignalPayloadType = {
  OFFER: "offer",
  ANSWER: "answer",
  ICE: "ice",
} as const;
export type SignalPayloadType =
  typeof SignalPayloadType[keyof typeof SignalPayloadType];
