import React, { FunctionComponent, PropsWithChildren } from 'react';
import PopupWindow from '../helpers/PopupWindow';
import { toQuery } from '../utils';
import {
  PayloadData,
  ResponseDataType,
  ResponseLocationType,
} from '../interfaces';
import ResponseData from '../interfaces/ResponseData';

interface AuthenticationPopupProps {
  id?: string;
  authorizationUrl: string;
  responseType: ResponseLocationType;
  onSuccess?: (data: ResponseData) => void;
  onFailure?: (err: Error) => void;
  buttonText?: string;
  popupWidth?: number;
  popupHeight?: number;
  className?: string;
  render?: (props: PropsWithChildren<{
    className?: string;
    buttonText?: string;
    onClick(): void;
  }>) => JSX.Element;
  isCrossOrigin?: boolean;
  onRequest?: () => void;
  clientId?: string;
  redirectUri?: string;
  scope?: string;
  state?: string;
  extraParams?: Record<string, any>;
}

const AuthenticationPopup: FunctionComponent<PropsWithChildren<AuthenticationPopupProps>> = (
  props: PropsWithChildren<AuthenticationPopupProps>
) => {
  let popup: PopupWindow;

  const onRequest = (): void => {
    const { onRequest } = props;
    return onRequest && onRequest();
  };

  const onFailure = (error: Error): void => {
    const { onFailure } = props;
    return onFailure && onFailure(error);
  };

  const onSuccess = (data: ResponseData): void => {
    const { responseType, onSuccess, isCrossOrigin } = props;
    const responseKey: string = ResponseDataType[responseType];

    // Cross-origin requests will already handle this, let's just return the data
    if (!isCrossOrigin && (responseKey !in (data as PayloadData))) {
      console.error('received data', data);
      return onFailure(
        new Error(`'${responseKey}' not found in received data`)
      );
    }

    return onSuccess && onSuccess(data);
  };

  const onBtnClick = (): void => {
    const {
      buttonText,
      authorizationUrl,
      state,
      responseType,
      popupWidth,
      popupHeight,
      isCrossOrigin,
      clientId,
      scope,
      redirectUri,
      extraParams,
    } = props;
    const payload: PayloadData = {
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      state,
      response_type: ResponseLocationType.getKey(responseType),
      ...extraParams,
    };

    const search: string = toQuery(payload);
    const width: number = popupWidth ?? 600;
    const height: number = popupHeight ?? 500;
    const left: number = window.screenX + (window.outerWidth - width) / 2;
    const top: number = window.screenY + (window.outerHeight - height) / 2.5;

    popup = PopupWindow.open({
      id: buttonText,
      url: `${authorizationUrl}?${search}`,
      popupOptions: {
        height,
        width,
        top,
        left,
      },
      otherOptions: {
        locationKey: responseType,
        isCrossOrigin,
      },
    });

    onRequest();

    if (popup) popup.then(onSuccess)?.catch(onFailure);
  };

  const { id, className, buttonText, children, render } = props;

  if (render)
    return render({ className, buttonText, children, onClick: onBtnClick });

  return (
    <button
      type="button"
      {...{
        id,
        className,
        onClick: onBtnClick,
      }}
    >
      {children || buttonText}
    </button>
  );
};

export default AuthenticationPopup;
