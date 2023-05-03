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

public enum SyntaxKind {
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

    SyntaxKind(int code) {
        this.code = code;
    }

    public static SyntaxKind fromCode(int code) {
        switch (code) {
            case 0:
                return SyntaxKind.Unknown;
            case 1:
                return SyntaxKind.EndOfFileToken;
            case 2:
                return SyntaxKind.SingleLineCommentTrivia;
            case 3:
                return SyntaxKind.MultiLineCommentTrivia;
            case 4:
                return SyntaxKind.NewLineTrivia;
            case 5:
                return SyntaxKind.WhitespaceTrivia;
            case 6:
                return SyntaxKind.ShebangTrivia;
            case 7:
                return SyntaxKind.ConflictMarkerTrivia;
            case 8:
                return SyntaxKind.NumericLiteral;
            case 9:
                return SyntaxKind.BigIntLiteral;
            case 10:
                return SyntaxKind.StringLiteral;
            case 11:
                return SyntaxKind.JsxText;
            case 12:
                return SyntaxKind.JsxTextAllWhiteSpaces;
            case 13:
                return SyntaxKind.RegularExpressionLiteral;
            case 14:
                return SyntaxKind.NoSubstitutionTemplateLiteral;
            case 15:
                return SyntaxKind.TemplateHead;
            case 16:
                return SyntaxKind.TemplateMiddle;
            case 17:
                return SyntaxKind.TemplateTail;
            case 18:
                return SyntaxKind.OpenBraceToken;
            case 19:
                return SyntaxKind.CloseBraceToken;
            case 20:
                return SyntaxKind.OpenParenToken;
            case 21:
                return SyntaxKind.CloseParenToken;
            case 22:
                return SyntaxKind.OpenBracketToken;
            case 23:
                return SyntaxKind.CloseBracketToken;
            case 24:
                return SyntaxKind.DotToken;
            case 25:
                return SyntaxKind.DotDotDotToken;
            case 26:
                return SyntaxKind.SemicolonToken;
            case 27:
                return SyntaxKind.CommaToken;
            case 28:
                return SyntaxKind.QuestionDotToken;
            case 29:
                return SyntaxKind.LessThanToken;
            case 30:
                return SyntaxKind.LessThanSlashToken;
            case 31:
                return SyntaxKind.GreaterThanToken;
            case 32:
                return SyntaxKind.LessThanEqualsToken;
            case 33:
                return SyntaxKind.GreaterThanEqualsToken;
            case 34:
                return SyntaxKind.EqualsEqualsToken;
            case 35:
                return SyntaxKind.ExclamationEqualsToken;
            case 36:
                return SyntaxKind.EqualsEqualsEqualsToken;
            case 37:
                return SyntaxKind.ExclamationEqualsEqualsToken;
            case 38:
                return SyntaxKind.EqualsGreaterThanToken;
            case 39:
                return SyntaxKind.PlusToken;
            case 40:
                return SyntaxKind.MinusToken;
            case 41:
                return SyntaxKind.AsteriskToken;
            case 42:
                return SyntaxKind.AsteriskAsteriskToken;
            case 43:
                return SyntaxKind.SlashToken;
            case 44:
                return SyntaxKind.PercentToken;
            case 45:
                return SyntaxKind.PlusPlusToken;
            case 46:
                return SyntaxKind.MinusMinusToken;
            case 47:
                return SyntaxKind.LessThanLessThanToken;
            case 48:
                return SyntaxKind.GreaterThanGreaterThanToken;
            case 49:
                return SyntaxKind.GreaterThanGreaterThanGreaterThanToken;
            case 50:
                return SyntaxKind.AmpersandToken;
            case 51:
                return SyntaxKind.BarToken;
            case 52:
                return SyntaxKind.CaretToken;
            case 53:
                return SyntaxKind.ExclamationToken;
            case 54:
                return SyntaxKind.TildeToken;
            case 55:
                return SyntaxKind.AmpersandAmpersandToken;
            case 56:
                return SyntaxKind.BarBarToken;
            case 57:
                return SyntaxKind.QuestionToken;
            case 58:
                return SyntaxKind.ColonToken;
            case 59:
                return SyntaxKind.AtToken;
            case 60:
                return SyntaxKind.QuestionQuestionToken;
            case 61:
                return SyntaxKind.BacktickToken;
            case 62:
                return SyntaxKind.HashToken;
            case 63:
                return SyntaxKind.EqualsToken;
            case 64:
                return SyntaxKind.PlusEqualsToken;
            case 65:
                return SyntaxKind.MinusEqualsToken;
            case 66:
                return SyntaxKind.AsteriskEqualsToken;
            case 67:
                return SyntaxKind.AsteriskAsteriskEqualsToken;
            case 68:
                return SyntaxKind.SlashEqualsToken;
            case 69:
                return SyntaxKind.PercentEqualsToken;
            case 70:
                return SyntaxKind.LessThanLessThanEqualsToken;
            case 71:
                return SyntaxKind.GreaterThanGreaterThanEqualsToken;
            case 72:
                return SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken;
            case 73:
                return SyntaxKind.AmpersandEqualsToken;
            case 74:
                return SyntaxKind.BarEqualsToken;
            case 75:
                return SyntaxKind.BarBarEqualsToken;
            case 76:
                return SyntaxKind.AmpersandAmpersandEqualsToken;
            case 77:
                return SyntaxKind.QuestionQuestionEqualsToken;
            case 78:
                return SyntaxKind.CaretEqualsToken;
            case 79:
                return SyntaxKind.Identifier;
            case 80:
                return SyntaxKind.PrivateIdentifier;
            case 81:
                return SyntaxKind.BreakKeyword;
            case 82:
                return SyntaxKind.CaseKeyword;
            case 83:
                return SyntaxKind.CatchKeyword;
            case 84:
                return SyntaxKind.ClassKeyword;
            case 85:
                return SyntaxKind.ConstKeyword;
            case 86:
                return SyntaxKind.ContinueKeyword;
            case 87:
                return SyntaxKind.DebuggerKeyword;
            case 88:
                return SyntaxKind.DefaultKeyword;
            case 89:
                return SyntaxKind.DeleteKeyword;
            case 90:
                return SyntaxKind.DoKeyword;
            case 91:
                return SyntaxKind.ElseKeyword;
            case 92:
                return SyntaxKind.EnumKeyword;
            case 93:
                return SyntaxKind.ExportKeyword;
            case 94:
                return SyntaxKind.ExtendsKeyword;
            case 95:
                return SyntaxKind.FalseKeyword;
            case 96:
                return SyntaxKind.FinallyKeyword;
            case 97:
                return SyntaxKind.ForKeyword;
            case 98:
                return SyntaxKind.FunctionKeyword;
            case 99:
                return SyntaxKind.IfKeyword;
            case 100:
                return SyntaxKind.ImportKeyword;
            case 101:
                return SyntaxKind.InKeyword;
            case 102:
                return SyntaxKind.InstanceOfKeyword;
            case 103:
                return SyntaxKind.NewKeyword;
            case 104:
                return SyntaxKind.NullKeyword;
            case 105:
                return SyntaxKind.ReturnKeyword;
            case 106:
                return SyntaxKind.SuperKeyword;
            case 107:
                return SyntaxKind.SwitchKeyword;
            case 108:
                return SyntaxKind.ThisKeyword;
            case 109:
                return SyntaxKind.ThrowKeyword;
            case 110:
                return SyntaxKind.TrueKeyword;
            case 111:
                return SyntaxKind.TryKeyword;
            case 112:
                return SyntaxKind.TypeOfKeyword;
            case 113:
                return SyntaxKind.VarKeyword;
            case 114:
                return SyntaxKind.VoidKeyword;
            case 115:
                return SyntaxKind.WhileKeyword;
            case 116:
                return SyntaxKind.WithKeyword;
            case 117:
                return SyntaxKind.ImplementsKeyword;
            case 118:
                return SyntaxKind.InterfaceKeyword;
            case 119:
                return SyntaxKind.LetKeyword;
            case 120:
                return SyntaxKind.PackageKeyword;
            case 121:
                return SyntaxKind.PrivateKeyword;
            case 122:
                return SyntaxKind.ProtectedKeyword;
            case 123:
                return SyntaxKind.PublicKeyword;
            case 124:
                return SyntaxKind.StaticKeyword;
            case 125:
                return SyntaxKind.YieldKeyword;
            case 126:
                return SyntaxKind.AbstractKeyword;
            case 127:
                return SyntaxKind.AccessorKeyword;
            case 128:
                return SyntaxKind.AsKeyword;
            case 129:
                return SyntaxKind.AssertsKeyword;
            case 130:
                return SyntaxKind.AssertKeyword;
            case 131:
                return SyntaxKind.AnyKeyword;
            case 132:
                return SyntaxKind.AsyncKeyword;
            case 133:
                return SyntaxKind.AwaitKeyword;
            case 134:
                return SyntaxKind.BooleanKeyword;
            case 135:
                return SyntaxKind.ConstructorKeyword;
            case 136:
                return SyntaxKind.DeclareKeyword;
            case 137:
                return SyntaxKind.GetKeyword;
            case 138:
                return SyntaxKind.InferKeyword;
            case 139:
                return SyntaxKind.IntrinsicKeyword;
            case 140:
                return SyntaxKind.IsKeyword;
            case 141:
                return SyntaxKind.KeyOfKeyword;
            case 142:
                return SyntaxKind.ModuleKeyword;
            case 143:
                return SyntaxKind.NamespaceKeyword;
            case 144:
                return SyntaxKind.NeverKeyword;
            case 145:
                return SyntaxKind.OutKeyword;
            case 146:
                return SyntaxKind.ReadonlyKeyword;
            case 147:
                return SyntaxKind.RequireKeyword;
            case 148:
                return SyntaxKind.NumberKeyword;
            case 149:
                return SyntaxKind.ObjectKeyword;
            case 150:
                return SyntaxKind.SatisfiesKeyword;
            case 151:
                return SyntaxKind.SetKeyword;
            case 152:
                return SyntaxKind.StringKeyword;
            case 153:
                return SyntaxKind.SymbolKeyword;
            case 154:
                return SyntaxKind.TypeKeyword;
            case 155:
                return SyntaxKind.UndefinedKeyword;
            case 156:
                return SyntaxKind.UniqueKeyword;
            case 157:
                return SyntaxKind.UnknownKeyword;
            case 158:
                return SyntaxKind.FromKeyword;
            case 159:
                return SyntaxKind.GlobalKeyword;
            case 160:
                return SyntaxKind.BigIntKeyword;
            case 161:
                return SyntaxKind.OverrideKeyword;
            case 162:
                return SyntaxKind.OfKeyword;
            case 163:
                return SyntaxKind.QualifiedName;
            case 164:
                return SyntaxKind.ComputedPropertyName;
            case 165:
                return SyntaxKind.TypeParameter;
            case 166:
                return SyntaxKind.Parameter;
            case 167:
                return SyntaxKind.Decorator;
            case 168:
                return SyntaxKind.PropertySignature;
            case 169:
                return SyntaxKind.PropertyDeclaration;
            case 170:
                return SyntaxKind.MethodSignature;
            case 171:
                return SyntaxKind.MethodDeclaration;
            case 172:
                return SyntaxKind.ClassStaticBlockDeclaration;
            case 173:
                return SyntaxKind.Constructor;
            case 174:
                return SyntaxKind.GetAccessor;
            case 175:
                return SyntaxKind.SetAccessor;
            case 176:
                return SyntaxKind.CallSignature;
            case 177:
                return SyntaxKind.ConstructSignature;
            case 178:
                return SyntaxKind.IndexSignature;
            case 179:
                return SyntaxKind.TypePredicate;
            case 180:
                return SyntaxKind.TypeReference;
            case 181:
                return SyntaxKind.FunctionType;
            case 182:
                return SyntaxKind.ConstructorType;
            case 183:
                return SyntaxKind.TypeQuery;
            case 184:
                return SyntaxKind.TypeLiteral;
            case 185:
                return SyntaxKind.ArrayType;
            case 186:
                return SyntaxKind.TupleType;
            case 187:
                return SyntaxKind.OptionalType;
            case 188:
                return SyntaxKind.RestType;
            case 189:
                return SyntaxKind.UnionType;
            case 190:
                return SyntaxKind.IntersectionType;
            case 191:
                return SyntaxKind.ConditionalType;
            case 192:
                return SyntaxKind.InferType;
            case 193:
                return SyntaxKind.ParenthesizedType;
            case 194:
                return SyntaxKind.ThisType;
            case 195:
                return SyntaxKind.TypeOperator;
            case 196:
                return SyntaxKind.IndexedAccessType;
            case 197:
                return SyntaxKind.MappedType;
            case 198:
                return SyntaxKind.LiteralType;
            case 199:
                return SyntaxKind.NamedTupleMember;
            case 200:
                return SyntaxKind.TemplateLiteralType;
            case 201:
                return SyntaxKind.TemplateLiteralTypeSpan;
            case 202:
                return SyntaxKind.ImportType;
            case 203:
                return SyntaxKind.ObjectBindingPattern;
            case 204:
                return SyntaxKind.ArrayBindingPattern;
            case 205:
                return SyntaxKind.BindingElement;
            case 206:
                return SyntaxKind.ArrayLiteralExpression;
            case 207:
                return SyntaxKind.ObjectLiteralExpression;
            case 208:
                return SyntaxKind.PropertyAccessExpression;
            case 209:
                return SyntaxKind.ElementAccessExpression;
            case 210:
                return SyntaxKind.CallExpression;
            case 211:
                return SyntaxKind.NewExpression;
            case 212:
                return SyntaxKind.TaggedTemplateExpression;
            case 213:
                return SyntaxKind.TypeAssertionExpression;
            case 214:
                return SyntaxKind.ParenthesizedExpression;
            case 215:
                return SyntaxKind.FunctionExpression;
            case 216:
                return SyntaxKind.ArrowFunction;
            case 217:
                return SyntaxKind.DeleteExpression;
            case 218:
                return SyntaxKind.TypeOfExpression;
            case 219:
                return SyntaxKind.VoidExpression;
            case 220:
                return SyntaxKind.AwaitExpression;
            case 221:
                return SyntaxKind.PrefixUnaryExpression;
            case 222:
                return SyntaxKind.PostfixUnaryExpression;
            case 223:
                return SyntaxKind.BinaryExpression;
            case 224:
                return SyntaxKind.ConditionalExpression;
            case 225:
                return SyntaxKind.TemplateExpression;
            case 226:
                return SyntaxKind.YieldExpression;
            case 227:
                return SyntaxKind.SpreadElement;
            case 228:
                return SyntaxKind.ClassExpression;
            case 229:
                return SyntaxKind.OmittedExpression;
            case 230:
                return SyntaxKind.ExpressionWithTypeArguments;
            case 231:
                return SyntaxKind.AsExpression;
            case 232:
                return SyntaxKind.NonNullExpression;
            case 233:
                return SyntaxKind.MetaProperty;
            case 234:
                return SyntaxKind.SyntheticExpression;
            case 235:
                return SyntaxKind.SatisfiesExpression;
            case 236:
                return SyntaxKind.TemplateSpan;
            case 237:
                return SyntaxKind.SemicolonClassElement;
            case 238:
                return SyntaxKind.Block;
            case 239:
                return SyntaxKind.EmptyStatement;
            case 240:
                return SyntaxKind.VariableStatement;
            case 241:
                return SyntaxKind.ExpressionStatement;
            case 242:
                return SyntaxKind.IfStatement;
            case 243:
                return SyntaxKind.DoStatement;
            case 244:
                return SyntaxKind.WhileStatement;
            case 245:
                return SyntaxKind.ForStatement;
            case 246:
                return SyntaxKind.ForInStatement;
            case 247:
                return SyntaxKind.ForOfStatement;
            case 248:
                return SyntaxKind.ContinueStatement;
            case 249:
                return SyntaxKind.BreakStatement;
            case 250:
                return SyntaxKind.ReturnStatement;
            case 251:
                return SyntaxKind.WithStatement;
            case 252:
                return SyntaxKind.SwitchStatement;
            case 253:
                return SyntaxKind.LabeledStatement;
            case 254:
                return SyntaxKind.ThrowStatement;
            case 255:
                return SyntaxKind.TryStatement;
            case 256:
                return SyntaxKind.DebuggerStatement;
            case 257:
                return SyntaxKind.VariableDeclaration;
            case 258:
                return SyntaxKind.VariableDeclarationList;
            case 259:
                return SyntaxKind.FunctionDeclaration;
            case 260:
                return SyntaxKind.ClassDeclaration;
            case 261:
                return SyntaxKind.InterfaceDeclaration;
            case 262:
                return SyntaxKind.TypeAliasDeclaration;
            case 263:
                return SyntaxKind.EnumDeclaration;
            case 264:
                return SyntaxKind.ModuleDeclaration;
            case 265:
                return SyntaxKind.ModuleBlock;
            case 266:
                return SyntaxKind.CaseBlock;
            case 267:
                return SyntaxKind.NamespaceExportDeclaration;
            case 268:
                return SyntaxKind.ImportEqualsDeclaration;
            case 269:
                return SyntaxKind.ImportDeclaration;
            case 270:
                return SyntaxKind.ImportClause;
            case 271:
                return SyntaxKind.NamespaceImport;
            case 272:
                return SyntaxKind.NamedImports;
            case 273:
                return SyntaxKind.ImportSpecifier;
            case 274:
                return SyntaxKind.ExportAssignment;
            case 275:
                return SyntaxKind.ExportDeclaration;
            case 276:
                return SyntaxKind.NamedExports;
            case 277:
                return SyntaxKind.NamespaceExport;
            case 278:
                return SyntaxKind.ExportSpecifier;
            case 279:
                return SyntaxKind.MissingDeclaration;
            case 280:
                return SyntaxKind.ExternalModuleReference;
            case 281:
                return SyntaxKind.JsxElement;
            case 282:
                return SyntaxKind.JsxSelfClosingElement;
            case 283:
                return SyntaxKind.JsxOpeningElement;
            case 284:
                return SyntaxKind.JsxClosingElement;
            case 285:
                return SyntaxKind.JsxFragment;
            case 286:
                return SyntaxKind.JsxOpeningFragment;
            case 287:
                return SyntaxKind.JsxClosingFragment;
            case 288:
                return SyntaxKind.JsxAttribute;
            case 289:
                return SyntaxKind.JsxAttributes;
            case 290:
                return SyntaxKind.JsxSpreadAttribute;
            case 291:
                return SyntaxKind.JsxExpression;
            case 292:
                return SyntaxKind.CaseClause;
            case 293:
                return SyntaxKind.DefaultClause;
            case 294:
                return SyntaxKind.HeritageClause;
            case 295:
                return SyntaxKind.CatchClause;
            case 296:
                return SyntaxKind.AssertClause;
            case 297:
                return SyntaxKind.AssertEntry;
            case 298:
                return SyntaxKind.ImportTypeAssertionContainer;
            case 299:
                return SyntaxKind.PropertyAssignment;
            case 300:
                return SyntaxKind.ShorthandPropertyAssignment;
            case 301:
                return SyntaxKind.SpreadAssignment;
            case 302:
                return SyntaxKind.EnumMember;
            case 303:
                return SyntaxKind.UnparsedPrologue;
            case 304:
                return SyntaxKind.UnparsedPrepend;
            case 305:
                return SyntaxKind.UnparsedText;
            case 306:
                return SyntaxKind.UnparsedInternalText;
            case 307:
                return SyntaxKind.UnparsedSyntheticReference;
            case 308:
                return SyntaxKind.SourceFile;
            case 309:
                return SyntaxKind.Bundle;
            case 310:
                return SyntaxKind.UnparsedSource;
            case 311:
                return SyntaxKind.InputFiles;
            case 312:
                return SyntaxKind.JSDocTypeExpression;
            case 313:
                return SyntaxKind.JSDocNameReference;
            case 314:
                return SyntaxKind.JSDocMemberName;
            case 315:
                return SyntaxKind.JSDocAllType;
            case 316:
                return SyntaxKind.JSDocUnknownType;
            case 317:
                return SyntaxKind.JSDocNullableType;
            case 318:
                return SyntaxKind.JSDocNonNullableType;
            case 319:
                return SyntaxKind.JSDocOptionalType;
            case 320:
                return SyntaxKind.JSDocFunctionType;
            case 321:
                return SyntaxKind.JSDocVariadicType;
            case 322:
                return SyntaxKind.JSDocNamepathType;
            case 323:
                return SyntaxKind.JSDoc;
            case 324:
                return SyntaxKind.JSDocText;
            case 325:
                return SyntaxKind.JSDocTypeLiteral;
            case 326:
                return SyntaxKind.JSDocSignature;
            case 327:
                return SyntaxKind.JSDocLink;
            case 328:
                return SyntaxKind.JSDocLinkCode;
            case 329:
                return SyntaxKind.JSDocLinkPlain;
            case 330:
                return SyntaxKind.JSDocTag;
            case 331:
                return SyntaxKind.JSDocAugmentsTag;
            case 332:
                return SyntaxKind.JSDocImplementsTag;
            case 333:
                return SyntaxKind.JSDocAuthorTag;
            case 334:
                return SyntaxKind.JSDocDeprecatedTag;
            case 335:
                return SyntaxKind.JSDocClassTag;
            case 336:
                return SyntaxKind.JSDocPublicTag;
            case 337:
                return SyntaxKind.JSDocPrivateTag;
            case 338:
                return SyntaxKind.JSDocProtectedTag;
            case 339:
                return SyntaxKind.JSDocReadonlyTag;
            case 340:
                return SyntaxKind.JSDocOverrideTag;
            case 341:
                return SyntaxKind.JSDocCallbackTag;
            case 342:
                return SyntaxKind.JSDocOverloadTag;
            case 343:
                return SyntaxKind.JSDocEnumTag;
            case 344:
                return SyntaxKind.JSDocParameterTag;
            case 345:
                return SyntaxKind.JSDocReturnTag;
            case 346:
                return SyntaxKind.JSDocThisTag;
            case 347:
                return SyntaxKind.JSDocTypeTag;
            case 348:
                return SyntaxKind.JSDocTemplateTag;
            case 349:
                return SyntaxKind.JSDocTypedefTag;
            case 350:
                return SyntaxKind.JSDocSeeTag;
            case 351:
                return SyntaxKind.JSDocPropertyTag;
            case 352:
                return SyntaxKind.JSDocThrowsTag;
            case 353:
                return SyntaxKind.JSDocSatisfiesTag;
            case 354:
                return SyntaxKind.SyntaxList;
            case 355:
                return SyntaxKind.NotEmittedStatement;
            case 356:
                return SyntaxKind.PartiallyEmittedExpression;
            case 357:
                return SyntaxKind.CommaListExpression;
            case 358:
                return SyntaxKind.MergeDeclarationMarker;
            case 359:
                return SyntaxKind.EndOfDeclarationMarker;
            case 360:
                return SyntaxKind.SyntheticReferenceExpression;
            case 361:
                return SyntaxKind.Count;
            default:
                throw new IllegalArgumentException("unknown SyntaxKind code: " + code);
        }
    }
}
