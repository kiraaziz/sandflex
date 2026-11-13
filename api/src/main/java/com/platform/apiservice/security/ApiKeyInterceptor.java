package com.platform.apiservice.security;

import com.platform.apiservice.dto.ApplicationAuthentifiee;
import com.platform.apiservice.service.ApiKeyAuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class ApiKeyInterceptor implements HandlerInterceptor {

    public static final String ATTRIBUT_APPLICATION = "applicationAuthentifiee";

    private final ApiKeyAuthService authService;

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) {
        String cle = request.getHeader("X-API-Key");
        ApplicationAuthentifiee application = authService.verifier(cle);
        request.setAttribute(ATTRIBUT_APPLICATION, application);
        return true;
    }
}