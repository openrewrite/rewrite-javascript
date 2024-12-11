import {connect, disconnect, rewriteRun, rewriteRunWithOptions, typeScript} from '../testHarness';

describe('twentyhq/twenty files tests', () => {
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

    test('twenty/packages/twenty-server/src/modules/workflow/workflow-executor/workspace-services/workflow-executor.workspace-service.ts', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                import { Injectable } from '@nestjs/common';

                import {
                    WorkflowRunOutput,
                    WorkflowRunStatus,
                } from 'src/modules/workflow/common/standard-objects/workflow-run.workspace-entity';
                import { WorkflowActionFactory } from 'src/modules/workflow/workflow-executor/factories/workflow-action.factory';
                import { resolveInput } from 'src/modules/workflow/workflow-executor/utils/variable-resolver.util';
                import { WorkflowAction } from 'src/modules/workflow/workflow-executor/workflow-actions/types/workflow-action.type';

                const MAX_RETRIES_ON_FAILURE = 3;

                export type WorkflowExecutorOutput = {
                    steps: WorkflowRunOutput['steps'];
                    status: WorkflowRunStatus;
                };

                @Injectable()
                export class WorkflowExecutorWorkspaceService {
                    constructor(private readonly workflowActionFactory: WorkflowActionFactory) {}

                    async execute({
                                      currentStepIndex,
                                      steps,
                                      context,
                                      output,
                                      attemptCount = 1,
                                  }: {
                        currentStepIndex: number;
                        steps: WorkflowAction[];
                        output: WorkflowExecutorOutput;
                        context: Record<string, unknown>;
                        attemptCount?: number;
                    }): Promise<WorkflowExecutorOutput> {
                        if (currentStepIndex >= steps.length) {
                            return { ...output, status: WorkflowRunStatus.COMPLETED };
                        }

                        const step = steps[currentStepIndex];

                        const workflowAction = this.workflowActionFactory.get(step.type);

                        const actionPayload = resolveInput(step.settings.input, context);

                        const result = await workflowAction.execute(actionPayload);

                        const stepOutput = output.steps[step.id];

                        const error =
                            result.error?.errorMessage ??
                            (result.result ? undefined : 'Execution result error, no data or error');

                        const updatedStepOutput = {
                            id: step.id,
                            name: step.name,
                            type: step.type,
                            outputs: [
                                ...(stepOutput?.outputs ?? []),
                                {
                                    attemptCount,
                                    result: result.result,
                                    error,
                                },
                            ],
                        };

                        const updatedOutput = {
                            ...output,
                            steps: {
                                ...output.steps,
                                [step.id]: updatedStepOutput,
                            },
                        };

                        if (result.result) {
                            return await this.execute({
                                currentStepIndex: currentStepIndex + 1,
                                steps,
                                context: {
                                    ...context,
                                    [step.id]: result.result,
                                },
                                output: updatedOutput,
                            });
                        }

                        if (step.settings.errorHandlingOptions.continueOnFailure.value) {
                            return await this.execute({
                                currentStepIndex: currentStepIndex + 1,
                                steps,
                                context,
                                output: updatedOutput,
                            });
                        }

                        if (
                            step.settings.errorHandlingOptions.retryOnFailure.value &&
                            attemptCount < MAX_RETRIES_ON_FAILURE
                        ) {
                            return await this.execute({
                                currentStepIndex,
                                steps,
                                context,
                                output: updatedOutput,
                                attemptCount: attemptCount + 1,
                            });
                        }

                        return { ...updatedOutput, status: WorkflowRunStatus.FAILED };
                    }
                }
            `)
        );
    });

    test('twenty/packages/twenty-server/src/modules/workflow/workflow-executor/workspace-services/workflow-executor.workspace-service.ts', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                import {registerEnumType} from '@nestjs/graphql';

                import {
                    Relation
                } from 'src/engine/workspace-manager/workspace-sync-metadata/interfaces/relation.interface';

                import {FeatureFlagKey} from 'src/engine/core-modules/feature-flag/enums/feature-flag-key.enum';
                import {SEARCH_VECTOR_FIELD} from 'src/engine/metadata-modules/constants/search-vector-field.constants';
                import {
                    FullNameMetadata
                } from 'src/engine/metadata-modules/field-metadata/composite-types/full-name.composite-type';
                import {FieldMetadataType} from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
                import {IndexType} from 'src/engine/metadata-modules/index-metadata/index-metadata.entity';
                import {
                    RelationMetadataType,
                    RelationOnDeleteAction,
                } from 'src/engine/metadata-modules/relation-metadata/relation-metadata.entity';
                import {BaseWorkspaceEntity} from 'src/engine/twenty-orm/base.workspace-entity';
                import {WorkspaceEntity} from 'src/engine/twenty-orm/decorators/workspace-entity.decorator';
                import {WorkspaceFieldIndex} from 'src/engine/twenty-orm/decorators/workspace-field-index.decorator';
                import {WorkspaceField} from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
                import {WorkspaceGate} from 'src/engine/twenty-orm/decorators/workspace-gate.decorator';
                import {
                    WorkspaceIsNotAuditLogged
                } from 'src/engine/twenty-orm/decorators/workspace-is-not-audit-logged.decorator';
                import {WorkspaceIsNullable} from 'src/engine/twenty-orm/decorators/workspace-is-nullable.decorator';
                import {WorkspaceIsSystem} from 'src/engine/twenty-orm/decorators/workspace-is-system.decorator';
                import {WorkspaceRelation} from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
                import {
                    WORKSPACE_MEMBER_STANDARD_FIELD_IDS
                } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-field-ids';
                import {
                    STANDARD_OBJECT_ICONS
                } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-icons';
                import {
                    STANDARD_OBJECT_IDS
                } from 'src/engine/workspace-manager/workspace-sync-metadata/constants/standard-object-ids';
                import {
                    FieldTypeAndNameMetadata,
                    getTsVectorColumnExpressionFromFields,
                } from 'src/engine/workspace-manager/workspace-sync-metadata/utils/get-ts-vector-column-expression.util';
                import {
                    AttachmentWorkspaceEntity
                } from 'src/modules/attachment/standard-objects/attachment.workspace-entity';
                import {
                    BlocklistWorkspaceEntity
                } from 'src/modules/blocklist/standard-objects/blocklist.workspace-entity';
                import {
                    CalendarEventParticipantWorkspaceEntity
                } from 'src/modules/calendar/common/standard-objects/calendar-event-participant.workspace-entity';
                import {CompanyWorkspaceEntity} from 'src/modules/company/standard-objects/company.workspace-entity';
                import {
                    ConnectedAccountWorkspaceEntity
                } from 'src/modules/connected-account/standard-objects/connected-account.workspace-entity';
                import {FavoriteWorkspaceEntity} from 'src/modules/favorite/standard-objects/favorite.workspace-entity';
                import {
                    MessageParticipantWorkspaceEntity
                } from 'src/modules/messaging/common/standard-objects/message-participant.workspace-entity';
                import {
                    MessageThreadSubscriberWorkspaceEntity
                } from 'src/modules/messaging/common/standard-objects/message-thread-subscriber.workspace-entity';
                import {TaskWorkspaceEntity} from 'src/modules/task/standard-objects/task.workspace-entity';
                import {
                    AuditLogWorkspaceEntity
                } from 'src/modules/timeline/standard-objects/audit-log.workspace-entity';
                import {
                    TimelineActivityWorkspaceEntity
                } from 'src/modules/timeline/standard-objects/timeline-activity.workspace-entity';

                export enum WorkspaceMemberDateFormatEnum {
                    SYSTEM = 'SYSTEM',
                    MONTH_FIRST = 'MONTH_FIRST',
                    DAY_FIRST = 'DAY_FIRST',
                    YEAR_FIRST = 'YEAR_FIRST',
                }

                export enum WorkspaceMemberTimeFormatEnum {
                    SYSTEM = 'SYSTEM',
                    HOUR_12 = 'HOUR_12',
                    HOUR_24 = 'HOUR_24',
                }

                registerEnumType(WorkspaceMemberTimeFormatEnum, {
                    name: 'WorkspaceMemberTimeFormatEnum',
                    description: 'Time time as Military, Standard or system as default',
                });

                registerEnumType(WorkspaceMemberDateFormatEnum, {
                    name: 'WorkspaceMemberDateFormatEnum',
                    description:
                        'Date format as Month first, Day first, Year first or system as default',
                });

                const NAME_FIELD_NAME = 'name';
                const USER_EMAIL_FIELD_NAME = 'userEmail';

                export const SEARCH_FIELDS_FOR_WORKSPACE_MEMBER: FieldTypeAndNameMetadata[] = [
                    {name: NAME_FIELD_NAME, type: FieldMetadataType.FULL_NAME},
                    {name: USER_EMAIL_FIELD_NAME, type: FieldMetadataType.TEXT},
                ];

                @WorkspaceEntity({
                    standardId: STANDARD_OBJECT_IDS.workspaceMember,
                    namePlural: 'workspaceMembers',
                    labelSingular: 'Workspace Member',
                    labelPlural: 'Workspace Members',
                    description: 'A workspace member',
                    icon: STANDARD_OBJECT_ICONS.workspaceMember,
                    labelIdentifierStandardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.name,
                })
                @WorkspaceIsSystem()
                @WorkspaceIsNotAuditLogged()
                export class WorkspaceMemberWorkspaceEntity extends BaseWorkspaceEntity {
                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.name,
                        type: FieldMetadataType.FULL_NAME,
                        label: 'Name',
                        description: 'Workspace member name',
                        icon: 'IconCircleUser',
                    })
                    [NAME_FIELD_NAME]: FullNameMetadata;

                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.colorScheme,
                        type: FieldMetadataType.TEXT,
                        label: 'Color Scheme',
                        description: 'Preferred color scheme',
                        icon: 'IconColorSwatch',
                        defaultValue: "'Light'",
                    })
                    colorScheme: string;

                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.locale,
                        type: FieldMetadataType.TEXT,
                        label: 'Language',
                        description: 'Preferred language',
                        icon: 'IconLanguage',
                        defaultValue: "'en'",
                    })
                    locale: string;

                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.avatarUrl,
                        type: FieldMetadataType.TEXT,
                        label: 'Avatar Url',
                        description: 'Workspace member avatar',
                        icon: 'IconFileUpload',
                    })
                    avatarUrl: string;

                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.userEmail,
                        type: FieldMetadataType.TEXT,
                        label: 'User Email',
                        description: 'Related user email address',
                        icon: 'IconMail',
                    })
                    [USER_EMAIL_FIELD_NAME]: string;

                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.userId,
                        type: FieldMetadataType.UUID,
                        label: 'User Id',
                        description: 'Associated User Id',
                        icon: 'IconCircleUsers',
                    })
                    userId: string;

                    // Relations
                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.assignedTasks,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Assigned tasks',
                        description: 'Tasks assigned to the workspace member',
                        icon: 'IconCheckbox',
                        inverseSideTarget: () => TaskWorkspaceEntity,
                        inverseSideFieldKey: 'assignee',
                        onDelete: RelationOnDeleteAction.SET_NULL,
                    })
                    assignedTasks: Relation<TaskWorkspaceEntity[]>;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.favorites,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Favorites',
                        description: 'Favorites linked to the workspace member',
                        icon: 'IconHeart',
                        inverseSideTarget: () => FavoriteWorkspaceEntity,
                        onDelete: RelationOnDeleteAction.CASCADE,
                    })
                    favorites: Relation<FavoriteWorkspaceEntity[]>;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.messageThreadSubscribers,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Message thread subscribers',
                        description: 'Message thread subscribers for this workspace member',
                        icon: 'IconMessage',
                        inverseSideTarget: () => MessageThreadSubscriberWorkspaceEntity,
                        onDelete: RelationOnDeleteAction.CASCADE,
                    })
                    @WorkspaceGate({
                        featureFlag: FeatureFlagKey.IsMessageThreadSubscriberEnabled,
                    })
                    messageThreadSubscribers: Relation<MessageThreadSubscriberWorkspaceEntity[]>;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.accountOwnerForCompanies,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Account Owner For Companies',
                        description: 'Account owner for companies',
                        icon: 'IconBriefcase',
                        inverseSideTarget: () => CompanyWorkspaceEntity,
                        inverseSideFieldKey: 'accountOwner',
                        onDelete: RelationOnDeleteAction.SET_NULL,
                    })
                    accountOwnerForCompanies: Relation<CompanyWorkspaceEntity[]>;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.authoredAttachments,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Authored attachments',
                        description: 'Attachments created by the workspace member',
                        icon: 'IconFileImport',
                        inverseSideTarget: () => AttachmentWorkspaceEntity,
                        inverseSideFieldKey: 'author',
                        onDelete: RelationOnDeleteAction.SET_NULL,
                    })
                    authoredAttachments: Relation<AttachmentWorkspaceEntity[]>;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.connectedAccounts,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Connected accounts',
                        description: 'Connected accounts',
                        icon: 'IconAt',
                        inverseSideTarget: () => ConnectedAccountWorkspaceEntity,
                        inverseSideFieldKey: 'accountOwner',
                        onDelete: RelationOnDeleteAction.CASCADE,
                    })
                    connectedAccounts: Relation<ConnectedAccountWorkspaceEntity[]>;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.messageParticipants,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Message Participants',
                        description: 'Message Participants',
                        icon: 'IconUserCircle',
                        inverseSideTarget: () => MessageParticipantWorkspaceEntity,
                        inverseSideFieldKey: 'workspaceMember',
                        onDelete: RelationOnDeleteAction.SET_NULL,
                    })
                    messageParticipants: Relation<MessageParticipantWorkspaceEntity[]>;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.blocklist,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Blocklist',
                        description: 'Blocklisted handles',
                        icon: 'IconForbid2',
                        inverseSideTarget: () => BlocklistWorkspaceEntity,
                        inverseSideFieldKey: 'workspaceMember',
                        onDelete: RelationOnDeleteAction.SET_NULL,
                    })
                    blocklist: Relation<BlocklistWorkspaceEntity[]>;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.calendarEventParticipants,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Calendar Event Participants',
                        description: 'Calendar Event Participants',
                        icon: 'IconCalendar',
                        inverseSideTarget: () => CalendarEventParticipantWorkspaceEntity,
                        inverseSideFieldKey: 'workspaceMember',
                        onDelete: RelationOnDeleteAction.SET_NULL,
                    })
                    calendarEventParticipants: Relation<
                        CalendarEventParticipantWorkspaceEntity[]
                    >;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.timelineActivities,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Events',
                        description: 'Events linked to the workspace member',
                        icon: 'IconTimelineEvent',
                        inverseSideTarget: () => TimelineActivityWorkspaceEntity,
                        onDelete: RelationOnDeleteAction.CASCADE,
                    })
                    @WorkspaceIsNullable()
                    @WorkspaceIsSystem()
                    timelineActivities: Relation<TimelineActivityWorkspaceEntity[]>;

                    @WorkspaceRelation({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.auditLogs,
                        type: RelationMetadataType.ONE_TO_MANY,
                        label: 'Audit Logs',
                        description: 'Audit Logs linked to the workspace member',
                        icon: 'IconTimelineEvent',
                        inverseSideTarget: () => AuditLogWorkspaceEntity,
                        onDelete: RelationOnDeleteAction.SET_NULL,
                    })
                    @WorkspaceIsNullable()
                    @WorkspaceIsSystem()
                    auditLogs: Relation<AuditLogWorkspaceEntity[]>;

                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.timeZone,
                        type: FieldMetadataType.TEXT,
                        label: 'Time zone',
                        defaultValue: "'system'",
                        description: 'User time zone',
                        icon: 'IconTimezone',
                    })
                    timeZone: string;

                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.dateFormat,
                        type: FieldMetadataType.SELECT,
                        label: 'Date format',
                        description: "User's preferred date format",
                        icon: 'IconCalendarEvent',
                        options: [
                            {
                                value: WorkspaceMemberDateFormatEnum.SYSTEM,
                                label: 'System',
                                position: 0,
                                color: 'turquoise',
                            },
                            {
                                value: WorkspaceMemberDateFormatEnum.MONTH_FIRST,
                                label: 'Month First',
                                position: 1,
                                color: 'red',
                            },
                            {
                                value: WorkspaceMemberDateFormatEnum.DAY_FIRST,
                                label: 'Day First',
                                position: 2,
                                color: 'purple',
                            },
                            {
                                value: WorkspaceMemberDateFormatEnum.YEAR_FIRST,
                                label: 'Year First',
                                position: 3,
                                color: 'sky',
                            },
                        ],
                        defaultValue: \`'\${WorkspaceMemberDateFormatEnum.SYSTEM}'\`,
                    })
                    dateFormat: string;

                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.timeFormat,
                        type: FieldMetadataType.SELECT,
                        label: 'Time format',
                        description: "User's preferred time format",
                        icon: 'IconClock2',
                        options: [
                            {
                                value: WorkspaceMemberTimeFormatEnum.SYSTEM,
                                label: 'System',
                                position: 0,
                                color: 'sky',
                            },
                            {
                                value: WorkspaceMemberTimeFormatEnum.HOUR_24,
                                label: '24HRS',
                                position: 1,
                                color: 'red',
                            },
                            {
                                value: WorkspaceMemberTimeFormatEnum.HOUR_12,
                                label: '12HRS',
                                position: 2,
                                color: 'purple',
                            },
                        ],
                        defaultValue: \`'\${WorkspaceMemberTimeFormatEnum.SYSTEM}'\`,
                    })
                    timeFormat: string;

                    @WorkspaceField({
                        standardId: WORKSPACE_MEMBER_STANDARD_FIELD_IDS.searchVector,
                        type: FieldMetadataType.TS_VECTOR,
                        label: SEARCH_VECTOR_FIELD.label,
                        description: SEARCH_VECTOR_FIELD.description,
                        icon: 'IconUser',
                        generatedType: 'STORED',
                        asExpression: getTsVectorColumnExpressionFromFields(
                            SEARCH_FIELDS_FOR_WORKSPACE_MEMBER,
                        ),
                    })
                    @WorkspaceIsNullable()
                    @WorkspaceIsSystem()
                    @WorkspaceFieldIndex({indexType: IndexType.GIN})
                    [SEARCH_VECTOR_FIELD.name]: any;
                }

            `)
        );
    })

    test('packages/twenty-front/src/modules/object-record/record-table/hooks/useTableColumns.ts', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                import { useCallback } from 'react';

                import { FieldMetadata } from '@/object-record/record-field/types/FieldMetadata';
                import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
                import { useMoveViewColumns } from '@/views/hooks/useMoveViewColumns';

                import { availableTableColumnsComponentState } from '@/object-record/record-table/states/availableTableColumnsComponentState';
                import { visibleTableColumnsComponentSelector } from '@/object-record/record-table/states/selectors/visibleTableColumnsComponentSelector';
                import { tableColumnsComponentState } from '@/object-record/record-table/states/tableColumnsComponentState';
                import { useRecoilComponentValueV2 } from '@/ui/utilities/state/component-state/hooks/useRecoilComponentValueV2';
                import { ColumnDefinition } from '../types/ColumnDefinition';

                type useRecordTableProps = {
                    recordTableId?: string;
                };

                export const useTableColumns = (props?: useRecordTableProps) => {
                    const { onColumnsChange, setTableColumns } = useRecordTable({
                        recordTableId: props?.recordTableId,
                    });

                    const availableTableColumns = useRecoilComponentValueV2(
                        availableTableColumnsComponentState,
                        props?.recordTableId,
                    );

                    const tableColumns = useRecoilComponentValueV2(
                        tableColumnsComponentState,
                        props?.recordTableId,
                    );
                    const visibleTableColumns = useRecoilComponentValueV2(
                        visibleTableColumnsComponentSelector,
                        props?.recordTableId,
                    );

                    const { handleColumnMove } = useMoveViewColumns();

                    const handleColumnsChange = useCallback(
                        async (columns: ColumnDefinition<FieldMetadata>[]) => {
                            setTableColumns(columns);

                            await onColumnsChange?.(columns);
                        },
                        [onColumnsChange, setTableColumns],
                    );

                    const handleColumnVisibilityChange = useCallback(
                        async (
                            viewField: Omit<ColumnDefinition<FieldMetadata>, 'size' | 'position'>,
                        ) => {
                            const shouldShowColumn = !visibleTableColumns.some(
                                (visibleColumn) =>
                                    visibleColumn.fieldMetadataId === viewField.fieldMetadataId,
                            );

                            const tableColumnPositions = [...tableColumns]
                                .sort((a, b) => b.position - a.position)
                                .map((column) => column.position);

                            const lastPosition = tableColumnPositions[0] ?? 0;

                            if (shouldShowColumn) {
                                const newColumn = availableTableColumns.find(
                                    (availableTableColumn) =>
                                        availableTableColumn.fieldMetadataId === viewField.fieldMetadataId,
                                );

                                if (!newColumn) return;

                                const nextColumns = [
                                    ...tableColumns,
                                    { ...newColumn, isVisible: true, position: lastPosition + 1 },
                                ];

                                await handleColumnsChange(nextColumns);
                            } else {
                                const nextColumns = visibleTableColumns.map((previousColumn) =>
                                    previousColumn.fieldMetadataId === viewField.fieldMetadataId
                                        ? { ...previousColumn, isVisible: !viewField.isVisible }
                                        : previousColumn,
                                );

                                await handleColumnsChange(nextColumns);
                            }
                        },
                        [
                            tableColumns,
                            availableTableColumns,
                            handleColumnsChange,
                            visibleTableColumns,
                        ],
                    );

                    const handleMoveTableColumn = useCallback(
                        async (
                            direction: 'left' | 'right',
                            column: ColumnDefinition<FieldMetadata>,
                        ) => {
                            const currentColumnArrayIndex = visibleTableColumns.findIndex(
                                (visibleColumn) =>
                                    visibleColumn.fieldMetadataId === column.fieldMetadataId,
                            );

                            const columns = handleColumnMove(
                                direction,
                                currentColumnArrayIndex,
                                visibleTableColumns,
                            );

                            await handleColumnsChange(columns);
                        },
                        [visibleTableColumns, handleColumnMove, handleColumnsChange],
                    );

                    const handleColumnReorder = useCallback(
                        async (columns: ColumnDefinition<FieldMetadata>[]) => {
                            const updatedColumns = columns.map((column, index) => ({
                                ...column,
                                position: index,
                            }));

                            await handleColumnsChange(updatedColumns);
                        },
                        [handleColumnsChange],
                    );

                    return {
                        handleColumnVisibilityChange,
                        handleMoveTableColumn,
                        handleColumnReorder,
                        handleColumnsChange,
                    };
                };
            `)
        );
    });

    test('packages/twenty-chrome-extension/src/background/index.ts', () => {
        rewriteRun(
            //language=typescript
            typeScript(`
                import {isDefined} from '~/utils/isDefined';

                // Open options page programmatically in a new tab.
                // chrome.runtime.onInstalled.addListener((details) => {
                //   if (details.reason === 'install') {
                //     openOptionsPage();
                //   }
                // });

                chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true});

                // This listens for an event from other parts of the extension, such as the content script, and performs the required tasks.
                // The cases themselves are labelled such that their operations are reflected by their names.
                chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
                    switch (message.action) {
                        case 'getActiveTab': {
                            // e.g. "https://linkedin.com/company/twenty/"
                            chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
                                if (isDefined(tab) && isDefined(tab.id)) {
                                    sendResponse({tab});
                                }
                            });
                            break;
                        }
                        case 'openSidepanel': {
                            chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
                                if (isDefined(tab) && isDefined(tab.id)) {
                                    chrome.sidePanel.open({tabId: tab.id});
                                }
                            });
                            break;
                        }
                        default:
                            break;
                    }

                    return true;
                });

                chrome.tabs.onUpdated.addListener(async (tabId, _, tab) => {
                    const isDesiredRoute =
                        tab.url?.match(/^https?:\\/\\/(?:www\\.)?linkedin\\.com\\/company(?:\\/\\S+)?/) ||
                        tab.url?.match(/^https?:\\/\\/(?:www\\.)?linkedin\\.com\\/in(?:\\/\\S+)?/);

                    if (tab.active === true) {
                        if (isDefined(isDesiredRoute)) {
                            chrome.tabs.sendMessage(tabId, {action: 'executeContentScript'});
                        }
                    }

                    await chrome.sidePanel.setOptions({
                        tabId,
                        path: tab.url?.match(/^https?:\\/\\/(?:www\\.)?linkedin\\.com/
                )
                        ? 'sidepanel.html'
                        : 'page-inaccessible.html',
                        enabled
                :
                    true,
                })
                    ;
                });

                const setTokenStateFromCookie = (cookie: string) => {
                    const decodedValue = decodeURIComponent(cookie);
                    const tokenPair = JSON.parse(decodedValue);
                    if (isDefined(tokenPair)) {
                        chrome.storage.local.set({
                            isAuthenticated: true,
                            accessToken: tokenPair.accessToken,
                            refreshToken: tokenPair.refreshToken,
                        });
                    }
                };

                chrome.cookies.onChanged.addListener(async ({cookie}) => {
                    if (cookie.name === 'tokenPair') {
                        const store = await chrome.storage.local.get(['clientUrl']);
                        const clientUrl = isDefined(store.clientUrl)
                            ? store.clientUrl
                            : import.meta.env.VITE_FRONT_BASE_URL;
                        chrome.cookies.get({name: 'tokenPair', url: \`\${clientUrl}\`}, (cookie) => {
                            if (isDefined(cookie)) {
                                setTokenStateFromCookie(cookie.value);
                            }
                        });
                    }
                });

                // This will only run the very first time the extension loads, after we have stored the
                // cookiesRead variable to true, this will not allow to change the token state everytime background script runs
                chrome.cookies.get(
                    {name: 'tokenPair', url: \`\${import.meta.env.VITE_FRONT_BASE_URL}\`},
                    async (cookie) => {
                        const store = await chrome.storage.local.get(['cookiesRead']);
                        if (isDefined(cookie) && !isDefined(store.cookiesRead)) {
                            setTokenStateFromCookie(cookie.value);
                            chrome.storage.local.set({cookiesRead: true});
                        }
                    },
                );
            `)
        );
    });

});
