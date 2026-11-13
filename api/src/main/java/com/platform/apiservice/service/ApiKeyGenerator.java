package com.platform.apiservice.service;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.HexFormat;

@Component
public class ApiKeyGenerator {

    private final SecureRandom random = new SecureRandom();

    public String genererPrefix() {
        return aleatoireHex(4);
    }

    public String genererSecret() {
        return aleatoireHex(24);
    }

    public String hasher(String cle) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(cle.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 indisponible", e);
        }
    }

    private String aleatoireHex(int nombreOctets) {
        byte[] octets = new byte[nombreOctets];
        random.nextBytes(octets);
        return HexFormat.of().formatHex(octets);
    }
}