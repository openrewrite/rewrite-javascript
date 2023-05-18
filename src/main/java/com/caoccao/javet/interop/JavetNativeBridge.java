package com.caoccao.javet.interop;

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
        return new Class<?>[] {
                JavetNativeBridge.class,
                JavetLibLoader.class,
                JavetOSUtils.class,
                JSRuntimeType.class,
                StringUtils.class
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
                System.err.println("**** Loading native lib from " + getLibResourcePath() + "...");
                String nativeLibPath = getLibResourcePath();

                File tempFile;
                try {
                    tempFile = Files.createTempFile("javet", "").toFile();
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

                System.err.println("**** Loaded native lib.");
            }

            hasLoadedNativeLib = true;
        }
    }
}
