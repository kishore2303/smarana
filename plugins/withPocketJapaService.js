const fs = require('node:fs');
const path = require('node:path');
const {
  withAndroidManifest,
  withDangerousMod,
  withMainApplication,
} = require('@expo/config-plugins');

const PACKAGE_NAME = 'com.pradikshana.app';
const POCKET_DIR = 'pocket';

const REQUIRED_PERMISSIONS = [
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_SPECIAL_USE',
  'android.permission.WAKE_LOCK',
  'android.permission.VIBRATE',
  'android.permission.POST_NOTIFICATIONS',
];

const POCKET_TAP_DETECTOR_KT = `package ${PACKAGE_NAME}.${POCKET_DIR}

import kotlin.math.sqrt

class PocketTapDetector(sensitivity: String = "medium") {
  private data class Config(
    val impulseThresholdG: Float,
    val minJerkG: Float,
    val maxGyroRadPerSec: Float
  )

  private enum class Phase {
    IDLE,
    TAP1_ACTIVE,
    WAIT_TAP2
  }

  private val gravityAlphaQuiet = 0.88f
  private val gravityAlphaSpike = 0.96f
  private val gravityAlphaRotating = 0.70f
  private val maxTapDurationMs = 115L
  private val minTapGapMs = 90L
  private val maxDoubleTapWindowMs = 650L
  private val cooldownMs = 500L

  private var config = configFor(sensitivity)
  private var hasInitialized = false
  private var gravityX = 0f
  private var gravityY = 0f
  private var gravityZ = 0f
  private var prevX = 0f
  private var prevY = 0f
  private var prevZ = 0f
  private var phase = Phase.IDLE
  private var tap1StartMs = 0L
  private var cooldownUntilMs = 0L
  private var latestGyroMag = 0f

  private fun configFor(sensitivity: String): Config = when (sensitivity) {
    "low" -> Config(0.34f, 0.21f, 2.5f)
    "high" -> Config(0.13f, 0.105f, 3.8f)
    else -> Config(0.20f, 0.115f, 3.1f)
  }

  fun setSensitivity(sensitivity: String) {
    config = configFor(sensitivity)
  }

  fun reset() {
    hasInitialized = false
    gravityX = 0f
    gravityY = 0f
    gravityZ = 0f
    prevX = 0f
    prevY = 0f
    prevZ = 0f
    phase = Phase.IDLE
    tap1StartMs = 0L
    cooldownUntilMs = 0L
    latestGyroMag = 0f
  }

  fun updateGyroscope(x: Float, y: Float, z: Float) {
    latestGyroMag = sqrt(x * x + y * y + z * z)
  }

  /**
   * Expects raw Android SensorManager accelerometer values in m/s^2.
   * Uses 3-axis gravity tracking so back-of-phone Z-axis taps work cleanly
   * when the phone is upright in a pocket or held at an angle.
   */
  fun processAccelerometer(xMs2: Float, yMs2: Float, zMs2: Float, timestampMs: Long): Boolean {
    val gx = xMs2 / 9.80665f
    val gy = yMs2 / 9.80665f
    val gz = zMs2 / 9.80665f

    if (!hasInitialized) {
      hasInitialized = true
      gravityX = gx
      gravityY = gy
      gravityZ = gz
      prevX = gx
      prevY = gy
      prevZ = gz
      return false
    }

    val dx = gx - gravityX
    val dy = gy - gravityY
    val dz = gz - gravityZ
    val linearImpulse = sqrt(dx * dx + dy * dy + dz * dz)

    val jx = gx - prevX
    val jy = gy - prevY
    val jz = gz - prevZ
    val jerk = sqrt(jx * jx + jy * jy + jz * jz)
    prevX = gx
    prevY = gy
    prevZ = gz

    val isRotating = latestGyroMag > config.maxGyroRadPerSec
    val alpha = when {
      isRotating -> gravityAlphaRotating
      linearImpulse < config.impulseThresholdG * 0.7f -> gravityAlphaQuiet
      else -> gravityAlphaSpike
    }

    gravityX = alpha * gravityX + (1f - alpha) * gx
    gravityY = alpha * gravityY + (1f - alpha) * gy
    gravityZ = alpha * gravityZ + (1f - alpha) * gz

    if (timestampMs < cooldownUntilMs) {
      phase = Phase.IDLE
      return false
    }

    if (isRotating) {
      phase = Phase.IDLE
      return false
    }

    val isQuiet = linearImpulse < config.impulseThresholdG * 0.45f
    val isSharpPeak = linearImpulse >= config.impulseThresholdG && jerk >= config.minJerkG

    return when (phase) {
      Phase.IDLE -> {
        if (isSharpPeak) {
          phase = Phase.TAP1_ACTIVE
          tap1StartMs = timestampMs
        }
        false
      }
      Phase.TAP1_ACTIVE -> {
        if (timestampMs - tap1StartMs > maxTapDurationMs) {
          phase = Phase.IDLE
          false
        } else {
          if (isQuiet) {
            phase = Phase.WAIT_TAP2
          }
          false
        }
      }
      Phase.WAIT_TAP2 -> {
        val elapsed = timestampMs - tap1StartMs
        if (elapsed > maxDoubleTapWindowMs) {
          if (isSharpPeak) {
            phase = Phase.TAP1_ACTIVE
            tap1StartMs = timestampMs
          } else {
            phase = Phase.IDLE
          }
          false
        } else if (elapsed >= minTapGapMs && isSharpPeak) {
          phase = Phase.IDLE
          cooldownUntilMs = timestampMs + cooldownMs
          true
        } else {
          false
        }
      }
    }
  }
}
`;

const POCKET_JAPA_SERVICE_KT = `package ${PACKAGE_NAME}.${POCKET_DIR}

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import androidx.core.app.NotificationCompat
import kotlin.math.max

class PocketJapaService : Service(), SensorEventListener {
  companion object {
    const val CHANNEL_ID = "smarana-pocket-mode"
    const val COMPLETION_CHANNEL_ID = "practice-completion"
    const val NOTIFICATION_ID = 4201
    const val COMPLETION_NOTIFICATION_ID = 4202
    const val PREFS_NAME = "smarana_pocket_state"

    const val ACTION_START = "${PACKAGE_NAME}.pocket.START"
    const val ACTION_PAUSE = "${PACKAGE_NAME}.pocket.PAUSE"
    const val ACTION_RESUME = "${PACKAGE_NAME}.pocket.RESUME"
    const val ACTION_STOP = "${PACKAGE_NAME}.pocket.STOP"
    const val ACTION_SYNC = "${PACKAGE_NAME}.pocket.SYNC"

    const val EXTRA_SESSION_ID = "sessionId"
    const val EXTRA_MODE = "mode"
    const val EXTRA_LABEL = "label"
    const val EXTRA_TARGET_COUNT = "targetCount"
    const val EXTRA_REMAINING_COUNT = "remainingCount"
    const val EXTRA_SENSITIVITY = "sensitivity"
  }

  private var sensorManager: SensorManager? = null
  private var accelSensor: Sensor? = null
  private var gyroSensor: Sensor? = null
  private var wakeLock: PowerManager.WakeLock? = null
  private val detector = PocketTapDetector("medium")

  private var sessionId: String = ""
  private var mode: String = "japa"
  private var label: String = "Smarana"
  private var targetCount: Int = 108
  private var remainingCount: Int = 108
  private var sensitivity: String = "medium"
  private var isPaused: Boolean = false
  private var isActive: Boolean = false

  override fun onCreate() {
    super.onCreate()
    createChannels()
    sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
    accelSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    gyroSensor = sensorManager?.getDefaultSensor(Sensor.TYPE_GYROSCOPE)
  }

  override fun onBind(intent: Intent?): IBinder? = null

  override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
    when (intent?.action) {
      ACTION_START -> {
        sessionId = intent.getStringExtra(EXTRA_SESSION_ID) ?: ""
        mode = intent.getStringExtra(EXTRA_MODE) ?: "japa"
        label = intent.getStringExtra(EXTRA_LABEL) ?: "Smarana"
        targetCount = max(1, intent.getIntExtra(EXTRA_TARGET_COUNT, 108))
        remainingCount = max(0, intent.getIntExtra(EXTRA_REMAINING_COUNT, targetCount))
        sensitivity = intent.getStringExtra(EXTRA_SENSITIVITY) ?: "medium"
        isPaused = false
        isActive = remainingCount > 0

        detector.setSensitivity(sensitivity)
        detector.reset()
        persistState()
        startInForeground()
        updateSensorsAndWakeLock()
        PocketJapaModule.emitUpdate(sessionId, remainingCount, isPaused, isActive, false)
      }
      ACTION_PAUSE -> {
        if (isActive && !isPaused) {
          isPaused = true
          persistState()
          updateSensorsAndWakeLock()
          updateNotification()
          PocketJapaModule.emitUpdate(sessionId, remainingCount, isPaused, isActive, false)
        }
      }
      ACTION_RESUME -> {
        if (isActive && isPaused && remainingCount > 0) {
          isPaused = false
          detector.reset()
          persistState()
          updateSensorsAndWakeLock()
          updateNotification()
          PocketJapaModule.emitUpdate(sessionId, remainingCount, isPaused, isActive, false)
        }
      }
      ACTION_SYNC -> {
        val synced = max(0, intent.getIntExtra(EXTRA_REMAINING_COUNT, remainingCount))
        remainingCount = synced
        if (remainingCount <= 0) {
          handleCompletion()
        } else {
          persistState()
          updateNotification()
        }
      }
      ACTION_STOP -> {
        stopServiceCleanly()
      }
    }
    return START_NOT_STICKY
  }

  override fun onSensorChanged(event: SensorEvent) {
    if (!isActive || isPaused || remainingCount <= 0) return

    when (event.sensor.type) {
      Sensor.TYPE_GYROSCOPE -> {
        detector.updateGyroscope(event.values[0], event.values[1], event.values[2])
      }
      Sensor.TYPE_ACCELEROMETER -> {
        val detected = detector.processAccelerometer(
          event.values[0],
          event.values[1],
          event.values[2],
          event.timestamp / 1_000_000L
        )
        if (detected) {
          onAcceptedDoubleTap()
        }
      }
    }
  }

  override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

  private fun onAcceptedDoubleTap() {
    if (!isActive || isPaused || remainingCount <= 0) return

    remainingCount = max(0, remainingCount - 1)
    if (remainingCount == 0) {
      handleCompletion()
    } else {
      vibrateShort()
      persistState()
      updateNotification()
      PocketJapaModule.emitUpdate(sessionId, remainingCount, isPaused, isActive, false)
    }
  }

  private fun handleCompletion() {
    isActive = false
    isPaused = false
    remainingCount = 0
    persistState()
    updateSensorsAndWakeLock()
    vibrateCompletion()
    showCompletionNotification()
    PocketJapaModule.emitUpdate(sessionId, 0, false, false, true)
    stopForeground(STOP_FOREGROUND_REMOVE)
    stopSelf()
  }

  private fun stopServiceCleanly() {
    isActive = false
    isPaused = false
    persistState()
    updateSensorsAndWakeLock()
    PocketJapaModule.emitUpdate(sessionId, remainingCount, false, false, false)
    stopForeground(STOP_FOREGROUND_REMOVE)
    stopSelf()
  }

  override fun onDestroy() {
    releaseWakeLock()
    unregisterSensors()
    super.onDestroy()
  }

  private fun startInForeground() {
    val notification = buildOngoingNotification()
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
      startForeground(
        NOTIFICATION_ID,
        notification,
        ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
      )
    } else {
      startForeground(NOTIFICATION_ID, notification)
    }
  }

  private fun updateNotification() {
    val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    nm.notify(NOTIFICATION_ID, buildOngoingNotification())
  }

  private fun buildOngoingNotification(): Notification {
    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
    val contentPendingIntent = PendingIntent.getActivity(
      this,
      0,
      launchIntent,
      PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    val toggleActionIntent = Intent(this, PocketJapaService::class.java).apply {
      action = if (isPaused) ACTION_RESUME else ACTION_PAUSE
    }
    val togglePendingIntent = PendingIntent.getService(
      this,
      1,
      toggleActionIntent,
      PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    val stopIntent = Intent(this, PocketJapaService::class.java).apply {
      action = ACTION_STOP
    }
    val stopPendingIntent = PendingIntent.getService(
      this,
      2,
      stopIntent,
      PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
    )

    val statusText = if (isPaused) {
      "Paused · \$remainingCount remaining"
    } else {
      "\$remainingCount remaining · Double-tap back to count"
    }

    return NotificationCompat.Builder(this, CHANNEL_ID)
      .setContentTitle("Smarana Pocket Mode · \$label")
      .setContentText(statusText)
      .setSmallIcon(android.R.drawable.ic_media_play)
      .setOngoing(true)
      .setOnlyAlertOnce(true)
      .setContentIntent(contentPendingIntent)
      .addAction(0, if (isPaused) "Resume" else "Pause", togglePendingIntent)
      .addAction(0, "Stop", stopPendingIntent)
      .build()
  }

  private fun showCompletionNotification() {
    val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
    val unit = if (mode == "pradakshina") "Pradakshinas" else "repetitions"
    val notification = NotificationCompat.Builder(this, COMPLETION_CHANNEL_ID)
      .setContentTitle(if (mode == "pradakshina") "Pradakshina Complete" else "Japa Complete")
      .setContentText("Completed \$targetCount \$unit — \$label")
      .setSmallIcon(android.R.drawable.ic_dialog_info)
      .setAutoCancel(true)
      .build()
    nm.notify(COMPLETION_NOTIFICATION_ID, notification)
  }

  private fun updateSensorsAndWakeLock() {
    if (isActive && !isPaused) {
      acquireWakeLock()
      registerSensors()
    } else {
      unregisterSensors()
      releaseWakeLock()
    }
  }

  private fun registerSensors() {
    accelSensor?.let {
      sensorManager?.registerListener(this, it, 10_000, 0)
    }
    gyroSensor?.let {
      sensorManager?.registerListener(this, it, 10_000, 0)
    }
  }

  private fun unregisterSensors() {
    sensorManager?.unregisterListener(this)
  }

  private fun acquireWakeLock() {
    if (wakeLock?.isHeld == true) return
    val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
    wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "Smarana::PocketJapaWakeLock").apply {
      setReferenceCounted(false)
      acquire(4 * 60 * 60 * 1000L) // 4h safety timeout
    }
  }

  private fun releaseWakeLock() {
    try {
      if (wakeLock?.isHeld == true) {
        wakeLock?.release()
      }
    } catch (_: Exception) {}
  }

  private fun getVibrator(): Vibrator {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      val vm = getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
      vm.defaultVibrator
    } else {
      @Suppress("DEPRECATION")
      getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
    }
  }

  private fun vibrateShort() {
    try {
      val v = getVibrator()
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        v.vibrate(VibrationEffect.createOneShot(45, VibrationEffect.DEFAULT_AMPLITUDE))
      } else {
        @Suppress("DEPRECATION")
        v.vibrate(45)
      }
    } catch (_: Exception) {}
  }

  private fun vibrateCompletion() {
    try {
      val v = getVibrator()
      val pattern = longArrayOf(0, 250, 120, 400)
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        v.vibrate(VibrationEffect.createWaveform(pattern, -1))
      } else {
        @Suppress("DEPRECATION")
        v.vibrate(pattern, -1)
      }
    } catch (_: Exception) {}
  }

  private fun persistState() {
    getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
      .edit()
      .putString("sessionId", sessionId)
      .putString("mode", mode)
      .putString("label", label)
      .putInt("targetCount", targetCount)
      .putInt("remainingCount", remainingCount)
      .putBoolean("isPaused", isPaused)
      .putBoolean("isActive", isActive)
      .putLong("updatedAt", System.currentTimeMillis())
      .apply()
  }

  private fun createChannels() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      val nm = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
      val pocketChannel = NotificationChannel(
        CHANNEL_ID,
        "Smarana Pocket Mode",
        NotificationManager.IMPORTANCE_LOW
      )
      nm.createNotificationChannel(pocketChannel)

      val completeChannel = NotificationChannel(
        COMPLETION_CHANNEL_ID,
        "Practice Completion",
        NotificationManager.IMPORTANCE_HIGH
      )
      nm.createNotificationChannel(completeChannel)
    }
  }
}
`;

const POCKET_JAPA_MODULE_KT = `package ${PACKAGE_NAME}.${POCKET_DIR}

import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class PocketJapaModule(private val reactCtx: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactCtx) {

  companion object {
    @Volatile
    private var activeContext: ReactApplicationContext? = null

    fun emitUpdate(
      sessionId: String,
      remainingCount: Int,
      isPaused: Boolean,
      isActive: Boolean,
      completed: Boolean
    ) {
      val ctx = activeContext ?: return
      if (!ctx.hasActiveReactInstance()) return
      val map = Arguments.createMap().apply {
        putString("sessionId", sessionId)
        putInt("remainingCount", remainingCount)
        putBoolean("isPaused", isPaused)
        putBoolean("isActive", isActive)
        putBoolean("completed", completed)
      }
      ctx
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit("PocketTapUpdate", map)
    }
  }

  init {
    activeContext = reactCtx
  }

  override fun getName(): String = "PocketJapaModule"

  @ReactMethod
  fun startPocketMode(
    sessionId: String,
    mode: String,
    label: String,
    targetCount: Int,
    remainingCount: Int,
    sensitivity: String
  ) {
    val intent = Intent(reactCtx, PocketJapaService::class.java).apply {
      action = PocketJapaService.ACTION_START
      putExtra(PocketJapaService.EXTRA_SESSION_ID, sessionId)
      putExtra(PocketJapaService.EXTRA_MODE, mode)
      putExtra(PocketJapaService.EXTRA_LABEL, label)
      putExtra(PocketJapaService.EXTRA_TARGET_COUNT, targetCount)
      putExtra(PocketJapaService.EXTRA_REMAINING_COUNT, remainingCount)
      putExtra(PocketJapaService.EXTRA_SENSITIVITY, sensitivity)
    }
    ContextCompat.startForegroundService(reactCtx, intent)
  }

  @ReactMethod
  fun pausePocketMode() {
    val intent = Intent(reactCtx, PocketJapaService::class.java).apply {
      action = PocketJapaService.ACTION_PAUSE
    }
    reactCtx.startService(intent)
  }

  @ReactMethod
  fun resumePocketMode() {
    val intent = Intent(reactCtx, PocketJapaService::class.java).apply {
      action = PocketJapaService.ACTION_RESUME
    }
    reactCtx.startService(intent)
  }

  @ReactMethod
  fun syncRemainingCount(remainingCount: Int) {
    val intent = Intent(reactCtx, PocketJapaService::class.java).apply {
      action = PocketJapaService.ACTION_SYNC
      putExtra(PocketJapaService.EXTRA_REMAINING_COUNT, remainingCount)
    }
    reactCtx.startService(intent)
  }

  @ReactMethod
  fun stopPocketMode() {
    val intent = Intent(reactCtx, PocketJapaService::class.java).apply {
      action = PocketJapaService.ACTION_STOP
    }
    reactCtx.startService(intent)
  }

  @ReactMethod
  fun getPocketState(promise: Promise) {
    val prefs = reactCtx.getSharedPreferences(PocketJapaService.PREFS_NAME, Context.MODE_PRIVATE)
    val sessionId = prefs.getString("sessionId", null)
    if (sessionId == null) {
      promise.resolve(null)
      return
    }
    val map = Arguments.createMap().apply {
      putString("sessionId", sessionId)
      putString("mode", prefs.getString("mode", "japa"))
      putInt("remainingCount", prefs.getInt("remainingCount", 0))
      putBoolean("isPaused", prefs.getBoolean("isPaused", false))
      putBoolean("isActive", prefs.getBoolean("isActive", false))
    }
    promise.resolve(map)
  }

  @ReactMethod
  fun addListener(eventName: String) {}

  @ReactMethod
  fun removeListeners(count: Int) {}
}
`;

const POCKET_JAPA_PACKAGE_KT = `package ${PACKAGE_NAME}.${POCKET_DIR}

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class PocketJapaPackage : ReactPackage {
  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> =
    listOf(PocketJapaModule(reactContext))

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
    emptyList()
}
`;

function withPocketJapaManifest(config) {
  return withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }

    for (const permission of REQUIRED_PERMISSIONS) {
      const exists = manifest['uses-permission'].some(
        (p) => p.$ && p.$['android:name'] === permission
      );
      if (!exists) {
        manifest['uses-permission'].push({
          $: { 'android:name': permission },
        });
      }
    }

    const app = manifest.application && manifest.application[0];
    if (app) {
      if (!app.service) {
        app.service = [];
      }
      const serviceName = '.pocket.PocketJapaService';
      const existingIndex = app.service.findIndex(
        (s) => s.$ && s.$['android:name'] === serviceName
      );
      const serviceEntry = {
        $: {
          'android:name': serviceName,
          'android:exported': 'false',
          'android:foregroundServiceType': 'specialUse',
        },
        property: [
          {
            $: {
              'android:name': 'android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE',
              'android:value':
                'Detects deliberate back-of-phone double-tap gestures during active Japa or Pradakshina sessions when the screen is locked.',
            },
          },
        ],
      };
      if (existingIndex >= 0) {
        app.service[existingIndex] = serviceEntry;
      } else {
        app.service.push(serviceEntry);
      }
    }

    return mod;
  });
}

function withPocketJapaSources(config) {
  return withDangerousMod(config, [
    'android',
    async (mod) => {
      const javaDir = path.join(
        mod.modRequest.platformProjectRoot,
        'app/src/main/java',
        ...PACKAGE_NAME.split('.'),
        POCKET_DIR
      );
      fs.mkdirSync(javaDir, { recursive: true });
      fs.writeFileSync(
        path.join(javaDir, 'PocketTapDetector.kt'),
        POCKET_TAP_DETECTOR_KT
      );
      fs.writeFileSync(
        path.join(javaDir, 'PocketJapaService.kt'),
        POCKET_JAPA_SERVICE_KT
      );
      fs.writeFileSync(
        path.join(javaDir, 'PocketJapaModule.kt'),
        POCKET_JAPA_MODULE_KT
      );
      fs.writeFileSync(
        path.join(javaDir, 'PocketJapaPackage.kt'),
        POCKET_JAPA_PACKAGE_KT
      );
      return mod;
    },
  ]);
}

function withPocketJapaMainApplication(config) {
  return withMainApplication(config, (mod) => {
    let contents = mod.modResults.contents;
    const importLine = `import ${PACKAGE_NAME}.${POCKET_DIR}.PocketJapaPackage`;
    if (!contents.includes(importLine)) {
      contents = contents.replace(
        /^package\s+.+$/m,
        (match) => `${match}\n\n${importLine}`
      );
    }
    if (!contents.includes('PocketJapaPackage()')) {
      contents = contents.replace(
        /PackageList\(this\)\.packages\.apply\s*\{/,
        (match) => `${match}\n              add(PocketJapaPackage())`
      );
    }
    mod.modResults.contents = contents;
    return mod;
  });
}

module.exports = function withPocketJapaService(config) {
  config = withPocketJapaManifest(config);
  config = withPocketJapaSources(config);
  config = withPocketJapaMainApplication(config);
  return config;
};
