package ru.GafolagBazor;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ClickLogger {
    private final JSON jsonManager;
    private final String sessionKey;
    private BigInteger currentCount = BigInteger.ZERO;

    public ClickLogger(JSON jsonManager) {
        this.jsonManager = jsonManager;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss.SS");
        this.sessionKey = LocalDateTime.now().format(formatter);
    }

    public void processClick(String countStr) {
        this.currentCount = new BigInteger(countStr);
        jsonManager.saveClick(sessionKey, currentCount);
    }

    public BigInteger getCurrentCount() {
        return currentCount;
    }

    public void setCurrentCount(BigInteger count) {
        this.currentCount = count;
        jsonManager.saveClick(sessionKey, currentCount);
    }

    public String getSessionKey() {
        return sessionKey;
    }
}
