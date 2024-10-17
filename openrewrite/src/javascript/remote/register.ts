import {isJavaScript} from "../tree";
import {ReceiverContext} from "@openrewrite/rewrite-remote";
import {SenderContext} from "@openrewrite/rewrite-remote";
import {JavaScriptSender} from "./sender";
import {JavaScriptReceiver} from "./receiver";
console.log("registering javascript codecs");
SenderContext.register(isJavaScript, () => new JavaScriptSender());
ReceiverContext.register(isJavaScript, () => new JavaScriptReceiver());
