import {connect, disconnect, rewriteRun, typeScript} from '../testHarness';

describe('class decorator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('unqualified', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo class A {}')
        );
    });
    test('unqualified parens', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo( ) class A {}')
        );
    });
    test('qualified', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo . bar class A {}')
        );
    });
    test('qualified parens', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo . bar ( ) class A {}')
        );
    });
    test('class / method / params / properties decorators', () => {
        rewriteRun(
          //language=typescript
          typeScript(`
              @UseGuards(WorkspaceAuthGuard)
              @Resolver()
              export class RelationMetadataResolver {
                  constructor(
                      @Args('input')
                      private readonly relationMetadataService: RelationMetadataService,
                  ) {}

                  @Args('input') input: DeleteOneRelationInput;

                  @Mutation(() => RelationMetadataDTO)
                  async deleteOneRelation(
                      @Args('input') input: DeleteOneRelationInput,
                      @AuthWorkspace() { id: workspaceId }: Workspace,
                  ) {
                      try {
                          return await this.relationMetadataService.deleteOneRelation(
                              input.id,
                              workspaceId,
                          );
                      } catch (error) {
                          relationMetadataGraphqlApiExceptionHandler(error);
                      }
                  }
              }
          `)
        );
    });
});

// according to TypeScript documentation decorators are not allowed with
// standalone functions https://www.typescriptlang.org/docs/handbook/decorators.html
describe.skip('function decorator mapping', () => {
    beforeAll(() => connect());
    afterAll(() => disconnect());

    test('unqualified', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo function f() {}')
        );
    });
    test('unqualified parens', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo( ) function f() {}')
        );
    });
    test('qualified', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo . bar function f() {}')
        );
    });
    test('qualified parens', () => {
        rewriteRun(
          //language=typescript
          typeScript('@foo . bar ( ) function f() {}')
        );
    });
});
