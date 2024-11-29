import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('highlight.js files tests', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('twenty/packages/twenty-server/src/modules/messaging/message-import-manager/exceptions/message-import.exception.ts', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                import { CustomException } from 'src/utils/custom-exception';

                export class MessageImportException extends CustomException {
                    code: MessageImportExceptionCode;
                    constructor(message: string, code: MessageImportExceptionCode) {
                        super(message, code);
                    }
                }

                export enum MessageImportExceptionCode {
                    UNKNOWN = 'UNKNOWN',
                    PROVIDER_NOT_SUPPORTED = 'PROVIDER_NOT_SUPPORTED',
                    MESSAGE_CHANNEL_NOT_FOUND = 'MESSAGE_CHANNEL_NOT_FOUND',
                }
            `)
        );
    });

});
