package com.pestai

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class PestClassifierModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "PestClassifier"

  @ReactMethod
  fun classify(uri: String, promise: Promise) {
    val result = Arguments.createMap().apply {
      putString("label", "brown-planthopper")
      putDouble("confidence", 0.91)
    }
    promise.resolve(result)
  }
}

