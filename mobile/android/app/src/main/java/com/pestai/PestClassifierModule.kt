package com.pestai

import com.facebook.react.bridge.*
import org.pytorch.IValue
import org.pytorch.Module
import org.pytorch.Tensor
import org.pytorch.torchvision.TensorImageUtils
import android.graphics.BitmapFactory
import kotlin.math.exp

class PestClassifierModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val labels = arrayOf(
        "brown-planthopper",
        "green-leafhopper",
        "rice-leaf-folder",
        "rice-bug",
        "stem-borer",
        "whorl-maggot"
    )
    private var module: Module? = null

    override fun getName() = "PestClassifier"

    private fun loadModel(): Module {
        if (module == null) {
            val path = AssetFileLoader.copyAsset(reactApplicationContext, "models/model_rice_pest.ptl")
            module = Module.load(path)
        }
        return module!!
    }

    @ReactMethod
    fun classify(uri: String, promise: Promise) {
        try {
            val bitmap = BitmapFactory.decodeFile(uri)
            val tensor = TensorImageUtils.bitmapToFloat32Tensor(bitmap, 0f, 1f, floatArrayOf(0f,0f,0f), floatArrayOf(1f,1f,1f))
            val input = tensor.unsqueeze(0)
            val output = loadModel().forward(IValue.from(input)).toTensor().dataAsFloatArray
            val exps = output.map { exp(it.toDouble()) }
            val sum = exps.sum()
            val probs = exps.map { (it/sum).toFloat() }
            val idx = probs.indices.maxByOrNull { probs[it] } ?: 0
            val map = Arguments.createMap().apply {
                putString("label", labels[idx])
                putDouble("confidence", probs[idx].toDouble())
            }
            promise.resolve(map)
        } catch (e: Exception) {
            promise.reject(e)
        }
    }
}
