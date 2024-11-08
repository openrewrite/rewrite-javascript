import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('expression statement mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('literal with semicolon', () => {
        rewriteRunWithOptions(
            {normalizeIndent: false},
            typeScript('1 ;')
        );
    });
    test('multiple', () => {
        rewriteRunWithOptions(
            {normalizeIndent: false},
            typeScript(
                //language=ts
                `
                    1; // foo
                    // bar
                    /*baz*/
                    2;`
            )
        );
    });

    test('simple non-null expression', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                const length = user ! . profile ! . username ! . length ;
            `)
        );
    });

    test('simple question-dot expression', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                const length = user ?. profile ?. username ?. length ;
            `)
        );
    });

    test('simple default expression', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                const length = user ?? 'default' ;
            `)
        );
    });

    test('mixed expression with special tokens', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                class Profile {
                    username?: string; // Optional property
                }

                class User {
                    profile?: Profile; // Optional property
                }

                function getUser(id: number) : User | null {
                    if (id === 1) {
                        return new User();
                    }
                    return null;
                }

                const user = getUser(1);
                const length = user  ! . profile ?.  username  !. length /*test*/ ;
                const username2 = getUser(1) ! . profile ?. username ; // test;
                const username = user!.profile?.username ?? 'Guest' ;
            `)
        );
    });
});
