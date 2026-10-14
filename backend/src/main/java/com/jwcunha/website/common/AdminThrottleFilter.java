package com.jwcunha.website.common;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.jwcunha.website.config.AppProperties;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Slows down password guessing on the admin API: after N failed logins (401) from one address inside the window,
 * further admin requests from it get 429 until the window passes. A successful login clears the counter.
 * Wraps the security chain (high precedence) so it can see the 401 that Spring Security produces.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class AdminThrottleFilter extends OncePerRequestFilter {

    private final int maxFailures;
    private final long windowNanos;
    private final ConcurrentHashMap<String, Deque<Long>> failures = new ConcurrentHashMap<>();

    public AdminThrottleFilter(AppProperties props) {
        var t = props.adminThrottle();
        this.maxFailures = t == null || t.maxFailures() <= 0 ? 10 : t.maxFailures();
        this.windowNanos = Duration.ofSeconds(t == null || t.windowSeconds() <= 0 ? 900 : t.windowSeconds()).toNanos();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/admin");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String ip = req.getRemoteAddr();
        long now = System.nanoTime();
        Deque<Long> q = failures.computeIfAbsent(ip, k -> new ArrayDeque<>());
        boolean blocked;
        synchronized (q) {
            while (!q.isEmpty() && now - q.peekFirst() > windowNanos) {
                q.pollFirst();
            }
            blocked = q.size() >= maxFailures;
        }
        if (blocked) {
            res.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            res.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
            res.getWriter().write("{\"title\":\"Too many attempts\",\"status\":429,"
                    + "\"detail\":\"Too many failed logins. Try again later.\"}");
            return;
        }
        chain.doFilter(req, res);
        synchronized (q) {
            if (res.getStatus() == HttpStatus.UNAUTHORIZED.value()) {
                q.addLast(System.nanoTime());
            } else if (res.getStatus() < 400) {
                q.clear();
            }
        }
        if (failures.size() > 10_000) {
            failures.entrySet().removeIf(e -> e.getValue().isEmpty());
        }
    }
}
