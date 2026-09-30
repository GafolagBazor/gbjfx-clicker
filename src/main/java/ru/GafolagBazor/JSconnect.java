package ru.GafolagBazor;

import javafx.scene.web.WebEngine;

@SuppressWarnings("removal")
public class JSconnect {
    private final ClickLogger clickLogger;
    private final IdleProgress idleProgress;
    private final JSON jsonManager;

    public JSconnect(ClickLogger clickLogger, IdleProgress idleProgress, JSON jsonManager) {
        this.clickLogger = clickLogger;
        this.idleProgress = idleProgress;
        this.jsonManager = jsonManager;
    }

    public void logClick(String countStr) {
        clickLogger.processClick(countStr);
    }

    public void logFactor(String timeKey, String lvlStr, String costStr) {
        jsonManager.saveFactor(timeKey, new java.math.BigInteger(lvlStr), new java.math.BigInteger(costStr));
    }

    public void logIdle(String timeKey, String lvlStr, String costStr) {
        jsonManager.saveIdle(timeKey, new java.math.BigInteger(lvlStr), new java.math.BigInteger(costStr));
    }

    public void buyIdle() {
        if (idleProgress != null) {
            idleProgress.buyUpgrade();
        }
    }

    public void syncWithJS(WebEngine engine, String base64History) {
        System.out.println("[GBJFX (JSconnect)\\INFO] Sync with JS...\n");
        try {
            netscape.javascript.JSObject window = (netscape.javascript.JSObject) engine.executeScript("window");
            window.setMember("javaApp", this);

            String base64Factors = java.util.Base64.getEncoder().encodeToString(jsonManager.readFactors().getBytes(java.nio.charset.StandardCharsets.UTF_8));
            String base64Idle = java.util.Base64.getEncoder().encodeToString(jsonManager.readIdle().getBytes(java.nio.charset.StandardCharsets.UTF_8));

            engine.executeScript("if(window.loadAllData) window.loadAllData('" + base64History + "', '" + base64Factors + "', '" + base64Idle + "');");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
