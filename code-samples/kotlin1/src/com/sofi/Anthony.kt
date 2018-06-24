package com.sofi

import java.util.*

class Anthony {
    companion object {
        @JvmStatic fun main(args: Array<String>) {
            print(Anthony().getMessage())
        }
    }
    var range = 1000
    val messageMap : NavigableMap<Int, String> = sortedMapOf(
            Pair(10, "yesterday"),
            Pair(100, "today"),
            Pair(range, "2018")
        ) as NavigableMap<Int, String>
    fun getMessage(): String {
        return (
            String(Base64.getDecoder().decode("QW50aG9ueSB3aWxsIElQTyBTb2ZpIA==")) +
            messageMap.ceilingEntry(Random().nextInt(range)).value
        )
    }
}