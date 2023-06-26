export enum MessageTypeEnum {
  text = 'text',
  image = 'image',
  video = 'video',
  another = 'another',
}

export enum FriendStatusEnum {
  NONE = 'NONE',
  ADDED = 'ADDED',
  RECEIVER_PENDING = 'RECEIVER_PENDING',
  REQUESTER_PENDING = 'REQUESTER_PENDING',
  DECLINED = 'DECLINED',
}

export enum CallType {
  CALL_INITIATED = 'CALL_INITIATED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  DISCONNECT = 'DISCONNECT',
}
