import { isJava, JavaType } from '../tree';
import { CborDecoder, CborEncoder } from '@jsonjoy.com/json-pack/lib/cbor';
import { ValueType } from '@openrewrite/rewrite-remote';
import { SerializationContext } from '@openrewrite/rewrite-remote';
import { JavaSender } from './sender';
import { JavaReceiver } from './receiver';

import type { DeserializationContext } from '@openrewrite/rewrite-remote';

// TODO: address any assertions after types are fixed
export const registerCodecs = (
  senderContext: any,
  receiverContext: any,
  remotingContext: any
) => {
  console.log('registering java codecs');

  senderContext?.register(isJava, () => new JavaSender());
  receiverContext?.register(isJava, () => new JavaReceiver());

  remotingContext?.registerValueDeserializer(
    JavaType.Class,
    function (
      type: any,
      decoder: CborDecoder,
      context: DeserializationContext
    ): JavaType.Class {
      let cls: {
        [key: string]: any;
      } =
        type == JavaType.ShallowClass
          ? new JavaType.ShallowClass()
          : new JavaType.Class();
      while (decoder.reader.peak() !== 255) {
        const key = decoder.key();
        if (key === '@ref') {
          context.remotingContext.addById(decoder.val() as number, cls);
        } else {
          cls['_' + key] = decoder.val();
        }
      }
      decoder.reader.x++;
      return cls as JavaType.Class;
    }
  );

  remotingContext?.registerValueDeserializer(
    JavaType.Primitive,
    function (
      type: any,
      decoder: CborDecoder,
      context: DeserializationContext
    ): JavaType.Primitive {
      const key = decoder.key();
      let kind: JavaType.PrimitiveKind;
      if (key === '_kind') {
        kind = decoder.val() as JavaType.PrimitiveKind;
      } else {
        throw new Error('Unexpected key: ' + key);
      }
      decoder.reader.x++;
      return JavaType.Primitive.of(kind);
    }
  );

  remotingContext?.registerValueSerializer(
    JavaType.Primitive,
    function (
      value: JavaType.Primitive,
      type: ValueType,
      typeName: string | null,
      encoder: CborEncoder,
      context: SerializationContext
    ): void {
      encoder.writeArrHdr(2);
      encoder.writeStr('org.openrewrite.java.tree.JavaType$Primitive');
      encoder.writeUInteger(value.kind);
    }
  );

  remotingContext?.registerValueSerializer(
    JavaType.Class,
    function (
      value: JavaType.Class,
      type: ValueType,
      typeName: string | null,
      encoder: CborEncoder,
      context: SerializationContext
    ): void {
      const id = context.remotingContext.tryGetId(value);
      if (id !== undefined) {
        encoder.writeUInteger(id);
        return;
      }
      encoder.writeStartObj();
      encoder.writeStr('@c');
      encoder.writeStr(
        value instanceof JavaType.ShallowClass
          ? 'org.openrewrite.java.tree.JavaType$ShallowClass'
          : 'org.openrewrite.java.tree.JavaType$Class'
      );
      encoder.writeStr('@ref');
      encoder.writeUInteger(context.remotingContext.add(value));
      encoder.writeStr('flagsBitMap');
      encoder.writeNumber(value.flagsBitMap);
      encoder.writeStr('fullyQualifiedName');
      encoder.writeStr(value.fullyQualifiedName);
      encoder.writeStr('kind');
      encoder.writeUInteger(value.kind);
      if (value.typeParameters) {
        encoder.writeStr('typeParameters');
        encoder.writeArrHdr(value.typeParameters.length);
        value.typeParameters.forEach((t) =>
          context.serialize(t, ValueType.Object, null, encoder)
        );
      }
      if (value.supertype) {
        encoder.writeStr('supertype');
        context.serialize(value.supertype, ValueType.Object, null, encoder);
      }
      if (value.owningClass) {
        encoder.writeStr('owningClass');
        context.serialize(value.owningClass, ValueType.Object, null, encoder);
      }
      if (value.annotations) {
        encoder.writeStr('annotations');
        encoder.writeArrHdr(value.annotations.length);
        value.annotations.forEach((t) =>
          context.serialize(t, ValueType.Object, null, encoder)
        );
      }
      if (value.interfaces) {
        encoder.writeStr('interfaces');
        encoder.writeArrHdr(value.interfaces.length);
        value.interfaces.forEach((t) =>
          context.serialize(t, ValueType.Object, null, encoder)
        );
      }
      if (value.members) {
        encoder.writeStr('members');
        encoder.writeArrHdr(value.members.length);
        value.members.forEach((t) =>
          context.serialize(t, ValueType.Object, null, encoder)
        );
      }
      if (value.methods) {
        encoder.writeStr('methods');
        encoder.writeArrHdr(value.methods.length);
        value.methods.forEach((t) =>
          context.serialize(t, ValueType.Object, null, encoder)
        );
      }
      encoder.writeEndObj();
    }
  );

  remotingContext?.registerValueSerializer(
    JavaType.Union,
    function (
      value: JavaType.Union,
      type: ValueType,
      typeName: string | null,
      encoder: CborEncoder,
      context: SerializationContext
    ): void {
      const id = context.remotingContext.tryGetId(value);
      if (id !== undefined) {
        encoder.writeUInteger(id);
        return;
      }
      encoder.writeMapHdr(3);
      encoder.writeStr('@c');
      encoder.writeStr('org.openrewrite.java.tree.JavaType$MultiCatch');
      encoder.writeStr('@ref');
      encoder.writeUInteger(context.remotingContext.add(value));
      encoder.writeStr('throwableTypes');
      encoder.writeArrHdr(value.types.length);
      value.types.forEach((t) =>
        context.serialize(t, ValueType.Object, null, encoder)
      );
    }
  );

  remotingContext?.registerValueSerializer(
    JavaType.Unknown,
    function (
      value: JavaType.Unknown,
      type: ValueType,
      typeName: string | null,
      encoder: CborEncoder,
      context: SerializationContext
    ): void {
      const id = context.remotingContext.tryGetId(value);
      if (id !== undefined) {
        encoder.writeUInteger(id);
        return;
      }
      encoder.writeMapHdr(2);
      encoder.writeStr('@c');
      encoder.writeStr('org.openrewrite.java.tree.JavaType$Unknown');
      encoder.writeStr('@ref');
      encoder.writeUInteger(context.remotingContext.add(value));
    }
  );
};
