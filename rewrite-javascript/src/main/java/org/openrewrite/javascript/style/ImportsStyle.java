/*
 * Copyright 2025 the original author or authors.
 * <p>
 * Licensed under the Moderne Source Available License (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * https://docs.moderne.io/licensing/moderne-source-available-license
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.openrewrite.javascript.style;

import lombok.Value;
import lombok.With;
import org.jspecify.annotations.Nullable;

import java.util.List;

@Value
@With
public class ImportsStyle implements JavaScriptStyle {
    boolean mergeImportsForMembersFromTheSameModule;
    boolean usePathRelativeToTheProjectOrResourceOrSourcesRootsOrTsconfigJson;
    boolean useDirectoryImportsWhenIndexJsIsAvailable;
    UseFileExtensions useFileExtensions;
    @Nullable
    UseTypeModifiersInImports useTypeModifiersInImports;
    @Nullable
    UsePathMappingsFromTSConfigJson usePathMappingsFromTSConfigJson;
    @Nullable
    UsePathAliases usePathAliases;
    List<String> doNotImportExactlyFrom;
    boolean sortImportedMembers;
    boolean sortImportsByModules;

    public enum UseFileExtensions {
        Auto,
        AlwaysJs,
        Never
    }

    public enum UsePathAliases {
        Always,
        OnlyInFilesOutsideSpecifiedPath,
        Never
    }

    public enum UsePathMappingsFromTSConfigJson {
        Always,
        OnlyInFilesOutsideSpecifiedPath,
        Never
    }

    public enum UseTypeModifiersInImports {
        Auto,
        AlwaysWithType,
        Never
    }
}
