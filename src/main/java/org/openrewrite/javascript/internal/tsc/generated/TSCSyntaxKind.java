/*
 * Copyright 2023 the original author or authors.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.openrewrite.javascript.internal.tsc.generated;

//
// THIS FILE IS GENERATED. Do not modify it by hand.
// See `js/README.md` for instructions to regenerate this file.
//

public enum TSCSyntaxKind {
    /** Also includes FirstToken */
    Unknown(0),
    EndOfFileToken(1),
    /** Also includes FirstTriviaToken */
    SingleLineCommentTrivia(2),
    MultiLineCommentTrivia(3),
    NewLineTrivia(4),
    WhitespaceTrivia(5),
    ShebangTrivia(6),
    /** Also includes LastTriviaToken */
    ConflictMarkerTrivia(7),
    NonTextFileMarkerTrivia(8),
    /** Also includes FirstLiteralToken */
    NumericLiteral(9),
    BigIntLiteral(10),
    StringLiteral(11),
    JsxText(12),
    JsxTextAllWhiteSpaces(13),
    RegularExpressionLiteral(14),
    /** Also includes LastLiteralToken, FirstTemplateToken */
    NoSubstitutionTemplateLiteral(15),
    TemplateHead(16),
    TemplateMiddle(17),
    /** Also includes LastTemplateToken */
    TemplateTail(18),
    /** Also includes FirstPunctuation */
    OpenBraceToken(19),
    CloseBraceToken(20),
    OpenParenToken(21),
    CloseParenToken(22),
    OpenBracketToken(23),
    CloseBracketToken(24),
    DotToken(25),
    DotDotDotToken(26),
    SemicolonToken(27),
    CommaToken(28),
    QuestionDotToken(29),
    /** Also includes FirstBinaryOperator */
    LessThanToken(30),
    LessThanSlashToken(31),
    GreaterThanToken(32),
    LessThanEqualsToken(33),
    GreaterThanEqualsToken(34),
    EqualsEqualsToken(35),
    ExclamationEqualsToken(36),
    EqualsEqualsEqualsToken(37),
    ExclamationEqualsEqualsToken(38),
    EqualsGreaterThanToken(39),
    PlusToken(40),
    MinusToken(41),
    AsteriskToken(42),
    AsteriskAsteriskToken(43),
    SlashToken(44),
    PercentToken(45),
    PlusPlusToken(46),
    MinusMinusToken(47),
    LessThanLessThanToken(48),
    GreaterThanGreaterThanToken(49),
    GreaterThanGreaterThanGreaterThanToken(50),
    AmpersandToken(51),
    BarToken(52),
    CaretToken(53),
    ExclamationToken(54),
    TildeToken(55),
    AmpersandAmpersandToken(56),
    BarBarToken(57),
    QuestionToken(58),
    ColonToken(59),
    AtToken(60),
    QuestionQuestionToken(61),
    BacktickToken(62),
    HashToken(63),
    /** Also includes FirstAssignment */
    EqualsToken(64),
    /** Also includes FirstCompoundAssignment */
    PlusEqualsToken(65),
    MinusEqualsToken(66),
    AsteriskEqualsToken(67),
    AsteriskAsteriskEqualsToken(68),
    SlashEqualsToken(69),
    PercentEqualsToken(70),
    LessThanLessThanEqualsToken(71),
    GreaterThanGreaterThanEqualsToken(72),
    GreaterThanGreaterThanGreaterThanEqualsToken(73),
    AmpersandEqualsToken(74),
    BarEqualsToken(75),
    BarBarEqualsToken(76),
    AmpersandAmpersandEqualsToken(77),
    QuestionQuestionEqualsToken(78),
    /** Also includes LastAssignment, LastCompoundAssignment, LastPunctuation, LastBinaryOperator */
    CaretEqualsToken(79),
    Identifier(80),
    PrivateIdentifier(81),
    JSDocCommentTextToken(82),
    /** Also includes FirstReservedWord, FirstKeyword */
    BreakKeyword(83),
    CaseKeyword(84),
    CatchKeyword(85),
    ClassKeyword(86),
    ConstKeyword(87),
    ContinueKeyword(88),
    DebuggerKeyword(89),
    DefaultKeyword(90),
    DeleteKeyword(91),
    DoKeyword(92),
    ElseKeyword(93),
    EnumKeyword(94),
    ExportKeyword(95),
    ExtendsKeyword(96),
    FalseKeyword(97),
    FinallyKeyword(98),
    ForKeyword(99),
    FunctionKeyword(100),
    IfKeyword(101),
    ImportKeyword(102),
    InKeyword(103),
    InstanceOfKeyword(104),
    NewKeyword(105),
    NullKeyword(106),
    ReturnKeyword(107),
    SuperKeyword(108),
    SwitchKeyword(109),
    ThisKeyword(110),
    ThrowKeyword(111),
    TrueKeyword(112),
    TryKeyword(113),
    TypeOfKeyword(114),
    VarKeyword(115),
    VoidKeyword(116),
    WhileKeyword(117),
    /** Also includes LastReservedWord */
    WithKeyword(118),
    /** Also includes FirstFutureReservedWord */
    ImplementsKeyword(119),
    InterfaceKeyword(120),
    LetKeyword(121),
    PackageKeyword(122),
    PrivateKeyword(123),
    ProtectedKeyword(124),
    PublicKeyword(125),
    StaticKeyword(126),
    /** Also includes LastFutureReservedWord */
    YieldKeyword(127),
    /** Also includes FirstContextualKeyword */
    AbstractKeyword(128),
    AccessorKeyword(129),
    AsKeyword(130),
    AssertsKeyword(131),
    AssertKeyword(132),
    AnyKeyword(133),
    AsyncKeyword(134),
    AwaitKeyword(135),
    BooleanKeyword(136),
    ConstructorKeyword(137),
    DeclareKeyword(138),
    GetKeyword(139),
    InferKeyword(140),
    IntrinsicKeyword(141),
    IsKeyword(142),
    KeyOfKeyword(143),
    ModuleKeyword(144),
    NamespaceKeyword(145),
    NeverKeyword(146),
    OutKeyword(147),
    ReadonlyKeyword(148),
    RequireKeyword(149),
    NumberKeyword(150),
    ObjectKeyword(151),
    SatisfiesKeyword(152),
    SetKeyword(153),
    StringKeyword(154),
    SymbolKeyword(155),
    TypeKeyword(156),
    UndefinedKeyword(157),
    UniqueKeyword(158),
    UnknownKeyword(159),
    UsingKeyword(160),
    FromKeyword(161),
    GlobalKeyword(162),
    BigIntKeyword(163),
    OverrideKeyword(164),
    /** Also includes LastKeyword, LastToken, LastContextualKeyword */
    OfKeyword(165),
    /** Also includes FirstNode */
    QualifiedName(166),
    ComputedPropertyName(167),
    TypeParameter(168),
    Parameter(169),
    Decorator(170),
    PropertySignature(171),
    PropertyDeclaration(172),
    MethodSignature(173),
    MethodDeclaration(174),
    ClassStaticBlockDeclaration(175),
    Constructor(176),
    GetAccessor(177),
    SetAccessor(178),
    CallSignature(179),
    ConstructSignature(180),
    IndexSignature(181),
    /** Also includes FirstTypeNode */
    TypePredicate(182),
    TypeReference(183),
    FunctionType(184),
    ConstructorType(185),
    TypeQuery(186),
    TypeLiteral(187),
    ArrayType(188),
    TupleType(189),
    OptionalType(190),
    RestType(191),
    UnionType(192),
    IntersectionType(193),
    ConditionalType(194),
    InferType(195),
    ParenthesizedType(196),
    ThisType(197),
    TypeOperator(198),
    IndexedAccessType(199),
    MappedType(200),
    LiteralType(201),
    NamedTupleMember(202),
    TemplateLiteralType(203),
    TemplateLiteralTypeSpan(204),
    /** Also includes LastTypeNode */
    ImportType(205),
    ObjectBindingPattern(206),
    ArrayBindingPattern(207),
    BindingElement(208),
    ArrayLiteralExpression(209),
    ObjectLiteralExpression(210),
    PropertyAccessExpression(211),
    ElementAccessExpression(212),
    CallExpression(213),
    NewExpression(214),
    TaggedTemplateExpression(215),
    TypeAssertionExpression(216),
    ParenthesizedExpression(217),
    FunctionExpression(218),
    ArrowFunction(219),
    DeleteExpression(220),
    TypeOfExpression(221),
    VoidExpression(222),
    AwaitExpression(223),
    PrefixUnaryExpression(224),
    PostfixUnaryExpression(225),
    BinaryExpression(226),
    ConditionalExpression(227),
    TemplateExpression(228),
    YieldExpression(229),
    SpreadElement(230),
    ClassExpression(231),
    OmittedExpression(232),
    ExpressionWithTypeArguments(233),
    AsExpression(234),
    NonNullExpression(235),
    MetaProperty(236),
    SyntheticExpression(237),
    SatisfiesExpression(238),
    TemplateSpan(239),
    SemicolonClassElement(240),
    Block(241),
    EmptyStatement(242),
    /** Also includes FirstStatement */
    VariableStatement(243),
    ExpressionStatement(244),
    IfStatement(245),
    DoStatement(246),
    WhileStatement(247),
    ForStatement(248),
    ForInStatement(249),
    ForOfStatement(250),
    ContinueStatement(251),
    BreakStatement(252),
    ReturnStatement(253),
    WithStatement(254),
    SwitchStatement(255),
    LabeledStatement(256),
    ThrowStatement(257),
    TryStatement(258),
    /** Also includes LastStatement */
    DebuggerStatement(259),
    VariableDeclaration(260),
    VariableDeclarationList(261),
    FunctionDeclaration(262),
    ClassDeclaration(263),
    InterfaceDeclaration(264),
    TypeAliasDeclaration(265),
    EnumDeclaration(266),
    ModuleDeclaration(267),
    ModuleBlock(268),
    CaseBlock(269),
    NamespaceExportDeclaration(270),
    ImportEqualsDeclaration(271),
    ImportDeclaration(272),
    ImportClause(273),
    NamespaceImport(274),
    NamedImports(275),
    ImportSpecifier(276),
    ExportAssignment(277),
    ExportDeclaration(278),
    NamedExports(279),
    NamespaceExport(280),
    ExportSpecifier(281),
    MissingDeclaration(282),
    ExternalModuleReference(283),
    JsxElement(284),
    JsxSelfClosingElement(285),
    JsxOpeningElement(286),
    JsxClosingElement(287),
    JsxFragment(288),
    JsxOpeningFragment(289),
    JsxClosingFragment(290),
    JsxAttribute(291),
    JsxAttributes(292),
    JsxSpreadAttribute(293),
    JsxExpression(294),
    JsxNamespacedName(295),
    CaseClause(296),
    DefaultClause(297),
    HeritageClause(298),
    CatchClause(299),
    AssertClause(300),
    AssertEntry(301),
    ImportTypeAssertionContainer(302),
    PropertyAssignment(303),
    ShorthandPropertyAssignment(304),
    SpreadAssignment(305),
    EnumMember(306),
    UnparsedPrologue(307),
    UnparsedPrepend(308),
    UnparsedText(309),
    UnparsedInternalText(310),
    UnparsedSyntheticReference(311),
    SourceFile(312),
    Bundle(313),
    UnparsedSource(314),
    InputFiles(315),
    /** Also includes FirstJSDocNode */
    JSDocTypeExpression(316),
    JSDocNameReference(317),
    JSDocMemberName(318),
    JSDocAllType(319),
    JSDocUnknownType(320),
    JSDocNullableType(321),
    JSDocNonNullableType(322),
    JSDocOptionalType(323),
    JSDocFunctionType(324),
    JSDocVariadicType(325),
    JSDocNamepathType(326),
    /** Also includes JSDocComment */
    JSDoc(327),
    JSDocText(328),
    JSDocTypeLiteral(329),
    JSDocSignature(330),
    JSDocLink(331),
    JSDocLinkCode(332),
    JSDocLinkPlain(333),
    /** Also includes FirstJSDocTagNode */
    JSDocTag(334),
    JSDocAugmentsTag(335),
    JSDocImplementsTag(336),
    JSDocAuthorTag(337),
    JSDocDeprecatedTag(338),
    JSDocClassTag(339),
    JSDocPublicTag(340),
    JSDocPrivateTag(341),
    JSDocProtectedTag(342),
    JSDocReadonlyTag(343),
    JSDocOverrideTag(344),
    JSDocCallbackTag(345),
    JSDocOverloadTag(346),
    JSDocEnumTag(347),
    JSDocParameterTag(348),
    JSDocReturnTag(349),
    JSDocThisTag(350),
    JSDocTypeTag(351),
    JSDocTemplateTag(352),
    JSDocTypedefTag(353),
    JSDocSeeTag(354),
    JSDocPropertyTag(355),
    JSDocThrowsTag(356),
    /** Also includes LastJSDocNode, LastJSDocTagNode */
    JSDocSatisfiesTag(357),
    SyntaxList(358),
    NotEmittedStatement(359),
    PartiallyEmittedExpression(360),
    CommaListExpression(361),
    SyntheticReferenceExpression(362),
    Count(363);


    public final int code;

    TSCSyntaxKind(int code) {
        this.code = code;
    }

    public static TSCSyntaxKind fromCode(int code) {
        switch (code) {
            case 0:
                return TSCSyntaxKind.Unknown;
            case 1:
                return TSCSyntaxKind.EndOfFileToken;
            case 2:
                return TSCSyntaxKind.SingleLineCommentTrivia;
            case 3:
                return TSCSyntaxKind.MultiLineCommentTrivia;
            case 4:
                return TSCSyntaxKind.NewLineTrivia;
            case 5:
                return TSCSyntaxKind.WhitespaceTrivia;
            case 6:
                return TSCSyntaxKind.ShebangTrivia;
            case 7:
                return TSCSyntaxKind.ConflictMarkerTrivia;
            case 8:
                return TSCSyntaxKind.NonTextFileMarkerTrivia;
            case 9:
                return TSCSyntaxKind.NumericLiteral;
            case 10:
                return TSCSyntaxKind.BigIntLiteral;
            case 11:
                return TSCSyntaxKind.StringLiteral;
            case 12:
                return TSCSyntaxKind.JsxText;
            case 13:
                return TSCSyntaxKind.JsxTextAllWhiteSpaces;
            case 14:
                return TSCSyntaxKind.RegularExpressionLiteral;
            case 15:
                return TSCSyntaxKind.NoSubstitutionTemplateLiteral;
            case 16:
                return TSCSyntaxKind.TemplateHead;
            case 17:
                return TSCSyntaxKind.TemplateMiddle;
            case 18:
                return TSCSyntaxKind.TemplateTail;
            case 19:
                return TSCSyntaxKind.OpenBraceToken;
            case 20:
                return TSCSyntaxKind.CloseBraceToken;
            case 21:
                return TSCSyntaxKind.OpenParenToken;
            case 22:
                return TSCSyntaxKind.CloseParenToken;
            case 23:
                return TSCSyntaxKind.OpenBracketToken;
            case 24:
                return TSCSyntaxKind.CloseBracketToken;
            case 25:
                return TSCSyntaxKind.DotToken;
            case 26:
                return TSCSyntaxKind.DotDotDotToken;
            case 27:
                return TSCSyntaxKind.SemicolonToken;
            case 28:
                return TSCSyntaxKind.CommaToken;
            case 29:
                return TSCSyntaxKind.QuestionDotToken;
            case 30:
                return TSCSyntaxKind.LessThanToken;
            case 31:
                return TSCSyntaxKind.LessThanSlashToken;
            case 32:
                return TSCSyntaxKind.GreaterThanToken;
            case 33:
                return TSCSyntaxKind.LessThanEqualsToken;
            case 34:
                return TSCSyntaxKind.GreaterThanEqualsToken;
            case 35:
                return TSCSyntaxKind.EqualsEqualsToken;
            case 36:
                return TSCSyntaxKind.ExclamationEqualsToken;
            case 37:
                return TSCSyntaxKind.EqualsEqualsEqualsToken;
            case 38:
                return TSCSyntaxKind.ExclamationEqualsEqualsToken;
            case 39:
                return TSCSyntaxKind.EqualsGreaterThanToken;
            case 40:
                return TSCSyntaxKind.PlusToken;
            case 41:
                return TSCSyntaxKind.MinusToken;
            case 42:
                return TSCSyntaxKind.AsteriskToken;
            case 43:
                return TSCSyntaxKind.AsteriskAsteriskToken;
            case 44:
                return TSCSyntaxKind.SlashToken;
            case 45:
                return TSCSyntaxKind.PercentToken;
            case 46:
                return TSCSyntaxKind.PlusPlusToken;
            case 47:
                return TSCSyntaxKind.MinusMinusToken;
            case 48:
                return TSCSyntaxKind.LessThanLessThanToken;
            case 49:
                return TSCSyntaxKind.GreaterThanGreaterThanToken;
            case 50:
                return TSCSyntaxKind.GreaterThanGreaterThanGreaterThanToken;
            case 51:
                return TSCSyntaxKind.AmpersandToken;
            case 52:
                return TSCSyntaxKind.BarToken;
            case 53:
                return TSCSyntaxKind.CaretToken;
            case 54:
                return TSCSyntaxKind.ExclamationToken;
            case 55:
                return TSCSyntaxKind.TildeToken;
            case 56:
                return TSCSyntaxKind.AmpersandAmpersandToken;
            case 57:
                return TSCSyntaxKind.BarBarToken;
            case 58:
                return TSCSyntaxKind.QuestionToken;
            case 59:
                return TSCSyntaxKind.ColonToken;
            case 60:
                return TSCSyntaxKind.AtToken;
            case 61:
                return TSCSyntaxKind.QuestionQuestionToken;
            case 62:
                return TSCSyntaxKind.BacktickToken;
            case 63:
                return TSCSyntaxKind.HashToken;
            case 64:
                return TSCSyntaxKind.EqualsToken;
            case 65:
                return TSCSyntaxKind.PlusEqualsToken;
            case 66:
                return TSCSyntaxKind.MinusEqualsToken;
            case 67:
                return TSCSyntaxKind.AsteriskEqualsToken;
            case 68:
                return TSCSyntaxKind.AsteriskAsteriskEqualsToken;
            case 69:
                return TSCSyntaxKind.SlashEqualsToken;
            case 70:
                return TSCSyntaxKind.PercentEqualsToken;
            case 71:
                return TSCSyntaxKind.LessThanLessThanEqualsToken;
            case 72:
                return TSCSyntaxKind.GreaterThanGreaterThanEqualsToken;
            case 73:
                return TSCSyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken;
            case 74:
                return TSCSyntaxKind.AmpersandEqualsToken;
            case 75:
                return TSCSyntaxKind.BarEqualsToken;
            case 76:
                return TSCSyntaxKind.BarBarEqualsToken;
            case 77:
                return TSCSyntaxKind.AmpersandAmpersandEqualsToken;
            case 78:
                return TSCSyntaxKind.QuestionQuestionEqualsToken;
            case 79:
                return TSCSyntaxKind.CaretEqualsToken;
            case 80:
                return TSCSyntaxKind.Identifier;
            case 81:
                return TSCSyntaxKind.PrivateIdentifier;
            case 82:
                return TSCSyntaxKind.JSDocCommentTextToken;
            case 83:
                return TSCSyntaxKind.BreakKeyword;
            case 84:
                return TSCSyntaxKind.CaseKeyword;
            case 85:
                return TSCSyntaxKind.CatchKeyword;
            case 86:
                return TSCSyntaxKind.ClassKeyword;
            case 87:
                return TSCSyntaxKind.ConstKeyword;
            case 88:
                return TSCSyntaxKind.ContinueKeyword;
            case 89:
                return TSCSyntaxKind.DebuggerKeyword;
            case 90:
                return TSCSyntaxKind.DefaultKeyword;
            case 91:
                return TSCSyntaxKind.DeleteKeyword;
            case 92:
                return TSCSyntaxKind.DoKeyword;
            case 93:
                return TSCSyntaxKind.ElseKeyword;
            case 94:
                return TSCSyntaxKind.EnumKeyword;
            case 95:
                return TSCSyntaxKind.ExportKeyword;
            case 96:
                return TSCSyntaxKind.ExtendsKeyword;
            case 97:
                return TSCSyntaxKind.FalseKeyword;
            case 98:
                return TSCSyntaxKind.FinallyKeyword;
            case 99:
                return TSCSyntaxKind.ForKeyword;
            case 100:
                return TSCSyntaxKind.FunctionKeyword;
            case 101:
                return TSCSyntaxKind.IfKeyword;
            case 102:
                return TSCSyntaxKind.ImportKeyword;
            case 103:
                return TSCSyntaxKind.InKeyword;
            case 104:
                return TSCSyntaxKind.InstanceOfKeyword;
            case 105:
                return TSCSyntaxKind.NewKeyword;
            case 106:
                return TSCSyntaxKind.NullKeyword;
            case 107:
                return TSCSyntaxKind.ReturnKeyword;
            case 108:
                return TSCSyntaxKind.SuperKeyword;
            case 109:
                return TSCSyntaxKind.SwitchKeyword;
            case 110:
                return TSCSyntaxKind.ThisKeyword;
            case 111:
                return TSCSyntaxKind.ThrowKeyword;
            case 112:
                return TSCSyntaxKind.TrueKeyword;
            case 113:
                return TSCSyntaxKind.TryKeyword;
            case 114:
                return TSCSyntaxKind.TypeOfKeyword;
            case 115:
                return TSCSyntaxKind.VarKeyword;
            case 116:
                return TSCSyntaxKind.VoidKeyword;
            case 117:
                return TSCSyntaxKind.WhileKeyword;
            case 118:
                return TSCSyntaxKind.WithKeyword;
            case 119:
                return TSCSyntaxKind.ImplementsKeyword;
            case 120:
                return TSCSyntaxKind.InterfaceKeyword;
            case 121:
                return TSCSyntaxKind.LetKeyword;
            case 122:
                return TSCSyntaxKind.PackageKeyword;
            case 123:
                return TSCSyntaxKind.PrivateKeyword;
            case 124:
                return TSCSyntaxKind.ProtectedKeyword;
            case 125:
                return TSCSyntaxKind.PublicKeyword;
            case 126:
                return TSCSyntaxKind.StaticKeyword;
            case 127:
                return TSCSyntaxKind.YieldKeyword;
            case 128:
                return TSCSyntaxKind.AbstractKeyword;
            case 129:
                return TSCSyntaxKind.AccessorKeyword;
            case 130:
                return TSCSyntaxKind.AsKeyword;
            case 131:
                return TSCSyntaxKind.AssertsKeyword;
            case 132:
                return TSCSyntaxKind.AssertKeyword;
            case 133:
                return TSCSyntaxKind.AnyKeyword;
            case 134:
                return TSCSyntaxKind.AsyncKeyword;
            case 135:
                return TSCSyntaxKind.AwaitKeyword;
            case 136:
                return TSCSyntaxKind.BooleanKeyword;
            case 137:
                return TSCSyntaxKind.ConstructorKeyword;
            case 138:
                return TSCSyntaxKind.DeclareKeyword;
            case 139:
                return TSCSyntaxKind.GetKeyword;
            case 140:
                return TSCSyntaxKind.InferKeyword;
            case 141:
                return TSCSyntaxKind.IntrinsicKeyword;
            case 142:
                return TSCSyntaxKind.IsKeyword;
            case 143:
                return TSCSyntaxKind.KeyOfKeyword;
            case 144:
                return TSCSyntaxKind.ModuleKeyword;
            case 145:
                return TSCSyntaxKind.NamespaceKeyword;
            case 146:
                return TSCSyntaxKind.NeverKeyword;
            case 147:
                return TSCSyntaxKind.OutKeyword;
            case 148:
                return TSCSyntaxKind.ReadonlyKeyword;
            case 149:
                return TSCSyntaxKind.RequireKeyword;
            case 150:
                return TSCSyntaxKind.NumberKeyword;
            case 151:
                return TSCSyntaxKind.ObjectKeyword;
            case 152:
                return TSCSyntaxKind.SatisfiesKeyword;
            case 153:
                return TSCSyntaxKind.SetKeyword;
            case 154:
                return TSCSyntaxKind.StringKeyword;
            case 155:
                return TSCSyntaxKind.SymbolKeyword;
            case 156:
                return TSCSyntaxKind.TypeKeyword;
            case 157:
                return TSCSyntaxKind.UndefinedKeyword;
            case 158:
                return TSCSyntaxKind.UniqueKeyword;
            case 159:
                return TSCSyntaxKind.UnknownKeyword;
            case 160:
                return TSCSyntaxKind.UsingKeyword;
            case 161:
                return TSCSyntaxKind.FromKeyword;
            case 162:
                return TSCSyntaxKind.GlobalKeyword;
            case 163:
                return TSCSyntaxKind.BigIntKeyword;
            case 164:
                return TSCSyntaxKind.OverrideKeyword;
            case 165:
                return TSCSyntaxKind.OfKeyword;
            case 166:
                return TSCSyntaxKind.QualifiedName;
            case 167:
                return TSCSyntaxKind.ComputedPropertyName;
            case 168:
                return TSCSyntaxKind.TypeParameter;
            case 169:
                return TSCSyntaxKind.Parameter;
            case 170:
                return TSCSyntaxKind.Decorator;
            case 171:
                return TSCSyntaxKind.PropertySignature;
            case 172:
                return TSCSyntaxKind.PropertyDeclaration;
            case 173:
                return TSCSyntaxKind.MethodSignature;
            case 174:
                return TSCSyntaxKind.MethodDeclaration;
            case 175:
                return TSCSyntaxKind.ClassStaticBlockDeclaration;
            case 176:
                return TSCSyntaxKind.Constructor;
            case 177:
                return TSCSyntaxKind.GetAccessor;
            case 178:
                return TSCSyntaxKind.SetAccessor;
            case 179:
                return TSCSyntaxKind.CallSignature;
            case 180:
                return TSCSyntaxKind.ConstructSignature;
            case 181:
                return TSCSyntaxKind.IndexSignature;
            case 182:
                return TSCSyntaxKind.TypePredicate;
            case 183:
                return TSCSyntaxKind.TypeReference;
            case 184:
                return TSCSyntaxKind.FunctionType;
            case 185:
                return TSCSyntaxKind.ConstructorType;
            case 186:
                return TSCSyntaxKind.TypeQuery;
            case 187:
                return TSCSyntaxKind.TypeLiteral;
            case 188:
                return TSCSyntaxKind.ArrayType;
            case 189:
                return TSCSyntaxKind.TupleType;
            case 190:
                return TSCSyntaxKind.OptionalType;
            case 191:
                return TSCSyntaxKind.RestType;
            case 192:
                return TSCSyntaxKind.UnionType;
            case 193:
                return TSCSyntaxKind.IntersectionType;
            case 194:
                return TSCSyntaxKind.ConditionalType;
            case 195:
                return TSCSyntaxKind.InferType;
            case 196:
                return TSCSyntaxKind.ParenthesizedType;
            case 197:
                return TSCSyntaxKind.ThisType;
            case 198:
                return TSCSyntaxKind.TypeOperator;
            case 199:
                return TSCSyntaxKind.IndexedAccessType;
            case 200:
                return TSCSyntaxKind.MappedType;
            case 201:
                return TSCSyntaxKind.LiteralType;
            case 202:
                return TSCSyntaxKind.NamedTupleMember;
            case 203:
                return TSCSyntaxKind.TemplateLiteralType;
            case 204:
                return TSCSyntaxKind.TemplateLiteralTypeSpan;
            case 205:
                return TSCSyntaxKind.ImportType;
            case 206:
                return TSCSyntaxKind.ObjectBindingPattern;
            case 207:
                return TSCSyntaxKind.ArrayBindingPattern;
            case 208:
                return TSCSyntaxKind.BindingElement;
            case 209:
                return TSCSyntaxKind.ArrayLiteralExpression;
            case 210:
                return TSCSyntaxKind.ObjectLiteralExpression;
            case 211:
                return TSCSyntaxKind.PropertyAccessExpression;
            case 212:
                return TSCSyntaxKind.ElementAccessExpression;
            case 213:
                return TSCSyntaxKind.CallExpression;
            case 214:
                return TSCSyntaxKind.NewExpression;
            case 215:
                return TSCSyntaxKind.TaggedTemplateExpression;
            case 216:
                return TSCSyntaxKind.TypeAssertionExpression;
            case 217:
                return TSCSyntaxKind.ParenthesizedExpression;
            case 218:
                return TSCSyntaxKind.FunctionExpression;
            case 219:
                return TSCSyntaxKind.ArrowFunction;
            case 220:
                return TSCSyntaxKind.DeleteExpression;
            case 221:
                return TSCSyntaxKind.TypeOfExpression;
            case 222:
                return TSCSyntaxKind.VoidExpression;
            case 223:
                return TSCSyntaxKind.AwaitExpression;
            case 224:
                return TSCSyntaxKind.PrefixUnaryExpression;
            case 225:
                return TSCSyntaxKind.PostfixUnaryExpression;
            case 226:
                return TSCSyntaxKind.BinaryExpression;
            case 227:
                return TSCSyntaxKind.ConditionalExpression;
            case 228:
                return TSCSyntaxKind.TemplateExpression;
            case 229:
                return TSCSyntaxKind.YieldExpression;
            case 230:
                return TSCSyntaxKind.SpreadElement;
            case 231:
                return TSCSyntaxKind.ClassExpression;
            case 232:
                return TSCSyntaxKind.OmittedExpression;
            case 233:
                return TSCSyntaxKind.ExpressionWithTypeArguments;
            case 234:
                return TSCSyntaxKind.AsExpression;
            case 235:
                return TSCSyntaxKind.NonNullExpression;
            case 236:
                return TSCSyntaxKind.MetaProperty;
            case 237:
                return TSCSyntaxKind.SyntheticExpression;
            case 238:
                return TSCSyntaxKind.SatisfiesExpression;
            case 239:
                return TSCSyntaxKind.TemplateSpan;
            case 240:
                return TSCSyntaxKind.SemicolonClassElement;
            case 241:
                return TSCSyntaxKind.Block;
            case 242:
                return TSCSyntaxKind.EmptyStatement;
            case 243:
                return TSCSyntaxKind.VariableStatement;
            case 244:
                return TSCSyntaxKind.ExpressionStatement;
            case 245:
                return TSCSyntaxKind.IfStatement;
            case 246:
                return TSCSyntaxKind.DoStatement;
            case 247:
                return TSCSyntaxKind.WhileStatement;
            case 248:
                return TSCSyntaxKind.ForStatement;
            case 249:
                return TSCSyntaxKind.ForInStatement;
            case 250:
                return TSCSyntaxKind.ForOfStatement;
            case 251:
                return TSCSyntaxKind.ContinueStatement;
            case 252:
                return TSCSyntaxKind.BreakStatement;
            case 253:
                return TSCSyntaxKind.ReturnStatement;
            case 254:
                return TSCSyntaxKind.WithStatement;
            case 255:
                return TSCSyntaxKind.SwitchStatement;
            case 256:
                return TSCSyntaxKind.LabeledStatement;
            case 257:
                return TSCSyntaxKind.ThrowStatement;
            case 258:
                return TSCSyntaxKind.TryStatement;
            case 259:
                return TSCSyntaxKind.DebuggerStatement;
            case 260:
                return TSCSyntaxKind.VariableDeclaration;
            case 261:
                return TSCSyntaxKind.VariableDeclarationList;
            case 262:
                return TSCSyntaxKind.FunctionDeclaration;
            case 263:
                return TSCSyntaxKind.ClassDeclaration;
            case 264:
                return TSCSyntaxKind.InterfaceDeclaration;
            case 265:
                return TSCSyntaxKind.TypeAliasDeclaration;
            case 266:
                return TSCSyntaxKind.EnumDeclaration;
            case 267:
                return TSCSyntaxKind.ModuleDeclaration;
            case 268:
                return TSCSyntaxKind.ModuleBlock;
            case 269:
                return TSCSyntaxKind.CaseBlock;
            case 270:
                return TSCSyntaxKind.NamespaceExportDeclaration;
            case 271:
                return TSCSyntaxKind.ImportEqualsDeclaration;
            case 272:
                return TSCSyntaxKind.ImportDeclaration;
            case 273:
                return TSCSyntaxKind.ImportClause;
            case 274:
                return TSCSyntaxKind.NamespaceImport;
            case 275:
                return TSCSyntaxKind.NamedImports;
            case 276:
                return TSCSyntaxKind.ImportSpecifier;
            case 277:
                return TSCSyntaxKind.ExportAssignment;
            case 278:
                return TSCSyntaxKind.ExportDeclaration;
            case 279:
                return TSCSyntaxKind.NamedExports;
            case 280:
                return TSCSyntaxKind.NamespaceExport;
            case 281:
                return TSCSyntaxKind.ExportSpecifier;
            case 282:
                return TSCSyntaxKind.MissingDeclaration;
            case 283:
                return TSCSyntaxKind.ExternalModuleReference;
            case 284:
                return TSCSyntaxKind.JsxElement;
            case 285:
                return TSCSyntaxKind.JsxSelfClosingElement;
            case 286:
                return TSCSyntaxKind.JsxOpeningElement;
            case 287:
                return TSCSyntaxKind.JsxClosingElement;
            case 288:
                return TSCSyntaxKind.JsxFragment;
            case 289:
                return TSCSyntaxKind.JsxOpeningFragment;
            case 290:
                return TSCSyntaxKind.JsxClosingFragment;
            case 291:
                return TSCSyntaxKind.JsxAttribute;
            case 292:
                return TSCSyntaxKind.JsxAttributes;
            case 293:
                return TSCSyntaxKind.JsxSpreadAttribute;
            case 294:
                return TSCSyntaxKind.JsxExpression;
            case 295:
                return TSCSyntaxKind.JsxNamespacedName;
            case 296:
                return TSCSyntaxKind.CaseClause;
            case 297:
                return TSCSyntaxKind.DefaultClause;
            case 298:
                return TSCSyntaxKind.HeritageClause;
            case 299:
                return TSCSyntaxKind.CatchClause;
            case 300:
                return TSCSyntaxKind.AssertClause;
            case 301:
                return TSCSyntaxKind.AssertEntry;
            case 302:
                return TSCSyntaxKind.ImportTypeAssertionContainer;
            case 303:
                return TSCSyntaxKind.PropertyAssignment;
            case 304:
                return TSCSyntaxKind.ShorthandPropertyAssignment;
            case 305:
                return TSCSyntaxKind.SpreadAssignment;
            case 306:
                return TSCSyntaxKind.EnumMember;
            case 307:
                return TSCSyntaxKind.UnparsedPrologue;
            case 308:
                return TSCSyntaxKind.UnparsedPrepend;
            case 309:
                return TSCSyntaxKind.UnparsedText;
            case 310:
                return TSCSyntaxKind.UnparsedInternalText;
            case 311:
                return TSCSyntaxKind.UnparsedSyntheticReference;
            case 312:
                return TSCSyntaxKind.SourceFile;
            case 313:
                return TSCSyntaxKind.Bundle;
            case 314:
                return TSCSyntaxKind.UnparsedSource;
            case 315:
                return TSCSyntaxKind.InputFiles;
            case 316:
                return TSCSyntaxKind.JSDocTypeExpression;
            case 317:
                return TSCSyntaxKind.JSDocNameReference;
            case 318:
                return TSCSyntaxKind.JSDocMemberName;
            case 319:
                return TSCSyntaxKind.JSDocAllType;
            case 320:
                return TSCSyntaxKind.JSDocUnknownType;
            case 321:
                return TSCSyntaxKind.JSDocNullableType;
            case 322:
                return TSCSyntaxKind.JSDocNonNullableType;
            case 323:
                return TSCSyntaxKind.JSDocOptionalType;
            case 324:
                return TSCSyntaxKind.JSDocFunctionType;
            case 325:
                return TSCSyntaxKind.JSDocVariadicType;
            case 326:
                return TSCSyntaxKind.JSDocNamepathType;
            case 327:
                return TSCSyntaxKind.JSDoc;
            case 328:
                return TSCSyntaxKind.JSDocText;
            case 329:
                return TSCSyntaxKind.JSDocTypeLiteral;
            case 330:
                return TSCSyntaxKind.JSDocSignature;
            case 331:
                return TSCSyntaxKind.JSDocLink;
            case 332:
                return TSCSyntaxKind.JSDocLinkCode;
            case 333:
                return TSCSyntaxKind.JSDocLinkPlain;
            case 334:
                return TSCSyntaxKind.JSDocTag;
            case 335:
                return TSCSyntaxKind.JSDocAugmentsTag;
            case 336:
                return TSCSyntaxKind.JSDocImplementsTag;
            case 337:
                return TSCSyntaxKind.JSDocAuthorTag;
            case 338:
                return TSCSyntaxKind.JSDocDeprecatedTag;
            case 339:
                return TSCSyntaxKind.JSDocClassTag;
            case 340:
                return TSCSyntaxKind.JSDocPublicTag;
            case 341:
                return TSCSyntaxKind.JSDocPrivateTag;
            case 342:
                return TSCSyntaxKind.JSDocProtectedTag;
            case 343:
                return TSCSyntaxKind.JSDocReadonlyTag;
            case 344:
                return TSCSyntaxKind.JSDocOverrideTag;
            case 345:
                return TSCSyntaxKind.JSDocCallbackTag;
            case 346:
                return TSCSyntaxKind.JSDocOverloadTag;
            case 347:
                return TSCSyntaxKind.JSDocEnumTag;
            case 348:
                return TSCSyntaxKind.JSDocParameterTag;
            case 349:
                return TSCSyntaxKind.JSDocReturnTag;
            case 350:
                return TSCSyntaxKind.JSDocThisTag;
            case 351:
                return TSCSyntaxKind.JSDocTypeTag;
            case 352:
                return TSCSyntaxKind.JSDocTemplateTag;
            case 353:
                return TSCSyntaxKind.JSDocTypedefTag;
            case 354:
                return TSCSyntaxKind.JSDocSeeTag;
            case 355:
                return TSCSyntaxKind.JSDocPropertyTag;
            case 356:
                return TSCSyntaxKind.JSDocThrowsTag;
            case 357:
                return TSCSyntaxKind.JSDocSatisfiesTag;
            case 358:
                return TSCSyntaxKind.SyntaxList;
            case 359:
                return TSCSyntaxKind.NotEmittedStatement;
            case 360:
                return TSCSyntaxKind.PartiallyEmittedExpression;
            case 361:
                return TSCSyntaxKind.CommaListExpression;
            case 362:
                return TSCSyntaxKind.SyntheticReferenceExpression;
            case 363:
                return TSCSyntaxKind.Count;
            default:
                throw new IllegalArgumentException("unknown TSCSyntaxKind code: " + code);
        }
    }
}
