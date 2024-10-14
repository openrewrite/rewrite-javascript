import {isJavaScript} from "../tree";
import {ReceiverContext} from "@openrewrite/rewrite-remote";
import {SenderContext} from "@openrewrite/rewrite-remote";
import {JavaScriptSender} from "./sender";
import {JavaScriptReceiver} from "./receiver";

SenderContext.register(isJavaScript, () => new JavaScriptSender());
ReceiverContext.register(isJavaScript, () => new JavaScriptReceiver());
