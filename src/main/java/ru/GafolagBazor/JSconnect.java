package ru.GafolagBazor;

import javafx.scene.web.WebEngine;

@SuppressWarnings("removal")
public class JSconnect {
    private final ClickLogger clickLogger;
    private final IdleProgress idleProgress;

    public JSconnect(ClickLogger clickLogger, IdleProgress idleProgress) {
        this.clickLogger = clickLogger;
        this.idleProgress = idleProgress;
    }

    public void logClick(String countStr) {
        clickLogger.processClick(countStr);
    }

    public void buyIdle() {
        if (idleProgress != null) {
            idleProgress.buyUpgrade();
        }
    }

    public void syncWithJS(WebEngine engine, String base64History) {
        try {
            netscape.javascript.JSObject window = (netscape.javascript.JSObject) engine.executeScript("window");
            window.setMember("javaApp", this);
            engine.executeScript("if(window.loadSessions) window.loadSessions('" + base64History + "');");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
