import { MessagePayloadData } from '../interfaces';
import { MessagingType } from '../types';

const generateRequestMessage = (): MessagePayloadData<void> => ({
  message: MessagingType.REQUEST_MESSAGE,
});

const generateResultMessage = <T>(data: T): MessagePayloadData<T> => ({
  message: MessagingType.RESULT_MESSAGE,
  result: data,
});

export { generateRequestMessage, generateResultMessage };
