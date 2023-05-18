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
package org.openrewrite.javascript.internal;

import com.caoccao.javet.enums.JSRuntimeType;
import com.caoccao.javet.exceptions.JavetException;
import com.caoccao.javet.interop.loader.JavetLibLoader;
import com.caoccao.javet.utils.JavetOSUtils;
import org.openrewrite.internal.StringUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class JavetNativeBridge {

    private JavetNativeBridge() {
    }

    private static volatile boolean hasLoadedNativeLib = false;
    private static final Object loadNativeLibLock = new Object();

    public static Class<?>[] getClassesInitializedByBridge() {
        return new Class<?>[]{
                JavetNativeBridge.class,
                JavetLibLoader.class,
                JavetOSUtils.class,
                JSRuntimeType.class,
                StringUtils.class
        };
    }

    public static String[] getPackagesInitializedByBridge() {
        return new String[]{
                "com.caoccao.javet.interop",
                "com.caoccao.javet.interop.loader",
                "com.caoccao.javet.values.reference",
                "com.caoccao.javet.enums",
                "com.caoccao.javet.utils",
                "com.caoccao.javet.exceptions"
        };
    }

    public static String getLibResourcePath() {
        try {
            return "/" + new JavetLibLoader(JSRuntimeType.V8).getLibFileName();
        } catch (JavetException e) {
            throw new RuntimeException(e);
        }
    }

    public static List<String> getJavetClassNamesUsedByJNI() {
        try (InputStream is = JavetNativeBridge.class.getResourceAsStream("/javet-jni-classnames.txt")) {
            if (is == null) {
                throw new IllegalStateException("javet-jni-classnames.txt does not exist");
            }
            return Arrays.stream(StringUtils.readFully(is).split("\n"))
                    .filter(name -> !name.isEmpty())
                    .collect(Collectors.toList());
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void init() {
        if (hasLoadedNativeLib) {
            return;
        }
        synchronized (loadNativeLibLock) {
            if (hasLoadedNativeLib) {
                return;
            }

            if (System.getProperty("org.graalvm.nativeimage.kind") != null) {
                String nativeLibPath = getLibResourcePath();

                File tempFile;
                try {
                    tempFile = Files.createTempFile("libjavet", "").toFile();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }

                try (
                        InputStream inputStream = JavetLibLoader.class.getResourceAsStream(nativeLibPath);
                        FileOutputStream outputStream = new FileOutputStream(tempFile)
                ) {
                    if (inputStream == null) {
                        throw new IllegalStateException("Could not find bundled resource for " + nativeLibPath);
                    }
                    byte[] buffer = new byte[4096];
                    while (true) {
                        int length = inputStream.read(buffer);
                        if (length == -1) {
                            break;
                        }
                        outputStream.write(buffer, 0, length);
                    }
                    if (JavetOSUtils.IS_LINUX || JavetOSUtils.IS_MACOS || JavetOSUtils.IS_ANDROID) {
                        try {
                            Runtime.getRuntime().exec(new String[]{"chmod", "755", tempFile.getAbsolutePath()}).waitFor();
                        } catch (Throwable ignored) {
                        }
                    }
                    System.load(tempFile.getAbsolutePath());
                } catch (Throwable t) {
                    throw new RuntimeException(t);
                }
            }

            hasLoadedNativeLib = true;
        }
    }
}
