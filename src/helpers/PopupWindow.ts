import {
  MessagePayload,
  MessagePayloadData,
  PopupWindowConstructor,
  PopupWindowOptions,
  ResponseData,
  ResponseLocationType,
} from '../interfaces';
import { generateRequestMessage, toParams, toQuery } from '../utils';
import { MessagingType } from '../types';

const requestMessage: MessagePayloadData<void> = generateRequestMessage();

class PopupWindow {
  private id?: string;
  private readonly url: string;
  private popupOptions: PopupWindowOptions;

  private readonly locationKey?: ResponseLocationType;
  private readonly isCrossOrigin: boolean;
  private response?: ResponseData;

  private window: Window | null = null;
  private promise: Promise<ResponseData> | null = null;
  private intervalId: number | null = null;

  constructor({
    id,
    url,
    popupOptions = {},
    otherOptions = {},
  }: PopupWindowConstructor) {
    this.id = id;
    this.url = url;
    this.popupOptions = popupOptions;
    this.locationKey = otherOptions.locationKey;
    this.isCrossOrigin = otherOptions.isCrossOrigin ?? false;

    this.handlePostMessage = this.handlePostMessage.bind(this);
    this.handlePolling = this.handlePolling.bind(this);
  }

  private handlePostMessage(event: MessagePayload<ResponseData>): void {
    if (event.data.message === MessagingType.RESULT_MESSAGE)
      this.response = event.data.result;
  }

  private handlePolling(resolve: (value: ResponseData | PromiseLike<ResponseData>) => void, reject: (reason?: any) => void): void {
    try {
      const popup: Window | null = this.window;

      if (!popup || popup.closed) {
        this.close();
        return reject(
          new Error('The popup was closed for an unexpected reason')
        );
      }

      // Cross-origin auth flows need to be handled differently
      if (this.isCrossOrigin) {
        if (this.response) {
          resolve(this.response);
          return this.close();
        } else {
          return popup.postMessage(requestMessage, '*');
        }
      } else {
        if (
          popup.location.href === this.url ||
          popup.location.pathname === 'blank'
        ) {
          // Location unchanged, still polling
          return;
        }

        if (
          !this.locationKey ||
          this.locationKey! in ResponseLocationType
        ) {
          reject(
            new Error(
              `Cannot get data from location.${this.locationKey}, check the responseType prop`
            )
          );
          return this.close();
        }

        const locationValue: string = popup.location[this.locationKey];
        resolve(toParams(locationValue));
        return this.close();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Log the error to the console but remain silent
        if (
          error.name === 'SecurityError' &&
          error.message.includes('Blocked a frame with origin')
        ) {
          console.warn(
            'Encountered a cross-origin error, is your authorization URL on a different server? Use the "isCrossOrigin" property, see documentation for details.'
          );
        } else {
          console.error(error);
        }
      }
    }
  }

  private open() {
    const { url, id, popupOptions, isCrossOrigin } = this;

    if (isCrossOrigin)
      window.addEventListener('message', this.handlePostMessage);

    this.window = window.open(url, id, toQuery(popupOptions, ','));
  }

  private close() {
    this.cancel();
    this.window?.close();
    window.removeEventListener('message', this.handlePostMessage);
  }

  private poll(): void {
    this.promise = new Promise<ResponseData>((resolve, reject) => {
      this.intervalId = window.setInterval(this.handlePolling, 500, resolve, reject);
    });
  }

  public cancel(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public then(...args: any[]): Promise<ResponseData> | undefined {
    return this.promise?.then(...args);
  }

  public catch(...args: any[]): Promise<ResponseData> | undefined {
    return this.promise?.catch(...args);
  }

  public static open(args: PopupWindowConstructor): PopupWindow {
    const popup: PopupWindow = new this(args);

    popup.open();
    popup.poll();

    return popup;
  }
}

export default PopupWindow;
