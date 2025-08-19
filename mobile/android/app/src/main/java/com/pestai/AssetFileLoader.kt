package com.pestai

import android.content.Context
import java.io.File

object AssetFileLoader {
    fun copyAsset(context: Context, assetName: String): String {
        val file = File(context.filesDir, assetName)
        if (!file.exists()) {
            file.parentFile?.mkdirs()
            context.assets.open(assetName).use { input ->
                file.outputStream().use { output -> input.copyTo(output) }
            }
        }
        return file.absolutePath
    }
}
