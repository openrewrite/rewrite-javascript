import { isYaml } from '../tree';
import { YamlSender } from './sender';
import { YamlReceiver } from './receiver';

// TODO: address any assertions after types are fixed
export const registerCodecs = (
  senderContext: any,
  receiverContext: any,
  remotingContext: any
) => {
  console.log('registering yaml codecs');
  senderContext?.register(isYaml, () => new YamlSender());
  receiverContext?.register(isYaml, () => new YamlReceiver());
};
