import PopupWindowOptions from './PopupWindowOptions';
import OtherOptions from './OtherOptions';

interface PopupWindowConstructor {
  id?: string;
  url: string;
  popupOptions?: PopupWindowOptions;
  otherOptions?: OtherOptions;
}

export default PopupWindowConstructor;
