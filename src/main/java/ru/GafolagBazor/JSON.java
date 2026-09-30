package ru.GafolagBazor;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;

public class JSON {
    private final File clicksFile;
    private final File factorsFile;
    private final File idleFile;
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

    private final java.lang.reflect.Type clicksMapType = new TypeToken<LinkedHashMap<String, BigInteger>>() {}.getType();
    private final java.lang.reflect.Type nestedMapType = new TypeToken<LinkedHashMap<String, LinkedHashMap<String, BigInteger>>>() {}.getType();

    public JSON() {
        System.out.println("[GBJFX (JSON)\\INFO] Connecting progresses...");
        String baseDir = System.getProperty("user.dir") + File.separator + "assets" + File.separator + "progress" + File.separator;
        File checkLocal = new File("src/main/resources/assets/progress/clicks.json");
        if (checkLocal.exists()) {
            baseDir = "src/main/resources/assets/progress/";
        }
        this.clicksFile = new File(baseDir + "clicks.json");
        this.factorsFile = new File(baseDir + "factors.json");
        this.idleFile = new File(baseDir + "idleProgresses.json");
    }

    public String readHistory() {
        String json = "{}";
        if (clicksFile.exists() && clicksFile.length() > 4) {
            try (FileReader reader = new FileReader(clicksFile, StandardCharsets.UTF_8)) {
                LinkedHashMap<String, BigInteger> data = gson.fromJson(reader, clicksMapType);
                if (data != null) json = gson.toJson(data);
            } catch (Exception e) { e.printStackTrace(); }
        }
        return json;
    }

    private String readNested(File file) {
        String json = "{}";
        if (file.exists() && file.length() > 4) {
            try (FileReader reader = new FileReader(file, StandardCharsets.UTF_8)) {
                LinkedHashMap<String, LinkedHashMap<String, BigInteger>> data = gson.fromJson(reader, nestedMapType);
                if (data != null) json = gson.toJson(data);
            } catch (Exception e) { e.printStackTrace(); }
        }
        return json;
    }

    public String readFactors() { return readNested(factorsFile); }
    public String readIdle() { return readNested(idleFile); }

    public void saveClick(String sessionKey, BigInteger count) {
        LinkedHashMap<String, BigInteger> rootMap = new LinkedHashMap<>();
        if (clicksFile.exists() && clicksFile.length() > 4) {
            try (FileReader reader = new FileReader(clicksFile, StandardCharsets.UTF_8)) {
                LinkedHashMap<String, BigInteger> data = gson.fromJson(reader, clicksMapType);
                if (data != null) rootMap.putAll(data);
            } catch (Exception e) { e.printStackTrace(); }
        }
        rootMap.put(sessionKey, count);
        writeGeneric(clicksFile, rootMap);
    }

    public void saveNestedData(File file, String timeKey, BigInteger lvl, BigInteger cost) {
        LinkedHashMap<String, LinkedHashMap<String, BigInteger>> rootMap = new LinkedHashMap<>();
        if (file.exists() && file.length() > 4) {
            try (FileReader reader = new FileReader(file, StandardCharsets.UTF_8)) {
                LinkedHashMap<String, LinkedHashMap<String, BigInteger>> data = gson.fromJson(reader, nestedMapType);
                if (data != null) rootMap.putAll(data);
            } catch (Exception e) { e.printStackTrace(); }
        }

        LinkedHashMap<String, BigInteger> innerMap = new LinkedHashMap<>();
        innerMap.put("lvl", lvl);
        innerMap.put("cost", cost);
        rootMap.put(timeKey, innerMap);

        writeGeneric(file, rootMap);
    }

    public void saveFactor(String timeKey, BigInteger lvl, BigInteger cost) { saveNestedData(factorsFile, timeKey, lvl, cost); }
    public void saveIdle(String timeKey, BigInteger lvl, BigInteger cost) { saveNestedData(idleFile, timeKey, lvl, cost); }

    private void writeGeneric(File file, Object map) {
        File parentDir = file.getParentFile();
        if (parentDir != null && !parentDir.exists()) parentDir.mkdirs();
        try (FileWriter writer = new FileWriter(file, StandardCharsets.UTF_8)) {
            gson.toJson(map, writer);
        } catch (IOException e) { e.printStackTrace(); }
    }
}
