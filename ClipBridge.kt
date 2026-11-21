// ClipBridge.kt — ponte entre a APK (WebView) e a página index-criador.html
// MODELO para adaptar ao seu projeto (não testado). Troque o package pelo da sua app.
// NÃO precisa de nenhuma permissão nova no AndroidManifest.
//
// Limite do Android: a partir do Android 10, uma app só lê a área de transferência quando está
// em primeiro plano. Nenhuma permissão muda isso. Por isso há 2 caminhos:
//   1) copiar enquanto a app está aberta/visível (o ouvinte abaixo apanha);
//   2) Compartilhar → ADM Play, de qualquer app (funciona sempre, mesmo em segundo plano).

package com.seuapp.admplay

import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.webkit.JavascriptInterface

object LinkStore {
    private const val P = "adm_links"
    private val LINK = Regex("https?://\\S+")

    fun ligado(c: Context) = c.getSharedPreferences(P, 0).getBoolean("on", false)
    fun setLigado(c: Context, v: Boolean) = c.getSharedPreferences(P, 0).edit().putBoolean("on", v).apply()

    // Só guarda se o texto for APENAS link(s); qualquer outra coisa é ignorada.
    fun adicionar(c: Context, texto: String?) {
        val partes = (texto ?: return).trim().split(Regex("[\\s,;]+")).filter { it.isNotEmpty() }
        if (partes.isEmpty() || partes.any { !LINK.matches(it) }) return
        val sp = c.getSharedPreferences(P, 0)
        val lista = (sp.getString("fila", "") ?: "").split("\n").filter { it.isNotEmpty() }.toMutableList()
        partes.forEach { if (!lista.contains(it)) lista.add(it) }
        sp.edit().putString("fila", lista.joinToString("\n")).apply()
    }

    // Entrega os links guardados e esvazia a fila (a página já os guarda do lado dela).
    fun levar(c: Context): String {
        val sp = c.getSharedPreferences(P, 0)
        val v = sp.getString("fila", "") ?: ""
        sp.edit().putString("fila", "").apply()
        return v
    }
}

// Nome na página: window.AndroidClip
class ClipBridge(private val ctx: Context) {
    @JavascriptInterface fun ligar() = LinkStore.setLigado(ctx, true)
    @JavascriptInterface fun desligar() = LinkStore.setLigado(ctx, false)
    @JavascriptInterface fun pegarLinks(): String = LinkStore.levar(ctx)
    @JavascriptInterface fun limpar() { LinkStore.levar(ctx) }
}

/* ===== Na sua MainActivity =====

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // ... (o seu código que cria o webView) ...
    webView.settings.javaScriptEnabled = true
    webView.addJavascriptInterface(ClipBridge(this), "AndroidClip")

    // Copiar com a app aberta: guarda se o "Quero publicar" estiver ligado
    val cm = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
    cm.addPrimaryClipChangedListener {
        if (LinkStore.ligado(this)) {
            val t = cm.primaryClip?.getItemAt(0)?.coerceToText(this)?.toString()
            LinkStore.adicionar(this, t)
        }
    }
    receberPartilha(intent)
}

override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    receberPartilha(intent)
}

// Compartilhar → ADM Play (funciona de qualquer app, mesmo em segundo plano)
private fun receberPartilha(i: Intent?) {
    if (i?.action == Intent.ACTION_SEND && i.type == "text/plain")
        LinkStore.adicionar(this, i.getStringExtra(Intent.EXTRA_TEXT))
}

===== No AndroidManifest.xml, dentro da <activity> principal =====
(e use android:launchMode="singleTask" nessa activity, para o onNewIntent funcionar)

<intent-filter>
    <action android:name="android.intent.action.SEND"/>
    <category android:name="android.intent.category.DEFAULT"/>
    <data android:mimeType="text/plain"/>
</intent-filter>
*/
