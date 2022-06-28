import { MessagePayloadData, MessagePayload, ResponseLocationType, ResponseData } from './interfaces';
import { MessagingType } from './types';
import { AuthenticationPopup } from './components';
import { generateRequestMessage, generateResultMessage } from './utils';

export default AuthenticationPopup;

export type {
  MessagePayloadData,
  MessagePayload,
  ResponseData
};

export {
  MessagingType,
  ResponseLocationType,
  generateRequestMessage,
  generateResultMessage,
};
