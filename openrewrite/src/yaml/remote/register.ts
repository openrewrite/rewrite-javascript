import {isYaml} from "../tree";
import {ReceiverContext} from "@openrewrite/rewrite-remote";
import {SenderContext} from "@openrewrite/rewrite-remote";
import {YamlSender} from "./sender";
import {YamlReceiver} from "./receiver";

console.log("registering yaml codecs");
SenderContext.register(isYaml, () => new YamlSender());
ReceiverContext.register(isYaml, () => new YamlReceiver());
