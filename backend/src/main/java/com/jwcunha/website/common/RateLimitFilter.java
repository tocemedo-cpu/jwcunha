package com.jwcunha.website.common;

import java.io.IOException;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

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
 * Sliding-window limiter for the public submission endpoint, keyed by client address.
 * In-memory: adequate for a single instance; use a shared store if scaled horizontally.
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final int max;
    private final long windowNanos;
    private final ConcurrentHashMap<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    public RateLimitFilter(AppProperties props) {
        var rl = props.rateLimit();
        this.max = rl == null || rl.maxRequests() <= 0 ? 5 : rl.maxRequests();
        int secs = rl == null || rl.windowSeconds() <= 0 ? 600 : rl.windowSeconds();
        this.windowNanos = Duration.ofSeconds(secs).toNanos();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !(request.getMethod().equals("POST") && request.getRequestURI().equals("/api/contact"));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        long now = System.nanoTime();
        Deque<Long> q = hits.computeIfAbsent(req.getRemoteAddr(), k -> new ArrayDeque<>());
        boolean allowed;
        synchronized (q) {
            while (!q.isEmpty() && now - q.peekFirst() > windowNanos) {
                q.pollFirst();
            }
            allowed = q.size() < max;
            if (allowed) {
                q.addLast(now);
            }
        }
        if (hits.size() > 10_000) {
            hits.entrySet().removeIf(e -> e.getValue().isEmpty());
        }
        if (!allowed) {
            res.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            res.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
            res.getWriter().write("{\"title\":\"Too many requests\",\"status\":429,"
                    + "\"detail\":\"Too many submissions. Please try again later.\"}");
            return;
        }
        chain.doFilter(req, res);
    }
}
