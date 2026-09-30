package ru.GafolagBazor;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;
import java.net.URL;

public class Main extends Application {
    private static WebViewManager webViewManager;
    private static JSON jsonManager;
    private static ClickLogger clickLogger;
    private static IdleProgress idleProgress;
    private static JSconnect jsConnect;

    @Override
    public void start(Stage primaryStage) {
        jsonManager = new JSON();
        clickLogger = new ClickLogger(jsonManager);
        webViewManager = new WebViewManager();
        idleProgress = new IdleProgress(clickLogger, webViewManager);
        jsConnect = new JSconnect(clickLogger, idleProgress, jsonManager);

        System.out.println("[GBJFX (Main)\\INFO] Reading json...");
        String historyJson = jsonManager.readHistory();

        webViewManager.initWebView(jsConnect, historyJson);

        System.out.println("[GBJFX (Main)\\INFO] Applying icon for window...");
        URL iconUrl = getClass().getResource("/assets/icon/icon.png");
        if (iconUrl != null) {
            primaryStage.getIcons().add(new Image(iconUrl.toExternalForm()));
        }

        System.out.println("[GBJFX (Main)\\INFO] Creating window...");
        Scene scene = new Scene(webViewManager.getWebView(), 1550, 940);
        primaryStage.setTitle("GafBazJavaFX (кликер)");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void run(String[] args) {
        launch(args);
    }
}
