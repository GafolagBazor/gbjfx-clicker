package ru.GafolagBazor;

import javafx.concurrent.Worker;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import java.math.BigInteger;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class WebViewManager {
    private final WebView webView;
    private final WebEngine engine;

    public WebViewManager() {
        System.out.println("[GBJFX (App)\\INFO] Enabling WebView...");
        this.webView = new WebView();
        this.webView.setContextMenuEnabled(false);
        this.engine = webView.getEngine();
    }

    public void initWebView(JSconnect jsConnect, String historyJson) {
        System.out.println("[GBJFX (App)\\INFO] Connecting to JavaScript...");
        String base64History = Base64.getEncoder().encodeToString(historyJson.getBytes(StandardCharsets.UTF_8));

        engine.getLoadWorker().stateProperty().addListener((observable, oldValue, newValue) -> {
            if (newValue == Worker.State.SUCCEEDED) {
                jsConnect.syncWithJS(engine, base64History);
            }
        });

        System.out.println("[GBJFX (App)\\INFO] Connecting to HTML for WebView...");
        URL url = getClass().getResource("/assets/web/html.html");
        if (url != null) {
            engine.load(url.toExternalForm());
        }
    }

    public void updateUI(BigInteger count, BigInteger income, BigInteger cost) {
        try {
            engine.executeScript("if(window.updateIdleUI) window.updateIdleUI('" + count.toString() + "', '" + income.toString() + "', '" + cost.toString() + "');");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public WebView getWebView() {
        return webView;
    }
}
