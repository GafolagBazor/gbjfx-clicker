package ru.GafolagBazor;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import javafx.application.Application;
import javafx.concurrent.Worker;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.scene.web.WebEngine;
import javafx.scene.web.WebView;
import javafx.stage.Stage;
import netscape.javascript.JSObject;

import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.LinkedHashMap;

@SuppressWarnings("removal")
public class App extends Application {
    private final File jsonFile = new File("src/main/resources/assets/clicks/clicks.json").exists()
            ? new File("src/main/resources/assets/clicks/clicks.json")
            : new File(System.getProperty("user.dir") + File.separator + "assets" + File.separator + "clicks" + File.separator + "clicks.json");
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss.SS");
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private final Type mapType = new TypeToken<LinkedHashMap<String, Integer>>() {}.getType();
    private final String sessionKey = LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss.SS"));

    @Override
    public void start(Stage primaryStage) {
        System.out.println("[GBJFX (App)\\INFO] Enabling WebView...");
        WebView webView = new WebView();
        webView.setContextMenuEnabled(false);

        System.out.println("[GBJFX (App)\\INFO] Reading json...");
        String historyJson = "{}";
        if (jsonFile.exists() && jsonFile.length() > 4) {
            try (FileReader reader = new FileReader(jsonFile, StandardCharsets.UTF_8)) {
                LinkedHashMap<String, Integer> existingData = gson.fromJson(reader, mapType);
                if (existingData != null) {
                    historyJson = gson.toJson(existingData);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        System.out.println("[GBJFX (App)\\INFO] Connecting to JavaScript...");
        String base64History = Base64.getEncoder().encodeToString(historyJson.getBytes(StandardCharsets.UTF_8));
        WebEngine engine = webView.getEngine();
        engine.getLoadWorker().stateProperty().addListener((observable, oldValue, newValue) -> {
            if (newValue == Worker.State.SUCCEEDED) {
                try {
                    JSObject window = (JSObject) engine.executeScript("window");
                    window.setMember("javaApp", this);
                    engine.executeScript("if(window.loadSessions) window.loadSessions('" + base64History + "');");
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        System.out.println("[GBJFX (App)\\INFO] Connecting to HTML for WebView...");
        URL url = getClass().getResource("/assets/web/html.html");
        if (url != null) {
            engine.load(url.toExternalForm());
        }

        System.out.println("[GBJFX (App)\\INFO] Applying icon for window...");
        URL iconUrl = getClass().getResource("/assets/icon/icon.png");
        if (iconUrl != null) {
            primaryStage.getIcons().add(new Image(iconUrl.toExternalForm()));
        }

        System.out.println("[GBJFX (App)\\INFO] Creating window...\n");
        Scene scene = new Scene(webView, 1280, 720);
        primaryStage.setTitle("GafBazJavaFX (кликер)");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public void logClick(int count) {
        LinkedHashMap<String, Integer> rootMap = new LinkedHashMap<>();

        File parentDir = jsonFile.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }

        if (jsonFile.exists() && jsonFile.length() > 4) {
            try (FileReader reader = new FileReader(jsonFile, StandardCharsets.UTF_8)) {
                LinkedHashMap<String, Integer> existingData = gson.fromJson(reader, mapType);
                if (existingData != null) {
                    rootMap.putAll(existingData);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        rootMap.put(sessionKey, count);

        try (FileWriter writer = new FileWriter(jsonFile, StandardCharsets.UTF_8)) {
            gson.toJson(rootMap, writer);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void run(String[] args) {
        launch(args);
    }
}
