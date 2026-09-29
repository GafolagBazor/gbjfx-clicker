package ru.GafolagBazor;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.lang.reflect.Type;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;

public class JSON {
    private final File jsonFile;
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();
    private final Type mapType = new TypeToken<LinkedHashMap<String, BigInteger>>() {}.getType();

    public JSON() {
        this.jsonFile = new File("src/main/resources/assets/clicks/clicks.json").exists()
                ? new File("src/main/resources/assets/clicks/clicks.json")
                : new File(System.getProperty("user.dir") + File.separator + "assets" + File.separator + "clicks" + File.separator + "clicks.json");
    }

    public String readHistory() {
        String historyJson = "{}";
        if (jsonFile.exists() && jsonFile.length() > 4) {
            try (FileReader reader = new FileReader(jsonFile, StandardCharsets.UTF_8)) {
                LinkedHashMap<String, BigInteger> existingData = gson.fromJson(reader, mapType);
                if (existingData != null) {
                    historyJson = gson.toJson(existingData);
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return historyJson;
    }

    public void saveClick(String sessionKey, BigInteger count) {
        LinkedHashMap<String, BigInteger> rootMap = new LinkedHashMap<>();
        File parentDir = jsonFile.getParentFile();
        if (parentDir != null && !parentDir.exists()) {
            parentDir.mkdirs();
        }
        if (jsonFile.exists() && jsonFile.length() > 4) {
            try (FileReader reader = new FileReader(jsonFile, StandardCharsets.UTF_8)) {
                LinkedHashMap<String, BigInteger> existingData = gson.fromJson(reader, mapType);
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
}
