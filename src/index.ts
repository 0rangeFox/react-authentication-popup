import { MessagePayloadData, MessagePayload, ResponseLocationType } from './interfaces';
import { MessagingType } from './types';
import { AuthenticationPopup } from './components';
import { generateRequestMessage, generateResultMessage } from './utils';

export default AuthenticationPopup;

export type { MessagePayloadData, MessagePayload };

export {
  MessagingType,
  ResponseLocationType,
  generateRequestMessage,
  generateResultMessage,
};
