import { MessagingType } from '../types';

interface MessagePayloadData<T> {
  message: MessagingType;
  result?: T;
}

type MessagePayload<T> = MessageEvent<MessagePayloadData<T>>;

export default MessagePayload;
export type { MessagePayloadData };
