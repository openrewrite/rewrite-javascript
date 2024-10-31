import { isJavaScript } from '../tree';
import { JavaScriptSender } from './sender';
import { JavaScriptReceiver } from './receiver';

// TODO: address any assertions after types are fixed
export const registerCodecs = (
  senderContext: any,
  receiverContext: any,
  remotingContext: any
) => {
  console.log('registering javascript codecs');
  senderContext?.register(isJavaScript, () => new JavaScriptSender());
  receiverContext?.register(isJavaScript, () => new JavaScriptReceiver());
};
