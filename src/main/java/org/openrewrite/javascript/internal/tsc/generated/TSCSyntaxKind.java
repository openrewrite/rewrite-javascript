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
    /** Also includes FirstLiteralToken */
    NumericLiteral(8),
    BigIntLiteral(9),
    StringLiteral(10),
    JsxText(11),
    JsxTextAllWhiteSpaces(12),
    RegularExpressionLiteral(13),
    /** Also includes LastLiteralToken, FirstTemplateToken */
    NoSubstitutionTemplateLiteral(14),
    TemplateHead(15),
    TemplateMiddle(16),
    /** Also includes LastTemplateToken */
    TemplateTail(17),
    /** Also includes FirstPunctuation */
    OpenBraceToken(18),
    CloseBraceToken(19),
    OpenParenToken(20),
    CloseParenToken(21),
    OpenBracketToken(22),
    CloseBracketToken(23),
    DotToken(24),
    DotDotDotToken(25),
    SemicolonToken(26),
    CommaToken(27),
    QuestionDotToken(28),
    /** Also includes FirstBinaryOperator */
    LessThanToken(29),
    LessThanSlashToken(30),
    GreaterThanToken(31),
    LessThanEqualsToken(32),
    GreaterThanEqualsToken(33),
    EqualsEqualsToken(34),
    ExclamationEqualsToken(35),
    EqualsEqualsEqualsToken(36),
    ExclamationEqualsEqualsToken(37),
    EqualsGreaterThanToken(38),
    PlusToken(39),
    MinusToken(40),
    AsteriskToken(41),
    AsteriskAsteriskToken(42),
    SlashToken(43),
    PercentToken(44),
    PlusPlusToken(45),
    MinusMinusToken(46),
    LessThanLessThanToken(47),
    GreaterThanGreaterThanToken(48),
    GreaterThanGreaterThanGreaterThanToken(49),
    AmpersandToken(50),
    BarToken(51),
    CaretToken(52),
    ExclamationToken(53),
    TildeToken(54),
    AmpersandAmpersandToken(55),
    BarBarToken(56),
    QuestionToken(57),
    ColonToken(58),
    AtToken(59),
    QuestionQuestionToken(60),
    BacktickToken(61),
    HashToken(62),
    /** Also includes FirstAssignment */
    EqualsToken(63),
    /** Also includes FirstCompoundAssignment */
    PlusEqualsToken(64),
    MinusEqualsToken(65),
    AsteriskEqualsToken(66),
    AsteriskAsteriskEqualsToken(67),
    SlashEqualsToken(68),
    PercentEqualsToken(69),
    LessThanLessThanEqualsToken(70),
    GreaterThanGreaterThanEqualsToken(71),
    GreaterThanGreaterThanGreaterThanEqualsToken(72),
    AmpersandEqualsToken(73),
    BarEqualsToken(74),
    BarBarEqualsToken(75),
    AmpersandAmpersandEqualsToken(76),
    QuestionQuestionEqualsToken(77),
    /** Also includes LastAssignment, LastCompoundAssignment, LastPunctuation, LastBinaryOperator */
    CaretEqualsToken(78),
    Identifier(79),
    PrivateIdentifier(80),
    /** Also includes FirstReservedWord, FirstKeyword */
    BreakKeyword(81),
    CaseKeyword(82),
    CatchKeyword(83),
    ClassKeyword(84),
    ConstKeyword(85),
    ContinueKeyword(86),
    DebuggerKeyword(87),
    DefaultKeyword(88),
    DeleteKeyword(89),
    DoKeyword(90),
    ElseKeyword(91),
    EnumKeyword(92),
    ExportKeyword(93),
    ExtendsKeyword(94),
    FalseKeyword(95),
    FinallyKeyword(96),
    ForKeyword(97),
    FunctionKeyword(98),
    IfKeyword(99),
    ImportKeyword(100),
    InKeyword(101),
    InstanceOfKeyword(102),
    NewKeyword(103),
    NullKeyword(104),
    ReturnKeyword(105),
    SuperKeyword(106),
    SwitchKeyword(107),
    ThisKeyword(108),
    ThrowKeyword(109),
    TrueKeyword(110),
    TryKeyword(111),
    TypeOfKeyword(112),
    VarKeyword(113),
    VoidKeyword(114),
    WhileKeyword(115),
    /** Also includes LastReservedWord */
    WithKeyword(116),
    /** Also includes FirstFutureReservedWord */
    ImplementsKeyword(117),
    InterfaceKeyword(118),
    LetKeyword(119),
    PackageKeyword(120),
    PrivateKeyword(121),
    ProtectedKeyword(122),
    PublicKeyword(123),
    StaticKeyword(124),
    /** Also includes LastFutureReservedWord */
    YieldKeyword(125),
    /** Also includes FirstContextualKeyword */
    AbstractKeyword(126),
    AccessorKeyword(127),
    AsKeyword(128),
    AssertsKeyword(129),
    AssertKeyword(130),
    AnyKeyword(131),
    AsyncKeyword(132),
    AwaitKeyword(133),
    BooleanKeyword(134),
    ConstructorKeyword(135),
    DeclareKeyword(136),
    GetKeyword(137),
    InferKeyword(138),
    IntrinsicKeyword(139),
    IsKeyword(140),
    KeyOfKeyword(141),
    ModuleKeyword(142),
    NamespaceKeyword(143),
    NeverKeyword(144),
    OutKeyword(145),
    ReadonlyKeyword(146),
    RequireKeyword(147),
    NumberKeyword(148),
    ObjectKeyword(149),
    SatisfiesKeyword(150),
    SetKeyword(151),
    StringKeyword(152),
    SymbolKeyword(153),
    TypeKeyword(154),
    UndefinedKeyword(155),
    UniqueKeyword(156),
    UnknownKeyword(157),
    FromKeyword(158),
    GlobalKeyword(159),
    BigIntKeyword(160),
    OverrideKeyword(161),
    /** Also includes LastKeyword, LastToken, LastContextualKeyword */
    OfKeyword(162),
    /** Also includes FirstNode */
    QualifiedName(163),
    ComputedPropertyName(164),
    TypeParameter(165),
    Parameter(166),
    Decorator(167),
    PropertySignature(168),
    PropertyDeclaration(169),
    MethodSignature(170),
    MethodDeclaration(171),
    ClassStaticBlockDeclaration(172),
    Constructor(173),
    GetAccessor(174),
    SetAccessor(175),
    CallSignature(176),
    ConstructSignature(177),
    IndexSignature(178),
    /** Also includes FirstTypeNode */
    TypePredicate(179),
    TypeReference(180),
    FunctionType(181),
    ConstructorType(182),
    TypeQuery(183),
    TypeLiteral(184),
    ArrayType(185),
    TupleType(186),
    OptionalType(187),
    RestType(188),
    UnionType(189),
    IntersectionType(190),
    ConditionalType(191),
    InferType(192),
    ParenthesizedType(193),
    ThisType(194),
    TypeOperator(195),
    IndexedAccessType(196),
    MappedType(197),
    LiteralType(198),
    NamedTupleMember(199),
    TemplateLiteralType(200),
    TemplateLiteralTypeSpan(201),
    /** Also includes LastTypeNode */
    ImportType(202),
    ObjectBindingPattern(203),
    ArrayBindingPattern(204),
    BindingElement(205),
    ArrayLiteralExpression(206),
    ObjectLiteralExpression(207),
    PropertyAccessExpression(208),
    ElementAccessExpression(209),
    CallExpression(210),
    NewExpression(211),
    TaggedTemplateExpression(212),
    TypeAssertionExpression(213),
    ParenthesizedExpression(214),
    FunctionExpression(215),
    ArrowFunction(216),
    DeleteExpression(217),
    TypeOfExpression(218),
    VoidExpression(219),
    AwaitExpression(220),
    PrefixUnaryExpression(221),
    PostfixUnaryExpression(222),
    BinaryExpression(223),
    ConditionalExpression(224),
    TemplateExpression(225),
    YieldExpression(226),
    SpreadElement(227),
    ClassExpression(228),
    OmittedExpression(229),
    ExpressionWithTypeArguments(230),
    AsExpression(231),
    NonNullExpression(232),
    MetaProperty(233),
    SyntheticExpression(234),
    SatisfiesExpression(235),
    TemplateSpan(236),
    SemicolonClassElement(237),
    Block(238),
    EmptyStatement(239),
    /** Also includes FirstStatement */
    VariableStatement(240),
    ExpressionStatement(241),
    IfStatement(242),
    DoStatement(243),
    WhileStatement(244),
    ForStatement(245),
    ForInStatement(246),
    ForOfStatement(247),
    ContinueStatement(248),
    BreakStatement(249),
    ReturnStatement(250),
    WithStatement(251),
    SwitchStatement(252),
    LabeledStatement(253),
    ThrowStatement(254),
    TryStatement(255),
    /** Also includes LastStatement */
    DebuggerStatement(256),
    VariableDeclaration(257),
    VariableDeclarationList(258),
    FunctionDeclaration(259),
    ClassDeclaration(260),
    InterfaceDeclaration(261),
    TypeAliasDeclaration(262),
    EnumDeclaration(263),
    ModuleDeclaration(264),
    ModuleBlock(265),
    CaseBlock(266),
    NamespaceExportDeclaration(267),
    ImportEqualsDeclaration(268),
    ImportDeclaration(269),
    ImportClause(270),
    NamespaceImport(271),
    NamedImports(272),
    ImportSpecifier(273),
    ExportAssignment(274),
    ExportDeclaration(275),
    NamedExports(276),
    NamespaceExport(277),
    ExportSpecifier(278),
    MissingDeclaration(279),
    ExternalModuleReference(280),
    JsxElement(281),
    JsxSelfClosingElement(282),
    JsxOpeningElement(283),
    JsxClosingElement(284),
    JsxFragment(285),
    JsxOpeningFragment(286),
    JsxClosingFragment(287),
    JsxAttribute(288),
    JsxAttributes(289),
    JsxSpreadAttribute(290),
    JsxExpression(291),
    CaseClause(292),
    DefaultClause(293),
    HeritageClause(294),
    CatchClause(295),
    AssertClause(296),
    AssertEntry(297),
    ImportTypeAssertionContainer(298),
    PropertyAssignment(299),
    ShorthandPropertyAssignment(300),
    SpreadAssignment(301),
    EnumMember(302),
    UnparsedPrologue(303),
    UnparsedPrepend(304),
    UnparsedText(305),
    UnparsedInternalText(306),
    UnparsedSyntheticReference(307),
    SourceFile(308),
    Bundle(309),
    UnparsedSource(310),
    InputFiles(311),
    /** Also includes FirstJSDocNode */
    JSDocTypeExpression(312),
    JSDocNameReference(313),
    JSDocMemberName(314),
    JSDocAllType(315),
    JSDocUnknownType(316),
    JSDocNullableType(317),
    JSDocNonNullableType(318),
    JSDocOptionalType(319),
    JSDocFunctionType(320),
    JSDocVariadicType(321),
    JSDocNamepathType(322),
    /** Also includes JSDocComment */
    JSDoc(323),
    JSDocText(324),
    JSDocTypeLiteral(325),
    JSDocSignature(326),
    JSDocLink(327),
    JSDocLinkCode(328),
    JSDocLinkPlain(329),
    /** Also includes FirstJSDocTagNode */
    JSDocTag(330),
    JSDocAugmentsTag(331),
    JSDocImplementsTag(332),
    JSDocAuthorTag(333),
    JSDocDeprecatedTag(334),
    JSDocClassTag(335),
    JSDocPublicTag(336),
    JSDocPrivateTag(337),
    JSDocProtectedTag(338),
    JSDocReadonlyTag(339),
    JSDocOverrideTag(340),
    JSDocCallbackTag(341),
    JSDocOverloadTag(342),
    JSDocEnumTag(343),
    JSDocParameterTag(344),
    JSDocReturnTag(345),
    JSDocThisTag(346),
    JSDocTypeTag(347),
    JSDocTemplateTag(348),
    JSDocTypedefTag(349),
    JSDocSeeTag(350),
    JSDocPropertyTag(351),
    JSDocThrowsTag(352),
    /** Also includes LastJSDocNode, LastJSDocTagNode */
    JSDocSatisfiesTag(353),
    SyntaxList(354),
    NotEmittedStatement(355),
    PartiallyEmittedExpression(356),
    CommaListExpression(357),
    MergeDeclarationMarker(358),
    EndOfDeclarationMarker(359),
    SyntheticReferenceExpression(360),
    Count(361);


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
                return TSCSyntaxKind.NumericLiteral;
            case 9:
                return TSCSyntaxKind.BigIntLiteral;
            case 10:
                return TSCSyntaxKind.StringLiteral;
            case 11:
                return TSCSyntaxKind.JsxText;
            case 12:
                return TSCSyntaxKind.JsxTextAllWhiteSpaces;
            case 13:
                return TSCSyntaxKind.RegularExpressionLiteral;
            case 14:
                return TSCSyntaxKind.NoSubstitutionTemplateLiteral;
            case 15:
                return TSCSyntaxKind.TemplateHead;
            case 16:
                return TSCSyntaxKind.TemplateMiddle;
            case 17:
                return TSCSyntaxKind.TemplateTail;
            case 18:
                return TSCSyntaxKind.OpenBraceToken;
            case 19:
                return TSCSyntaxKind.CloseBraceToken;
            case 20:
                return TSCSyntaxKind.OpenParenToken;
            case 21:
                return TSCSyntaxKind.CloseParenToken;
            case 22:
                return TSCSyntaxKind.OpenBracketToken;
            case 23:
                return TSCSyntaxKind.CloseBracketToken;
            case 24:
                return TSCSyntaxKind.DotToken;
            case 25:
                return TSCSyntaxKind.DotDotDotToken;
            case 26:
                return TSCSyntaxKind.SemicolonToken;
            case 27:
                return TSCSyntaxKind.CommaToken;
            case 28:
                return TSCSyntaxKind.QuestionDotToken;
            case 29:
                return TSCSyntaxKind.LessThanToken;
            case 30:
                return TSCSyntaxKind.LessThanSlashToken;
            case 31:
                return TSCSyntaxKind.GreaterThanToken;
            case 32:
                return TSCSyntaxKind.LessThanEqualsToken;
            case 33:
                return TSCSyntaxKind.GreaterThanEqualsToken;
            case 34:
                return TSCSyntaxKind.EqualsEqualsToken;
            case 35:
                return TSCSyntaxKind.ExclamationEqualsToken;
            case 36:
                return TSCSyntaxKind.EqualsEqualsEqualsToken;
            case 37:
                return TSCSyntaxKind.ExclamationEqualsEqualsToken;
            case 38:
                return TSCSyntaxKind.EqualsGreaterThanToken;
            case 39:
                return TSCSyntaxKind.PlusToken;
            case 40:
                return TSCSyntaxKind.MinusToken;
            case 41:
                return TSCSyntaxKind.AsteriskToken;
            case 42:
                return TSCSyntaxKind.AsteriskAsteriskToken;
            case 43:
                return TSCSyntaxKind.SlashToken;
            case 44:
                return TSCSyntaxKind.PercentToken;
            case 45:
                return TSCSyntaxKind.PlusPlusToken;
            case 46:
                return TSCSyntaxKind.MinusMinusToken;
            case 47:
                return TSCSyntaxKind.LessThanLessThanToken;
            case 48:
                return TSCSyntaxKind.GreaterThanGreaterThanToken;
            case 49:
                return TSCSyntaxKind.GreaterThanGreaterThanGreaterThanToken;
            case 50:
                return TSCSyntaxKind.AmpersandToken;
            case 51:
                return TSCSyntaxKind.BarToken;
            case 52:
                return TSCSyntaxKind.CaretToken;
            case 53:
                return TSCSyntaxKind.ExclamationToken;
            case 54:
                return TSCSyntaxKind.TildeToken;
            case 55:
                return TSCSyntaxKind.AmpersandAmpersandToken;
            case 56:
                return TSCSyntaxKind.BarBarToken;
            case 57:
                return TSCSyntaxKind.QuestionToken;
            case 58:
                return TSCSyntaxKind.ColonToken;
            case 59:
                return TSCSyntaxKind.AtToken;
            case 60:
                return TSCSyntaxKind.QuestionQuestionToken;
            case 61:
                return TSCSyntaxKind.BacktickToken;
            case 62:
                return TSCSyntaxKind.HashToken;
            case 63:
                return TSCSyntaxKind.EqualsToken;
            case 64:
                return TSCSyntaxKind.PlusEqualsToken;
            case 65:
                return TSCSyntaxKind.MinusEqualsToken;
            case 66:
                return TSCSyntaxKind.AsteriskEqualsToken;
            case 67:
                return TSCSyntaxKind.AsteriskAsteriskEqualsToken;
            case 68:
                return TSCSyntaxKind.SlashEqualsToken;
            case 69:
                return TSCSyntaxKind.PercentEqualsToken;
            case 70:
                return TSCSyntaxKind.LessThanLessThanEqualsToken;
            case 71:
                return TSCSyntaxKind.GreaterThanGreaterThanEqualsToken;
            case 72:
                return TSCSyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken;
            case 73:
                return TSCSyntaxKind.AmpersandEqualsToken;
            case 74:
                return TSCSyntaxKind.BarEqualsToken;
            case 75:
                return TSCSyntaxKind.BarBarEqualsToken;
            case 76:
                return TSCSyntaxKind.AmpersandAmpersandEqualsToken;
            case 77:
                return TSCSyntaxKind.QuestionQuestionEqualsToken;
            case 78:
                return TSCSyntaxKind.CaretEqualsToken;
            case 79:
                return TSCSyntaxKind.Identifier;
            case 80:
                return TSCSyntaxKind.PrivateIdentifier;
            case 81:
                return TSCSyntaxKind.BreakKeyword;
            case 82:
                return TSCSyntaxKind.CaseKeyword;
            case 83:
                return TSCSyntaxKind.CatchKeyword;
            case 84:
                return TSCSyntaxKind.ClassKeyword;
            case 85:
                return TSCSyntaxKind.ConstKeyword;
            case 86:
                return TSCSyntaxKind.ContinueKeyword;
            case 87:
                return TSCSyntaxKind.DebuggerKeyword;
            case 88:
                return TSCSyntaxKind.DefaultKeyword;
            case 89:
                return TSCSyntaxKind.DeleteKeyword;
            case 90:
                return TSCSyntaxKind.DoKeyword;
            case 91:
                return TSCSyntaxKind.ElseKeyword;
            case 92:
                return TSCSyntaxKind.EnumKeyword;
            case 93:
                return TSCSyntaxKind.ExportKeyword;
            case 94:
                return TSCSyntaxKind.ExtendsKeyword;
            case 95:
                return TSCSyntaxKind.FalseKeyword;
            case 96:
                return TSCSyntaxKind.FinallyKeyword;
            case 97:
                return TSCSyntaxKind.ForKeyword;
            case 98:
                return TSCSyntaxKind.FunctionKeyword;
            case 99:
                return TSCSyntaxKind.IfKeyword;
            case 100:
                return TSCSyntaxKind.ImportKeyword;
            case 101:
                return TSCSyntaxKind.InKeyword;
            case 102:
                return TSCSyntaxKind.InstanceOfKeyword;
            case 103:
                return TSCSyntaxKind.NewKeyword;
            case 104:
                return TSCSyntaxKind.NullKeyword;
            case 105:
                return TSCSyntaxKind.ReturnKeyword;
            case 106:
                return TSCSyntaxKind.SuperKeyword;
            case 107:
                return TSCSyntaxKind.SwitchKeyword;
            case 108:
                return TSCSyntaxKind.ThisKeyword;
            case 109:
                return TSCSyntaxKind.ThrowKeyword;
            case 110:
                return TSCSyntaxKind.TrueKeyword;
            case 111:
                return TSCSyntaxKind.TryKeyword;
            case 112:
                return TSCSyntaxKind.TypeOfKeyword;
            case 113:
                return TSCSyntaxKind.VarKeyword;
            case 114:
                return TSCSyntaxKind.VoidKeyword;
            case 115:
                return TSCSyntaxKind.WhileKeyword;
            case 116:
                return TSCSyntaxKind.WithKeyword;
            case 117:
                return TSCSyntaxKind.ImplementsKeyword;
            case 118:
                return TSCSyntaxKind.InterfaceKeyword;
            case 119:
                return TSCSyntaxKind.LetKeyword;
            case 120:
                return TSCSyntaxKind.PackageKeyword;
            case 121:
                return TSCSyntaxKind.PrivateKeyword;
            case 122:
                return TSCSyntaxKind.ProtectedKeyword;
            case 123:
                return TSCSyntaxKind.PublicKeyword;
            case 124:
                return TSCSyntaxKind.StaticKeyword;
            case 125:
                return TSCSyntaxKind.YieldKeyword;
            case 126:
                return TSCSyntaxKind.AbstractKeyword;
            case 127:
                return TSCSyntaxKind.AccessorKeyword;
            case 128:
                return TSCSyntaxKind.AsKeyword;
            case 129:
                return TSCSyntaxKind.AssertsKeyword;
            case 130:
                return TSCSyntaxKind.AssertKeyword;
            case 131:
                return TSCSyntaxKind.AnyKeyword;
            case 132:
                return TSCSyntaxKind.AsyncKeyword;
            case 133:
                return TSCSyntaxKind.AwaitKeyword;
            case 134:
                return TSCSyntaxKind.BooleanKeyword;
            case 135:
                return TSCSyntaxKind.ConstructorKeyword;
            case 136:
                return TSCSyntaxKind.DeclareKeyword;
            case 137:
                return TSCSyntaxKind.GetKeyword;
            case 138:
                return TSCSyntaxKind.InferKeyword;
            case 139:
                return TSCSyntaxKind.IntrinsicKeyword;
            case 140:
                return TSCSyntaxKind.IsKeyword;
            case 141:
                return TSCSyntaxKind.KeyOfKeyword;
            case 142:
                return TSCSyntaxKind.ModuleKeyword;
            case 143:
                return TSCSyntaxKind.NamespaceKeyword;
            case 144:
                return TSCSyntaxKind.NeverKeyword;
            case 145:
                return TSCSyntaxKind.OutKeyword;
            case 146:
                return TSCSyntaxKind.ReadonlyKeyword;
            case 147:
                return TSCSyntaxKind.RequireKeyword;
            case 148:
                return TSCSyntaxKind.NumberKeyword;
            case 149:
                return TSCSyntaxKind.ObjectKeyword;
            case 150:
                return TSCSyntaxKind.SatisfiesKeyword;
            case 151:
                return TSCSyntaxKind.SetKeyword;
            case 152:
                return TSCSyntaxKind.StringKeyword;
            case 153:
                return TSCSyntaxKind.SymbolKeyword;
            case 154:
                return TSCSyntaxKind.TypeKeyword;
            case 155:
                return TSCSyntaxKind.UndefinedKeyword;
            case 156:
                return TSCSyntaxKind.UniqueKeyword;
            case 157:
                return TSCSyntaxKind.UnknownKeyword;
            case 158:
                return TSCSyntaxKind.FromKeyword;
            case 159:
                return TSCSyntaxKind.GlobalKeyword;
            case 160:
                return TSCSyntaxKind.BigIntKeyword;
            case 161:
                return TSCSyntaxKind.OverrideKeyword;
            case 162:
                return TSCSyntaxKind.OfKeyword;
            case 163:
                return TSCSyntaxKind.QualifiedName;
            case 164:
                return TSCSyntaxKind.ComputedPropertyName;
            case 165:
                return TSCSyntaxKind.TypeParameter;
            case 166:
                return TSCSyntaxKind.Parameter;
            case 167:
                return TSCSyntaxKind.Decorator;
            case 168:
                return TSCSyntaxKind.PropertySignature;
            case 169:
                return TSCSyntaxKind.PropertyDeclaration;
            case 170:
                return TSCSyntaxKind.MethodSignature;
            case 171:
                return TSCSyntaxKind.MethodDeclaration;
            case 172:
                return TSCSyntaxKind.ClassStaticBlockDeclaration;
            case 173:
                return TSCSyntaxKind.Constructor;
            case 174:
                return TSCSyntaxKind.GetAccessor;
            case 175:
                return TSCSyntaxKind.SetAccessor;
            case 176:
                return TSCSyntaxKind.CallSignature;
            case 177:
                return TSCSyntaxKind.ConstructSignature;
            case 178:
                return TSCSyntaxKind.IndexSignature;
            case 179:
                return TSCSyntaxKind.TypePredicate;
            case 180:
                return TSCSyntaxKind.TypeReference;
            case 181:
                return TSCSyntaxKind.FunctionType;
            case 182:
                return TSCSyntaxKind.ConstructorType;
            case 183:
                return TSCSyntaxKind.TypeQuery;
            case 184:
                return TSCSyntaxKind.TypeLiteral;
            case 185:
                return TSCSyntaxKind.ArrayType;
            case 186:
                return TSCSyntaxKind.TupleType;
            case 187:
                return TSCSyntaxKind.OptionalType;
            case 188:
                return TSCSyntaxKind.RestType;
            case 189:
                return TSCSyntaxKind.UnionType;
            case 190:
                return TSCSyntaxKind.IntersectionType;
            case 191:
                return TSCSyntaxKind.ConditionalType;
            case 192:
                return TSCSyntaxKind.InferType;
            case 193:
                return TSCSyntaxKind.ParenthesizedType;
            case 194:
                return TSCSyntaxKind.ThisType;
            case 195:
                return TSCSyntaxKind.TypeOperator;
            case 196:
                return TSCSyntaxKind.IndexedAccessType;
            case 197:
                return TSCSyntaxKind.MappedType;
            case 198:
                return TSCSyntaxKind.LiteralType;
            case 199:
                return TSCSyntaxKind.NamedTupleMember;
            case 200:
                return TSCSyntaxKind.TemplateLiteralType;
            case 201:
                return TSCSyntaxKind.TemplateLiteralTypeSpan;
            case 202:
                return TSCSyntaxKind.ImportType;
            case 203:
                return TSCSyntaxKind.ObjectBindingPattern;
            case 204:
                return TSCSyntaxKind.ArrayBindingPattern;
            case 205:
                return TSCSyntaxKind.BindingElement;
            case 206:
                return TSCSyntaxKind.ArrayLiteralExpression;
            case 207:
                return TSCSyntaxKind.ObjectLiteralExpression;
            case 208:
                return TSCSyntaxKind.PropertyAccessExpression;
            case 209:
                return TSCSyntaxKind.ElementAccessExpression;
            case 210:
                return TSCSyntaxKind.CallExpression;
            case 211:
                return TSCSyntaxKind.NewExpression;
            case 212:
                return TSCSyntaxKind.TaggedTemplateExpression;
            case 213:
                return TSCSyntaxKind.TypeAssertionExpression;
            case 214:
                return TSCSyntaxKind.ParenthesizedExpression;
            case 215:
                return TSCSyntaxKind.FunctionExpression;
            case 216:
                return TSCSyntaxKind.ArrowFunction;
            case 217:
                return TSCSyntaxKind.DeleteExpression;
            case 218:
                return TSCSyntaxKind.TypeOfExpression;
            case 219:
                return TSCSyntaxKind.VoidExpression;
            case 220:
                return TSCSyntaxKind.AwaitExpression;
            case 221:
                return TSCSyntaxKind.PrefixUnaryExpression;
            case 222:
                return TSCSyntaxKind.PostfixUnaryExpression;
            case 223:
                return TSCSyntaxKind.BinaryExpression;
            case 224:
                return TSCSyntaxKind.ConditionalExpression;
            case 225:
                return TSCSyntaxKind.TemplateExpression;
            case 226:
                return TSCSyntaxKind.YieldExpression;
            case 227:
                return TSCSyntaxKind.SpreadElement;
            case 228:
                return TSCSyntaxKind.ClassExpression;
            case 229:
                return TSCSyntaxKind.OmittedExpression;
            case 230:
                return TSCSyntaxKind.ExpressionWithTypeArguments;
            case 231:
                return TSCSyntaxKind.AsExpression;
            case 232:
                return TSCSyntaxKind.NonNullExpression;
            case 233:
                return TSCSyntaxKind.MetaProperty;
            case 234:
                return TSCSyntaxKind.SyntheticExpression;
            case 235:
                return TSCSyntaxKind.SatisfiesExpression;
            case 236:
                return TSCSyntaxKind.TemplateSpan;
            case 237:
                return TSCSyntaxKind.SemicolonClassElement;
            case 238:
                return TSCSyntaxKind.Block;
            case 239:
                return TSCSyntaxKind.EmptyStatement;
            case 240:
                return TSCSyntaxKind.VariableStatement;
            case 241:
                return TSCSyntaxKind.ExpressionStatement;
            case 242:
                return TSCSyntaxKind.IfStatement;
            case 243:
                return TSCSyntaxKind.DoStatement;
            case 244:
                return TSCSyntaxKind.WhileStatement;
            case 245:
                return TSCSyntaxKind.ForStatement;
            case 246:
                return TSCSyntaxKind.ForInStatement;
            case 247:
                return TSCSyntaxKind.ForOfStatement;
            case 248:
                return TSCSyntaxKind.ContinueStatement;
            case 249:
                return TSCSyntaxKind.BreakStatement;
            case 250:
                return TSCSyntaxKind.ReturnStatement;
            case 251:
                return TSCSyntaxKind.WithStatement;
            case 252:
                return TSCSyntaxKind.SwitchStatement;
            case 253:
                return TSCSyntaxKind.LabeledStatement;
            case 254:
                return TSCSyntaxKind.ThrowStatement;
            case 255:
                return TSCSyntaxKind.TryStatement;
            case 256:
                return TSCSyntaxKind.DebuggerStatement;
            case 257:
                return TSCSyntaxKind.VariableDeclaration;
            case 258:
                return TSCSyntaxKind.VariableDeclarationList;
            case 259:
                return TSCSyntaxKind.FunctionDeclaration;
            case 260:
                return TSCSyntaxKind.ClassDeclaration;
            case 261:
                return TSCSyntaxKind.InterfaceDeclaration;
            case 262:
                return TSCSyntaxKind.TypeAliasDeclaration;
            case 263:
                return TSCSyntaxKind.EnumDeclaration;
            case 264:
                return TSCSyntaxKind.ModuleDeclaration;
            case 265:
                return TSCSyntaxKind.ModuleBlock;
            case 266:
                return TSCSyntaxKind.CaseBlock;
            case 267:
                return TSCSyntaxKind.NamespaceExportDeclaration;
            case 268:
                return TSCSyntaxKind.ImportEqualsDeclaration;
            case 269:
                return TSCSyntaxKind.ImportDeclaration;
            case 270:
                return TSCSyntaxKind.ImportClause;
            case 271:
                return TSCSyntaxKind.NamespaceImport;
            case 272:
                return TSCSyntaxKind.NamedImports;
            case 273:
                return TSCSyntaxKind.ImportSpecifier;
            case 274:
                return TSCSyntaxKind.ExportAssignment;
            case 275:
                return TSCSyntaxKind.ExportDeclaration;
            case 276:
                return TSCSyntaxKind.NamedExports;
            case 277:
                return TSCSyntaxKind.NamespaceExport;
            case 278:
                return TSCSyntaxKind.ExportSpecifier;
            case 279:
                return TSCSyntaxKind.MissingDeclaration;
            case 280:
                return TSCSyntaxKind.ExternalModuleReference;
            case 281:
                return TSCSyntaxKind.JsxElement;
            case 282:
                return TSCSyntaxKind.JsxSelfClosingElement;
            case 283:
                return TSCSyntaxKind.JsxOpeningElement;
            case 284:
                return TSCSyntaxKind.JsxClosingElement;
            case 285:
                return TSCSyntaxKind.JsxFragment;
            case 286:
                return TSCSyntaxKind.JsxOpeningFragment;
            case 287:
                return TSCSyntaxKind.JsxClosingFragment;
            case 288:
                return TSCSyntaxKind.JsxAttribute;
            case 289:
                return TSCSyntaxKind.JsxAttributes;
            case 290:
                return TSCSyntaxKind.JsxSpreadAttribute;
            case 291:
                return TSCSyntaxKind.JsxExpression;
            case 292:
                return TSCSyntaxKind.CaseClause;
            case 293:
                return TSCSyntaxKind.DefaultClause;
            case 294:
                return TSCSyntaxKind.HeritageClause;
            case 295:
                return TSCSyntaxKind.CatchClause;
            case 296:
                return TSCSyntaxKind.AssertClause;
            case 297:
                return TSCSyntaxKind.AssertEntry;
            case 298:
                return TSCSyntaxKind.ImportTypeAssertionContainer;
            case 299:
                return TSCSyntaxKind.PropertyAssignment;
            case 300:
                return TSCSyntaxKind.ShorthandPropertyAssignment;
            case 301:
                return TSCSyntaxKind.SpreadAssignment;
            case 302:
                return TSCSyntaxKind.EnumMember;
            case 303:
                return TSCSyntaxKind.UnparsedPrologue;
            case 304:
                return TSCSyntaxKind.UnparsedPrepend;
            case 305:
                return TSCSyntaxKind.UnparsedText;
            case 306:
                return TSCSyntaxKind.UnparsedInternalText;
            case 307:
                return TSCSyntaxKind.UnparsedSyntheticReference;
            case 308:
                return TSCSyntaxKind.SourceFile;
            case 309:
                return TSCSyntaxKind.Bundle;
            case 310:
                return TSCSyntaxKind.UnparsedSource;
            case 311:
                return TSCSyntaxKind.InputFiles;
            case 312:
                return TSCSyntaxKind.JSDocTypeExpression;
            case 313:
                return TSCSyntaxKind.JSDocNameReference;
            case 314:
                return TSCSyntaxKind.JSDocMemberName;
            case 315:
                return TSCSyntaxKind.JSDocAllType;
            case 316:
                return TSCSyntaxKind.JSDocUnknownType;
            case 317:
                return TSCSyntaxKind.JSDocNullableType;
            case 318:
                return TSCSyntaxKind.JSDocNonNullableType;
            case 319:
                return TSCSyntaxKind.JSDocOptionalType;
            case 320:
                return TSCSyntaxKind.JSDocFunctionType;
            case 321:
                return TSCSyntaxKind.JSDocVariadicType;
            case 322:
                return TSCSyntaxKind.JSDocNamepathType;
            case 323:
                return TSCSyntaxKind.JSDoc;
            case 324:
                return TSCSyntaxKind.JSDocText;
            case 325:
                return TSCSyntaxKind.JSDocTypeLiteral;
            case 326:
                return TSCSyntaxKind.JSDocSignature;
            case 327:
                return TSCSyntaxKind.JSDocLink;
            case 328:
                return TSCSyntaxKind.JSDocLinkCode;
            case 329:
                return TSCSyntaxKind.JSDocLinkPlain;
            case 330:
                return TSCSyntaxKind.JSDocTag;
            case 331:
                return TSCSyntaxKind.JSDocAugmentsTag;
            case 332:
                return TSCSyntaxKind.JSDocImplementsTag;
            case 333:
                return TSCSyntaxKind.JSDocAuthorTag;
            case 334:
                return TSCSyntaxKind.JSDocDeprecatedTag;
            case 335:
                return TSCSyntaxKind.JSDocClassTag;
            case 336:
                return TSCSyntaxKind.JSDocPublicTag;
            case 337:
                return TSCSyntaxKind.JSDocPrivateTag;
            case 338:
                return TSCSyntaxKind.JSDocProtectedTag;
            case 339:
                return TSCSyntaxKind.JSDocReadonlyTag;
            case 340:
                return TSCSyntaxKind.JSDocOverrideTag;
            case 341:
                return TSCSyntaxKind.JSDocCallbackTag;
            case 342:
                return TSCSyntaxKind.JSDocOverloadTag;
            case 343:
                return TSCSyntaxKind.JSDocEnumTag;
            case 344:
                return TSCSyntaxKind.JSDocParameterTag;
            case 345:
                return TSCSyntaxKind.JSDocReturnTag;
            case 346:
                return TSCSyntaxKind.JSDocThisTag;
            case 347:
                return TSCSyntaxKind.JSDocTypeTag;
            case 348:
                return TSCSyntaxKind.JSDocTemplateTag;
            case 349:
                return TSCSyntaxKind.JSDocTypedefTag;
            case 350:
                return TSCSyntaxKind.JSDocSeeTag;
            case 351:
                return TSCSyntaxKind.JSDocPropertyTag;
            case 352:
                return TSCSyntaxKind.JSDocThrowsTag;
            case 353:
                return TSCSyntaxKind.JSDocSatisfiesTag;
            case 354:
                return TSCSyntaxKind.SyntaxList;
            case 355:
                return TSCSyntaxKind.NotEmittedStatement;
            case 356:
                return TSCSyntaxKind.PartiallyEmittedExpression;
            case 357:
                return TSCSyntaxKind.CommaListExpression;
            case 358:
                return TSCSyntaxKind.MergeDeclarationMarker;
            case 359:
                return TSCSyntaxKind.EndOfDeclarationMarker;
            case 360:
                return TSCSyntaxKind.SyntheticReferenceExpression;
            case 361:
                return TSCSyntaxKind.Count;
            default:
                throw new IllegalArgumentException("unknown TSCSyntaxKind code: " + code);
        }
    }
}
