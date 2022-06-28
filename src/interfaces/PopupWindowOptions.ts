type PopupWindowOptions = {
  [key in 'height' | 'width' | 'top' | 'left' as string]?: number;
};

export default PopupWindowOptions;
