package ru.GafolagBazor;

import java.math.BigInteger;

public class IdleProgress {
    private final ClickLogger clickLogger;
    private BigInteger idleIncome = BigInteger.ZERO;

    public IdleProgress(ClickLogger clickLogger, WebViewManager webViewManager) {
        this.clickLogger = clickLogger;
    }

    public void buyUpgrade() {
        if (idleIncome.equals(BigInteger.ZERO)) {
            idleIncome = BigInteger.ONE;
        } else {
            idleIncome = idleIncome.multiply(new BigInteger("2"));
        }
        System.out.println("[GBJFX (Idle)\\INFO] Idle upgrade bought! Current income: " + idleIncome + "/sec");
    }
}
