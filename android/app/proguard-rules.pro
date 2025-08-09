# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Expo modules
-keep class expo.modules.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }

# AsyncStorage
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# Image picker
-keep class expo.modules.imagepicker.** { *; }

# Notifications
-keep class expo.modules.notifications.** { *; }

# Camera
-keep class expo.modules.camera.** { *; }

# Gesture handler
-keep class com.swmansion.gesturehandler.** { *; }

# Safe area context
-keep class com.th3rdwave.safeareacontext.** { *; }

# General React Native
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }
-keep class com.facebook.react.views.** { *; }

# Keep application class
-keep public class * extends android.app.Application
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service

# Prevent obfuscation of native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Add any project specific keep options here:

# Keep enum classes
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep Parcelable implementations
-keep class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator *;
}
